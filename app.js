const boom = require('boom')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const usersRouter = require('./routes/users')
const eventsRouter = require('./routes/events')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public')))

app.use('/users', usersRouter)
app.use('/events', eventsRouter)

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
