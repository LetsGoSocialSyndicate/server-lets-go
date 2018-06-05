/* Copyright 2018, Socializing Syndicate Corp. */
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserService = require('../database/services/userServices')
const TokenService = require('../database/services/tokenService')
const {constructFailure, invalidInput} = require('../utilities/routeUtil')
const {TOKEN_EXPIRED, ALREADY_VERIFIED, DATABASE_ERROR} = require('../utilities/constants')

const ONE_DAY = 1000 * 3600 * 24

router.get('/:token', (req, res, next) => {
  console.log('Params', req.params.token)
  const {token} = req.params

  if (!token) {
    return invalidInput(res, "Invalid link with missing token")
  }

  const tokenService = new TokenService()
  const userService = new UserService()

  tokenService.get(token).then(result => {
    const created_at = new Date(result.created_at)
    const tokenAge = Date.now() - created_at
    if (tokenAge > ONE_DAY) {
      tokenService.delete(token).then(result => {
        return res.status(401).send(constructFailure(TOKEN_EXPIRED, 'The token has expired.'))
      })
    }
    userService.getByUsername(result.username).then(result => {
      if(result.is_verified) {
        tokenService.delete(token).then(result => {
          return res.status(401).send(constructFailure(ALREADY_VERIFIED, 'Account already verified.'))
        })
      }
      result.is_verified = true
      userService.update(result).then(result => {
        tokenService.delete(token).then(result => {
          return res.status(200).send('Account successfully verified.')
        })
      })
    })
  }).catch((err) => {
    console.log("confirmation error:", err)
    let status = 500
    let payload = constructFailure(DATABASE_ERROR, 'Error while confirming account.')
    if (err.isBoom) {
      const data = err.data ? err.data : {}
      status = err.output.statusCode
      payload =  {...data, ...err.output.payload}
    }
    return res.status(status).send(payload)
  })
})

module.exports = router
// crontab OR https://www.npmjs.com/package/webworker-threads
// for deleting unused tokens after 24 hours
// https://corenominal.org/2016/05/12/howto-setup-a-crontab-file/
