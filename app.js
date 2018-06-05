/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const boom = require('boom')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { verifyToken } = require('./utilities/jwtUtil')
const { retrieveUser } = require('./utilities/dbUtils')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')

const signupRouter = require('./routes/signup')
const eventsRouter = require('./routes/events')
const loginRouter = require('./routes/login')
const usersRouter = require('./routes/users')
const confirmationRouter = require('./routes/confirmation')

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

// View engine setup
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/login', loginRouter)
app.use('/signup', signupRouter)
app.use('/events', verifyToken, retrieveUser, eventsRouter)
app.use('/users', verifyToken, retrieveUser, usersRouter)
app.use('/confirmation', confirmationRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(boom.notFound())
})

// error handler
app.use((err, req, res, next) => {
  console.log('all-catch err: ', err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json(err)
})

app.listen(8000, () => 'Server listens...')

module.exports = app
