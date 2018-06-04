/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserService = require('../database/services/userServices')
const { NOT_VERIFIED, BAD_PASSWORD, INVALID_INPUT } = require('./routesConstants')

require('dotenv').config()

router.post('/', (req, res, next) => {
  const { username, password } = req.body

  if (username && password) {
    const userService = new UserService()
    userService.getByUsername(username)
      .then((result) => {
        if (bcrypt.compareSync(password, result.hashed_password)) {
          if (result.is_verified) {
            const payload = { username, userId: result.id }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
            res.status(200).json({ token })
          } else {
            res.status(401).send({ errorType: NOT_VERIFIED, msg: 'Your account has not been verified.' })
          }
        }
        else {
          res.status(401).send({ errorType: BAD_PASSWORD, msg: 'Bad password' })
        }
      })
  }
  else {
    res.status(400).send({ errorType: INVALID_INPUT, msg: 'username and/or password was not sent' })
  }
})

module.exports = router
