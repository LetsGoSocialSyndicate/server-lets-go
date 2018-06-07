/* Copyright 2018, Socializing Syndicate Corp. */
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const UserService = require('../database/services/userService')
const TokenService = require('../database/services/tokenService')
const {constructFailure, constructSuccess, invalidInput} = require('../utilities/routeUtil')
const {TOKEN_EXPIRED, ALREADY_VERIFIED, DATABASE_ERROR} = require('../utilities/constants')

const ONE_DAY = 1000 * 3600 * 24

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
    if (tokenAge > ONE_DAY) {
      tokenService.delete(token).then(resultTokenDelete => {
        next(constructFailure(TOKEN_EXPIRED, 'The token has expired.', 401))
        return
      })
    }
    userService.getByEmail(resultTokenRecord.email).then(resultUserRecord => {
      if(resultUserRecord.verified_at) {
        tokenService.delete(token).then(resultTokenDelete => {
          next(constructFailure(ALREADY_VERIFIED, 'Account already verified.', 401))
          return
        })
      }
      resultUserRecord.verified_at = moment().format('YYYY-MM-DD')
      userService.update(resultUserRecord).then(resultUserUpdate => {
        tokenService.delete(token).then(resultTokenDelete => {
          const payload = { email: resultUserUpdate.email, userId: resultUserUpdate.id }
          const sessionToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
          return res.status(200).send({user: resultUserUpdate, token: sessionToken})
        })
      })
    })
  }).catch((err) => {
    console.log("confirmation error:", err)
    let status = 500
    let payload = constructFailure(DATABASE_ERROR, 'Error while confirming account.', status)
    if (err.isBoom) {
      const data = err.data ? err.data : {}
      status = err.output.statusCode
      payload =  {...data, ...err.output.payload}
    }
    next(payload)
  })
})

module.exports = router
// crontab OR https://www.npmjs.com/package/webworker-threads
// for deleting unused tokens after 24 hours
// https://corenominal.org/2016/05/12/howto-setup-a-crontab-file/
