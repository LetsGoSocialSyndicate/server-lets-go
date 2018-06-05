/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserService = require('../database/services/userService')
const { invalidInput, constructFailure } = require('../utilities/routeUtil')
const { NOT_VERIFIED, BAD_PASSWORD } = require('../utilities/constants')

require('dotenv').config()

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
  console.log("End of POST /login")
})

module.exports = router
