/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserService = require('../database/services/userService')
const TokenService = require('../database/services/tokenService')
const { invalidInput, constructFailure } = require('../utilities/routeUtil')
const { NOT_VERIFIED, BAD_EMAIL_OR_PASSWORD, DATABASE_ERROR } = require('../utilities/constants')

require('dotenv').config()

const ONE_DAY = 1000 * 3600 * 24

router.post('/', (req, res, next) => {
  const { email, password } = req.body
  console.log("login:",email,password)
  if (email && password) {
    const userService = new UserService()
    userService.getByEmail(email)
      .then((result) => {
        if (bcrypt.compareSync(password, result.hashed_password)) {
          if (result.verified_at) {
            const payload = { email, userId: result.id }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
            res.status(200).json({ user: result, token })
          }
          else {
            next(constructFailure(NOT_VERIFIED, 'Your account has not been verified.', 401))
          }
        }
        else {
          next(constructFailure(BAD_EMAIL_OR_PASSWORD, 'Bad email or password.', 401))
        }
      }).catch((err) => {
          console.log("login error:", err)
          let status = 500
          let payload = constructFailure(DATABASE_ERROR, 'Error while looking up user in database', status)
          if (err.isBoom) {
            const data = err.data ? err.data : {}
            status = err.output.statusCode
            if (status === 404) {
              payload = constructFailure(BAD_EMAIL_OR_PASSWORD, 'Bad email or password.', 401)
            } else {
              payload = {...data, ...err.output.payload}
            }
          }
          next(payload)
        })
  }
  else {
    next(invalidInput('Username and/or password was not sent'))
  }
  console.log("End of POST /login")
})

router.get('/:token', (req, res, next) => {
  console.log('Params', req.params.token)
  const {token} = req.params

  if (!token) {
    next(invalidInput(res, "Invalid link with missing token"))
    return
  }

  const tokenService = new TokenService()
  const userService = new UserService()

  tokenService.get(token).then(resultTokenRecord => {
    const created_at = new Date(resultTokenRecord.created_at)
    const tokenAge = Date.now() - created_at
    //change later to 10 minutes
    if (tokenAge > ONE_DAY) {
      tokenService.delete(token).then(resultTokenDelete => {
        next(constructFailure(TOKEN_EXPIRED, 'The token has expired.', 401))
        return
      })
    }
    userService.getByEmail(resultTokenRecord.email).then(resultUserRecord => {
      if(!resultUserRecord.verified_at) {
        next(constructFailure(NOT_VERIFIED, 'Your account has not been verified.', 401))
        return
      }
      tokenService.delete(token).then(resultTokenDelete => {
        const payload = { email: resultUserRecord.email, userId: resultUserRecord.id }
        const sessionToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
        return res.status(200).send({user: resultUserRecord, token: sessionToken})
      })
    })
  }).catch((err) => {
    console.log("confirmation request error:", err)
    let status = 500
    let payload = constructFailure(DATABASE_ERROR, 'Error while confirming request.', status)
    if (err.isBoom) {
      const data = err.data ? err.data : {}
      status = err.output.statusCode
      payload =  {...data, ...err.output.payload}
    }
    next(payload)
  })
})

module.exports = router
