/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const UserService = require('../database/services/userService')

/* GET users listing. */
router.get('/', (req, res, next) => {
  const userService = new UserService()
  userService.getList()
    .then((rows) => res.json(rows))
    .catch((err) => next(err))
})

router.get('/:email', (req, res, next) => {
  console.log('In router GET:', req.params.email)
  const userService = new UserService()
  const { email } = req.params
  userService.getByEmail(email)
    .then((row) => {
      res.json(row)
    })
    .catch((err) => next(err))
})

router.post('/', (req, res, next) => {
  res.send('respond with a resource')
})

router.patch('/:email', (req, res, next) => {
  res.send('respond with a resource')
})

router.delete('/:email', (req, res, next) => {
  res.send('respond with a resource')
})

module.exports = router
