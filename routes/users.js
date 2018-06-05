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

router.get('/:id', (req, res, next) => {
<<<<<<< HEAD
  const userService = new UserService()
  userService.get(req.params.id)
    .then((row) => res.json(row))
    .catch((err) => next(err))
=======
  console.log('In router GET uset bi ID:', req.params.id)
  const userService = new UserService()
  const { id } = req.params
  userService.getById(id)
    .then((row) => {
      res.json(row)
    })
    .catch((err) => next(err))
})

router.post('/', (req, res, next) => {
  res.send('respond with a resource')
>>>>>>> added stuff for userProfile by id
})

router.patch('/:id', (req, res, next) => {
  res.send('respond with a resource')
})

router.delete('/:id', (req, res, next) => {
  res.send('respond with a resource')
})

module.exports = router
