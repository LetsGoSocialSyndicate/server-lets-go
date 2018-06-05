/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const EventService = require('../database/services/eventService')
const eventService = new EventService()

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
    end_time,
    birthday
  } = req.body
})

router.patch('/:id', (req, res, next) => {
  res.send('respond with a resource')
})

router.delete('/:id', (req, res, next) => {
  res.send('respond with a resource')
})

module.exports = router
