/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
/* eslint-disable no-underscore-dangle */
const socketio = require('socket.io')
const MessageService = require('../database/services/messageService')
const UserService = require('../database/services/userService')
const {
  JOIN,
  GET_PREVIOUS_MESSAGES,
  SEND_MESSAGE,
  SEND_JOIN_REQUEST,
  CHATMATES,
  PREVIOUS_MESSAGES,
  MESSAGE
} = require('./chatProtocol')

const getAvatar = user => {
  return user.images.length > 0 ? user.images[0].image_url : null
}

const getChatUserName =
  user => `${user.first_name} ${user.last_name.charAt(0)}`

const getChatUserFromChatmate = entry => {
  return {
    _id: entry.id,
    name: getChatUserName(entry),
    avatar: entry.image_url,
    lastMessage: {
      createdAt: entry.sent_at,
      text: entry.message,
      isIncoming: entry.is_incoming,
      type: entry.message_type
    }
  }
}

const getChatUserFromUser = user => {
  return {
    _id: user.id,
    name: getChatUserName(user),
    avatar: getAvatar(user),
    lastMessage: null
  }
}

const startChat = server => {
  const sockets = {}
  const websocket = socketio(server)

  websocket.on('connection', (socket) => {
    const messageService = new MessageService()
    const userService = new UserService()
    let sessionUserId = null
    // console.log('CHAT: A client just joined on', socket.id)

    socket.on('disconnect', () => {
      // console.log('CHAT: user disconnected')
      if (sessionUserId !== null && sessionUserId in sockets) {
        delete sockets[sessionUserId]
      }
    })

    socket.on(JOIN, (userId) => {
      // console.log('CHAT: user requested to join', userId)
      sessionUserId = userId
      sockets[sessionUserId] = socket.id
      // TODO: Add here last message or at least timestamp of last message
      messageService.getChatMates(userId).then(chatmates => {
        const chatUsers = chatmates.map(
          chatmate => getChatUserFromChatmate(chatmate)
        )
        // console.log('CHAT: JOIN', chatUsers)
        socket.emit(CHATMATES, chatUsers)
      })
    })

    socket.on(GET_PREVIOUS_MESSAGES, (userId, chatmateId) => {
      // console.log('CHAT: user requested previous messages', userId, chatmateId)
      // TODO: Query and send user last X messages instead all
      // And implement onscroll...

      const userPromise = userService.getById(userId)
      const chatmatePromise = userService.getById(chatmateId)
      const messagesPromise = messageService.getMessages(userId, chatmateId)
      Promise.all([userPromise, chatmatePromise, messagesPromise]).then(values => {
        const [user, chatmate, messages] = values
        const userAvatar = getAvatar(user)
        const chatmateAvatar = getAvatar(chatmate)
        const chatMessages = messages.map(message => {
          const username = getChatUserName(
            userId === message.sender ? user : message
          )
          const avatar = userId === message.sender ? userAvatar : chatmateAvatar
          return {
            _id: message.id,
            text: message.message,
            createdAt: message.sent_at,
            type: message.message_type,
            user: {
              _id: message.sender,
              name: username,
              avatar
            }
          }
        })
        // console.log(
        //   'CHAT: PREVIOUS_MESSAGES', getChatUserFromUser(chatmate),
        //   chatMessages.legnth
        // )
        socket.emit(
          PREVIOUS_MESSAGES, getChatUserFromUser(chatmate), chatMessages
        )
      })
    })

    socket.on(SEND_MESSAGE, (chatmateId, message) => {
      // console.log('CHAT: user sent message', message, 'to', chatmateId)
      const serverMessage = {
        id: message._id,
        message: message.text,
        sender: message.user._id,
        recipient: chatmateId,
        sent_at: message.createdAt,
        type: 'directChat'
      }
      // console.log('SEND_MESSAGE', chatmateId, message)
      messageService.insert(serverMessage).then(() => {
        if (chatmateId in sockets) {
          socket.to(sockets[chatmateId]).emit(MESSAGE, message)
        } else {
          console.log('CHAT WARNING: SEND_MESSAGE socked not found for', chatmateId)
        }
      })
    })

    socket.on(SEND_JOIN_REQUEST, (chatmateId, message) => {
      // console.log('Request to Join: user sent message', message, 'to', chatmateId)
      const serverMessage = {
        id: message._id,
        message: message.text,
        sender: message.user._id,
        recipient: chatmateId,
        sent_at: message.createdAt,
        type: 'joinRequest'
      }
      messageService.insert(serverMessage).then(() => {
        if (chatmateId in sockets) {
          socket.to(sockets[chatmateId]).emit(MESSAGE, message)
        } else {
          console.log('CHAT WARNING: SEND_MESSAGE socked not found for', chatmateId)
        }
      })
    })
  })
}

module.exports = startChat
