/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const http = require('http')
const socketio = require('socket.io')
const MessageService = require('../database/services/messageService')
const UserService = require('../database/services/userService')
const {
  JOIN,
  GET_PREVIOUS_MESSAGES,
  SEND_MESSAGE,
  CHATMATES,
  PREVIOUS_MESSAGES,
  MESSAGE
} = require('./chatProtocol')
const moment = require('moment')

const getChatUserName =
  user => `${user.first_name} ${user.last_name.charAt(0)}`

const getChatUser = user => {
  return {
    _id: user.id,
    name: getChatUserName(user),
    avatar: user.image_url
  }
}

const startChat = app => {
  const sockets = {}
  const server = http.Server(app)
  const websocket = socketio(server)
  server.listen(8001, () => console.log('CHAT: listening on *:8001'))

  websocket.on('connection', (socket) => {
    const messageService = new MessageService()
    const userService = new UserService()
    let sessionUserId = null
    console.log('CHAT: A client just joined on', socket.id)

    socket.on('disconnect', () => {
      console.log('CHAT: user disconnected')
      if (sessionUserId !== null && sessionUserId in sockets) {
        delete sockets[sessionUserId]
      }
    })

    socket.on(JOIN, (userId) => {
      console.log('CHAT: user requested to join', userId)
      sessionUserId = userId
      sockets[sessionUserId] = socket.id
      messageService.getChatMates(userId).then(chatmates => {
        socket.emit(CHATMATES, chatmates.map(chatmate => getChatUser(chatmate)))
      })
    })

    socket.on(GET_PREVIOUS_MESSAGES, (userId, chatmateId) => {
      console.log('CHAT: user requested previous messages', userId, chatmateId)
      // TODO: Query and send user last X messages instead all
      // And implement onscroll...
      userService.getById(userId, false).then(user => {
        messageService.getMessages(userId, chatmateId).then(messages => {
          const chatMessages = messages.map(message => {
            const username = getChatUserName(
              userId === message.sender ? user : message
            )
            return {
              _id: message.id,
              text: message.message,
              createdAt: message.sent_at,
              user: {
                _id: message.sender,
                name: username
              }
            }
          })
          // TODO: Make it more efficient than each time creating moment
          const sortedChatMessages = chatMessages.sort(
            // Use reverse order (b-a instead a-b) so that new messages
            // appear at the bottom
            (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
          )
          socket.emit(PREVIOUS_MESSAGES, sortedChatMessages)
        })
      })
    })

    socket.on(SEND_MESSAGE, (chatmateId, message) => {
      console.log('CHAT: user sent message', message, 'to', chatmateId)
      const serverMessage = {
        id: message._id, // eslint-disable-line no-underscore-dangle
        message: message.text,
        sender: message.user._id, // eslint-disable-line no-underscore-dangle
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
