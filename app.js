/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const boom = require('boom')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { verifyToken } = require('./utilities/jwtUtil')

const eventsRouter = require('./routes/events')
const loginRouter = require('./routes/login')
const usersRouter = require('./routes/users')

const app = express()
app.disable('x-powered-by')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public')))

// CORS options in header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE, PUT')
  res.header('Referrer-Policy', 'no-referrer')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  else {
    next()
  }
})

app.use('/login', loginRouter)
app.use('/events', verifyToken, eventsRouter)
app.use('/users', verifyToken, usersRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(boom.notFound())
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json(err)
})

module.exports = app
