/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const http = require('http')
const socketio = require('socket.io')

const testMessage1 = {
  _id: 1,
  text: 'THIS IS TEST MESSAGE1',
  createdAt: new Date(),
  user: {
    _id: 2,
    name: 'USER2'
  }
}

const testMessage2 = {
  _id: 2,
  text: 'THIS IS TEST MESSAGE2',
  createdAt: new Date(),
  user: {
    _id: 2,
    name: 'USER2'
  }
}

const testMessage3 = {
  _id: 3,
  text: 'THIS IS TEST MESSAGE3',
  createdAt: new Date(),
  user: {
    _id: 1,
    name: 'USER1'
  }
}
const startChat = app => {
  const sockets = {}
  const server = http.Server(app)
  const websocket = socketio(server)
  server.listen(8001, () => console.log('listening on *:8001'))

  websocket.on('connection', (socket) => {
    let userId = null
    console.log('A client just joined on', socket.id)
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
    socket.on('join', (request) => {
      console.log('user requested to join', request)
      userId = request.userId
      sockets[userId] = socket
    })
    socket.on('getMessages', (request) => {
      // TODO: Verify user joined chat
      console.log('user requested messages', request)
      // TODO: Send user last X messages between him and other user
      socket.emit('message', [testMessage1, testMessage2, testMessage3])
    })
    socket.on('message', (to, message) => {
      // TODO: Verify user joined chat
      console.log('user sent message', message)
      // TODO: Store the message
      if (to in sockets) {
        socket.to(sockets[to]).emit('message', [message])
      }
    })
  })
}

module.exports = startChat
