/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const UserService = require('../database/services/userService')
const UserEventService = require('../database/services/userEventService')
const { verifyToken } = require('../utilities/jwtUtil')
const { retrieveUser } = require('../utilities/dbUtils')

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

router.get('/:email/requested', verifyToken, retrieveUser, (req, res, next) => {
  console.log('In router GET: /users/requested', req.user)
  const userEventService = new UserEventService()
  userEventService.getAllEventsByParticipant(req.user.id)
    .then((rows) => {
      res.json(rows)
    })
    .catch((err) => next(err))
})

router.get('/:email/hosted', verifyToken, retrieveUser, (req, res, next) => {
  console.log('In router GET: /users/hosted', req.user)
  const userEventService = new UserEventService()
  userEventService.getAllEventsByOrganizer(req.user.id)
    .then((rows) => {
      res.json(rows)
    })
    .catch((err) => next(err))
})

router.post('/', verifyToken, retrieveUser, (req, res, next) => {
  res.send('respond with a resource')
})

router.patch('/:email', verifyToken, retrieveUser, (req, res, next) => {
  res.send('respond with a resource')
})

router.delete('/:email', (req, res, next) => {
  res.send('respond with a resource')
})

module.exports = router
