/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
/* eslint-disable no-underscore-dangle */
const http = require('http')
const socketio = require('socket.io')
const MessageService = require('../database/services/messageService')
const UserService = require('../database/services/userService')
const ProfileImageService = require('../database/services/profileImageService')
const {
  JOIN,
  GET_PREVIOUS_MESSAGES,
  SEND_MESSAGE,
  CHATMATES,
  PREVIOUS_MESSAGES,
  MESSAGE
} = require('./chatProtocol')

const getChatUserName =
  user => `${user.first_name} ${user.last_name.charAt(0)}`

const getChatUser = user => {
  return {
    _id: user.id,
    name: getChatUserName(user),
    avatar: user.image_url
  }
}

const getAvatar = profileImages => {
  return profileImages.length > 0 ? profileImages[0].image_url : null
}

const startChat = app => {
  const sockets = {}
  const server = http.Server(app)
  const websocket = socketio(server)
  server.listen(8001, () => console.log('CHAT: listening on *:8001'))

  websocket.on('connection', (socket) => {
    const messageService = new MessageService()
    const userService = new UserService()
    const profileImageService = new ProfileImageService()
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
        socket.emit(CHATMATES, chatmates.map(chatmate => getChatUser(chatmate)))
      })
    })

    socket.on(GET_PREVIOUS_MESSAGES, (userId, chatmateId) => {
      // console.log('CHAT: user requested previous messages', userId, chatmateId)
      // TODO: Query and send user last X messages instead all
      // And implement onscroll...

      const userAvatarsPromise = profileImageService.getProfileImages(userId)
      const chatmateAvatarsPromise = profileImageService.getProfileImages(chatmateId)
      const userPromise = userService.getById(userId, false)
      const messagesPromise = messageService.getMessages(userId, chatmateId)
      Promise.all([
        userAvatarsPromise, chatmateAvatarsPromise, userPromise, messagesPromise
      ]).then(values => {
        const [userAvatars, chatmateAvatars, user, messages] = values
        const userAvatar = getAvatar(userAvatars)
        const chatmateAvatar = getAvatar(chatmateAvatars)
        const chatMessages = messages.map(message => {
          const username = getChatUserName(
            userId === message.sender ? user : message
          )
          const avatar = userId === message.sender ? userAvatar : chatmateAvatar
          return {
            _id: message.id,
            text: message.message,
            createdAt: message.sent_at,
            user: {
              _id: message.sender,
              name: username,
              avatar
            }
          }
        })
        socket.emit(PREVIOUS_MESSAGES, chatmateId, chatMessages)
      })
    })

    socket.on(SEND_MESSAGE, (chatmateId, message) => {
      // console.log('CHAT: user sent message', message, 'to', chatmateId)
      const serverMessage = {
        id: message._id,
        message: message.text,
        sender: message.user._id,
        recipient: chatmateId,
        sent_at: message.createdAt
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
