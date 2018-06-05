/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const { constructFailure, invalidInput } = require('../utilities/routeUtil')
const EventService = require('../database/services/eventService')
const UserEventService = require('../database/services/userEventService')
const eventService = new EventService()
const userEventService = new UserEventService()

/* GET event listing. */
router.get('/', (req, res, next) => {
  eventService.getList()
    .then((rows) => {
      res.json(rows)
    })
    .catch((err) => next(err))
})

router.get('/:id', (req, res, next) => {
  const { id } = req.params
  eventService.get(id)
    .then((row) => {
      res.json(row)
    })
    .catch((err) => next(err))
})

router.post('/', (req, res, next) => {
  const {
    title,
    location,
    icon_url,
    category,
    description,
    start_time,
    end_time
  } = req.body
  if (!title) {
    next(invalidInput('The event title may not be blank'))
  }
})

router.patch('/:id', (req, res, next) => {
  const { id } = req.params
  const {
    title,
    location,
    icon_url,
    category,
    description,
    start_time,
    end_time
  } = req.body
  if (!title) {
    next(invalidInput('The event title may not be blank'))
  }
})

router.delete('/:id', (req, res, next) => {
  const { id } = req.params
  eventService.delete(id)
    .then((row) => res.json(row))
    .catch((err) => next(err))
})

module.exports = router
