/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const uuid = require('uuid')
const boom = require('boom')
const jwt = require('jsonwebtoken')

const UserService = require('../database/services/userService')
const TokenService = require('../database/services/tokenService')
const { TOKEN_EXPIRED } = require('./constants')

const userService = new UserService()
const tokenService = new TokenService()

function retrieveUser(req, res, next) {
  if (req.email) {
    userService.getByEmail(req.email, false)
      .then((user) => {
        req.user = user
        next()
      }).catch(() => {
        next(boom.unauthorized())
      })
  } else {
    next(boom.unauthorized())
  }
}

const ONE_DAY = 1000 * 3600 * 24

function isTokenExpired(code) {
  return new Promise((resolved, rejected) => {
    tokenService.get(code)
      .then((record) => {
        const created_at = new Date(record.created_at)
        const tokenAge = Date.now() - created_at
        // change later to 10 minutes
        if (tokenAge > ONE_DAY) {
          rejected({ err: TOKEN_EXPIRED })
        } else {
          resolved(record)
        }
      })
      .catch((err) => rejected(err))
  })
}

function checkToken(email, code) {
  return isTokenExpired(code)
    .then(() => {
      return userService.getByEmail(email).then((userRecord) => {
        const payload = { email: userRecord.email, userId: userRecord.id }
        const sessionToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
        return { user: userRecord, token: sessionToken }
      })
    })
}

console.log(uuid())

module.exports = {
  retrieveUser, checkToken
}
