/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const EventService = require('../database/services/eventService')
const UserEventService = require('../database/services/userEventService')
const { SENDING_MAIL_ERROR } = require('../utilities/constants')
const { constructSuccess, constructFailure, invalidInput } = require('../utilities/routeUtil')
const { formatName } = require('../utilities/miscUtils')

/* GET event listing. */
router.get('/', (req, res, next) => {
  const eventService = new UserEventService()
  eventService.getAllEvents()
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
      return userEventService.insert(record)
    })
    .then((row) => {
      return userEventService.getEventById(row.id)
    })
    .then((row) => {
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

const sendNotification = (organizers, requestor) => {
  if (!organizers || organizers.length === 0) {
    next(constructFailure(SENDING_MAIL_ERROR, 'No event organizers are available', 500))
    return
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.LETS_GO_EMAIL,
      pass: process.env.LETS_GO_EMAIL_PASSWORD
    }
  })
  // console.log('organizers', organizers)
  // console.log('requestor', requestor)

  organizers.forEach((organizer) => {
    const mailOptions = {
      from: process.env.LETS_GO_EMAIL,
      to: organizer.email,
      subject: `Let's Go: Join Request`,
      text: `Hello ${organizer.first_name},\n
      ${formatName(requestor)} has requested to join your event.\n
      Please login to Let's Go app and accept or reject the request.`
    }
    if (organizer.email) {
      transporter.sendMail(mailOptions).then(result => {
        return res.status(200).send(constructSuccess(`A verification email has been sent to ${organizer.email}.`))
      }).catch(err => {
        console.log('email error:', err)
        next(constructFailure(SENDING_MAIL_ERROR, 'Error while sending verification email', 500))
      })
    }
  })
}

// user is requesting to participate in the event
// The event_id param is event id.
router.post('/request/:event_id', (req, res, next) => {
  const userEventService = new UserEventService()
  const eventService = new EventService()
  console.log('post', req.params, req.user)
  const record = {
    event_id: req.params.event_id,
    requested_by: req.user.id,
    requested_at: new Date()
  }
  userEventService.insert(record)
    .then((row) => {
      res.json(row)
      userEventService.getEventOrganizers(row.event_id)
        .then((organizers) => {
          // send email to the organizer that a person has requested to join the event.
          sendNotification(organizers, req.user)
        })
    })
    .catch((err) => next(err))
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
