/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserService = require('../database/services/userService')
const { NOT_VERIFIED, BAD_PASSWORD, INVALID_INPUT } = require('../utilities/routesConstants')
const { constructFailure, invalidInput } = require('../utilities/routeUtil')

require('dotenv').config()

router.post('/', (req, res, next) => {
  const { username, password } = req.body

  if (username && password) {
    const userService = new UserService()
    userService.getByUsername(username)
      .then((result) => {
        if (bcrypt.compareSync(password, result.hashed_password)) {
          if (result.verified_at) {
            const payload = { username, userId: result.id }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
            res.status(200).json({ token })
          }
          else {
            next(constructFailure(NOT_VERIFIED, 'Your account has not been verified.', 401))
          }
        }
        else {
          next(constructFailure(BAD_PASSWORD, 'Bad password.', 401))
        }
      })
  }
  else {
    next(invalidInput('Username and/or password was not sent'))
  }
})

module.exports = router
