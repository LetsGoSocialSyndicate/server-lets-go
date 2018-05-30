/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserService = require('../database/services/userServices')

require('dotenv').config()

router.post('/', (req, res, next) => {
  const { username, password } = req.body

  if (username && password) {
    const userService = new UserService()
    userService.getByUsername(username)
      .then((result) => {
        if (bcrypt.compareSync(password, result.hashed_password)) {
          const payload = { username, userId: result.id }
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
          res.status(200).json({ token })
        }
        else {
          res.status(400).send({ error: 'Bad password' })
        }
      })
  }
  else {
    res.status(400).send({ error: 'username and/or password was not sent' })
  }
})

module.exports = router
