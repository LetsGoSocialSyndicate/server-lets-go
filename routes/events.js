/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
/* eslint-disable no-else-return */
/* eslint-disable arrow-body-style */
const express = require('express')
const crypto = require('crypto')
const UserService = require('../database/services/userService')
const TokenService = require('../database/services/tokenService')
const EventService = require('../database/services/eventService')
const UserEventService = require('../database/services/userEventService')
const MomentImageService = require('../database/services/momentImageService')
const multiparty = require('multiparty')
const boom = require('boom')

const { SENDING_MAIL_ERROR } = require('../utilities/constants')
const { sendEmail } = require('../utilities/mailUtils')
const {
  IMAGE_OP_UPDATE,
  IMAGE_OP_ADD,
  IMAGE_OP_DELETE,
  getImagesFromFormData
} = require('../utilities/imageUtils')
const { getUserEventsWithImages } = require('../utilities/eventUtils')
const {
  cloudinaryForceAddImage,
  cloudinaryRemoveImage
} = require('../utilities/cloudinary')
const {
  constructFailure,
  invalidInput
} = require('../utilities/routeUtil')

const router = express.Router()

/* GET event listing. */
router.get('/', (req, res, next) => {
  // console.log('GET Event Feeds')
  const eventService = new UserEventService()
  eventService.getAllEvents()
    .then((rows) => {
      // console.log('events', rows)
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
    .then((row) => userEventService.getEventById(row.id))
    .then((row) => {
      res.json(row)
    })
    .catch((err) => next(err))
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
  console.log('/events/request/', req.params, req.user)
  userEventService.getEventByRequestor(req.params.event_id, req.user.id)
    .then(rowOrNull => {
      const requestedAt = new Date()
      if (rowOrNull) {
        console.log('Already requested to join:', rowOrNull)
        return Promise.resolve({ notify: false, row: rowOrNull })
        // return userEventService.update({
        //   id: rowOrNull.id,
        //   requested_at: requestedAt
        // })
      } else {
        return userEventService.insert({
          event_id: req.params.event_id,
          requested_by: req.user.id,
          requested_at: requestedAt
        }).then(row => {
          return { notify: true, row }
        })
      }
    })
    .then(result => {
      if (result.notify) {
        userEventService.getEventOrganizers(req.params.event_id)
          .then((organizers) => {
            // console.log('organizers', organizers)
            // send email to the organizer that a person has requested to join the event.
            sendNotification(res, organizers, req, next)
          })
      }
      res.json(result.row)
    })
    .catch((err) => next(err))
})

// user is accepting the request to participate
router.patch('/accept/:event_id/:user_id', (req, res, next) => {
  console.log('/events/accept/', req.params, req.user)
  const userEventService = new UserEventService()
  userEventService.getEventByRequestor(req.params.event_id, req.params.user_id)
    .then((row) => {
      if (!row) {
        throw boom.notFound(`Requested user event not found for, ${req.params.user_id}`)
      }
      if (row.requested_by && row.requested_at &&
          !row.rejected_by && !row.rejected_at) {
        const record = {
          id: row.id,
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
router.patch('/reject/:event_id/:user_id', (req, res, next) => {
  console.log('/events/reject/', req.params, req.user)
  const userEventService = new UserEventService()
  userEventService.getEventByRequestor(req.params.event_id, req.params.user_id)
    .then((row) => {
      if (!row) {
        throw boom.notFound(`Requested user event not found for, ${req.params.user_id}`)
      }
      if (row.requested_by && row.requested_at &&
          !row.accepted_by && !row.accepted_at) {
        const record = {
          id: row.id,
          rejected_by: req.user.id,
          rejected_at: new Date()
        }
        userEventService.update(record)
          .then((updated) => res.json(updated))
      }
    })
    .catch((err) => next(err))
})

router.post('/:user_id/:event_id/images', (req, res, next) => {
  console.log('/events/.../images/', req.params, req.user)
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    const images = getImagesFromFormData(fields, files, next)
    if (!images) {
      return
    }

    const momentImageService = new MomentImageService()
    const results = images.map(
      image => processImageOpRequest(
        momentImageService,
        req.params.event_id,
        req.params.user_id,
        image
      )
    )

    Promise.all(results)
      .then(() => getUserEventsWithImages(req.params.user_id, true))
      .then(events => res.json(events))
      .catch((error) => next(error))
  })
})

const sendNotification = (res, organizers, req, next) => {
  const requestor = req.user
  if (!organizers || organizers.length === 0) {
    next(constructFailure(SENDING_MAIL_ERROR, 'No event organizers are available', 500))
    return
  }
  // console.log('organizers', organizers)
  // console.log('requestor', requestor)
  // console.log('sender', process.env.LETS_GO_EMAIL)
  // console.log('origin', req.headers.origin)

  const userService = new UserService()
  const tokenService = new TokenService()

  const emails = organizers.map((organizer) => {
    const tokenEntry = {
      email: organizer.email,
      token: crypto.randomBytes(128).toString('hex')
    }
    return tokenService.insert(tokenEntry)
      .catch(err => {
        userService.deleteByEmail(organizer.email)
        throw err
      })
      .then(() => {
        if (organizer.email) {
          sendEmail(organizer.email, `Let's Go: Join Request`,
            `Hello ${organizer.first_name},\n
            ${requestor.first_name} ${requestor.last_name} has requested to join your event.\n`,
            'Your request has been sent.', 'Error while sending join request email')
        }
      })
      .catch((err) => {
        next(err)
        return
      })
  })
  Promise.all(emails)
    .then((results) => results.forEach((result) => res.json(result)))
    .catch((err) => next(err))
}

const processImageOpRequest = (momentImageService, eventId, userId, image) => {
  console.log('event processImageOpRequest:', eventId, userId, image)
  switch (image.op) {
  case IMAGE_OP_UPDATE: {
    const oldImagePromise =
      momentImageService.getMomentImageDetails(image.id)
    // NOTE: Maybe it is possible here to do "Add with overwrite",
    // instead "Add and delete".
    return cloudinaryForceAddImage(image).then(cloudinaryImage => {
      return oldImagePromise.then(oldImage => {
        return momentImageService.update(cloudinaryImage).then(
          () => cloudinaryRemoveImage(oldImage)
        )
      })
    })
  }
  case IMAGE_OP_ADD:
    return cloudinaryForceAddImage(image).then(cloudinaryImage => {
      return momentImageService.insert(
        eventId, userId, cloudinaryImage.image_url, cloudinaryImage.public_id
      )
    })
  case IMAGE_OP_DELETE:
    return momentImageService.getMomentImageDetails(
      image.id
    ).then(oldImage => {
      return momentImageService.delete(oldImage.id).then(
        () => cloudinaryRemoveImage(oldImage)
      )
    })
  default:
    return Promise.resolve()
  }
}

module.exports = router
