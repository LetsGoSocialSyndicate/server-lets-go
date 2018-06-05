/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const { constructFailure, invalidInput } = require('../utilities/routeUtil')
const EventService = require('../database/services/eventService')
const UserEventService = require('../database/services/userEventService')

/* GET event listing. */
router.get('/', (req, res, next) => {
  const eventService = new EventService()
  eventService.getList()
    .then((rows) => {
      res.json(rows)
    })
    .catch((err) => next(err))
})

router.get('/:id', (req, res, next) => {
  const eventService = new EventService()
  const { id } = req.params
  eventService.get(id)
    .then((row) => {
      res.json(row)
    })
    .catch((err) => next(err))
})

router.post('/', (req, res, next) => {
  const eventService = new EventService()
  const userEventService = new UserEventService()
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
    return
  }
  eventService.insert({
    title,
    location,
    icon_url,
    category,
    description,
    start_time,
    end_time
  })
    .then((row) => {
      const record = {
        event_id: row.id,
        posted_by: req.user.id,
        posted_at: new Date()
      }
      userEventService.insert(record)
      res.json(row)
    })
    .catch((err) => next(err))
})

router.patch('/:id', (req, res, next) => {
  const eventService = new EventService()
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
    return
  }
})

router.delete('/:id', (req, res, next) => {
  const eventService = new EventService()
  const { id } = req.params
  eventService.delete(id)
    .then((row) => res.json(row))
    .catch((err) => next(err))
})

// user is requesting to participate in the event
// The event_id param is event id.
router.post('/request/:event_id', (req, res, next) => {
  const userEventService = new UserEventService()
  const record = {
    event_id: req.params.event_id,
    requested_by: req.user.id,
    requested_at: new Date()
  }
  userEventService.insert(record)
    .then((row) => res.json(row))
    .catch((err) => next(err))

  // send email to the organizer that a person has requested to join the event.
})

// user is accepting the request to participate
// The request_id param is user-event id.
router.patch('/accept/:request_id', (req, res, next) => {
  const userEventService = new UserEventService()
  userEventService.get(req.params.request_id)
    .then((row) => {
      if (row.requested_by && row.requested_at &&
          !row.rejected_by && !row.rejected_at) {
        const record = {
          id: req.params.request_id,
          accepted_by: req.user.id,
          accepted_at: new Date()
        }
        userEventService.update(record)
          .then((updated) => res.json(updated))
      }
    })
    .catch((err) => next(err))
})

// user is rejecting the request to participate
// The request_id param is user-event id.
router.patch('/reject/:request_id', (req, res, next) => {
  const userEventService = new UserEventService()
  userEventService.get(req.params.request_id)
    .then((row) => {
      if (row.requested_by && row.requested_at &&
          !row.accepted_by && !row.accepted_at) {
        const record = {
          id: req.params.request_id,
          rejected_by: req.user.id,
          rejected_at: new Date()
        }
        userEventService.update(record)
          .then((updated) => res.json(updated))
      }
    })
    .catch((err) => next(err))
})

module.exports = router
