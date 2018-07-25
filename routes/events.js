/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const UserService = require('../database/services/userService')
const TokenService = require('../database/services/tokenService')
const EventService = require('../database/services/eventService')
const UserEventService = require('../database/services/userEventService')
const MomentImageService = require('../database/services/momentImageService')
const multiparty = require('multiparty')

const { SENDING_MAIL_ERROR } = require('../utilities/constants')
const { sendEmail } = require('../utilities/mailUtils')
const {
  cloudinaryForceAddImage,
  cloudinaryRemoveImage
} = require('../utilities/cloudinary')
const {
  constructSuccess,
  constructFailure,
  invalidInput
} = require('../utilities/routeUtil')

// NOTE: These constants should match client side
const IMAGE_OP_UPDATE = 'IMAGE_OP_UPDATE'
const IMAGE_OP_ADD = 'IMAGE_OP_ADD'
const IMAGE_OP_DELETE = 'IMAGE_OP_DELETE'

const toImageProps = image => {
  return {
    id: image.id,
    image_url: image.image_url
  }
}
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

const sendNotification = (res, organizers, req) => {
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
        userService.delete(result.id)
        throw err
      })
      .then((result) => {
        const host = req.headers.origin
        if (organizer.email) {
          sendEmail(organizer.email, `Let's Go: Join Request`,
            `Hello ${organizer.first_name},\n
            ${requestor.first_name} ${requestor.last_name} has requested to join your event.\n`,
            'Your request has been sent.', 'Error while sending join request email')
        }
      })
      .catch((err) => {
        console.log('general purpose err', err)
        next(err)
        return
      })
  })
  Promise.all(emails)
    .then((results) => results.forEach((result) => res.json(result)))
    .catch((err) => next(err))
}

// user is requesting to participate in the event
// The event_id param is event id.
router.post('/request/:event_id', (req, res, next) => {
  const userEventService = new UserEventService()
  const eventService = new EventService()
  // console.log('post', req.params, req.user)
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
          // console.log('organizers', organizers)
          // send email to the organizer that a person has requested to join the event.
          sendNotification(res, organizers, req)
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

// router.post('/:id/images', (req, res, next) => {
router.post('/:user_id/:event_id/images', (req, res, next) => {
  console.log('EVENT ID: req.params.event_id:', req.params.event_id)
  console.log('USER ID: req.params.id:', req.params.user_id)

  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    const images = []
    Object.entries(fields).forEach(
      ([key, value]) => {
        if (!files[key]) {
          next(boom.badRequest(`Image file for entry ${key} not found`))
          return
        }
        const image = JSON.parse(value[0])
        image.image_url = files[key][0].path
        images.push(image)
      }
    )
    if (images.length === 0) {
      next(boom.badRequest('No valid images provided'))
      return
    }

    const userEventService = new UserEventService()
    const momentImageService = new MomentImageService()

    const results = images.map(
      image => processImageOpRequest(momentImageService, req.params.event_id, req.params.user_id, image)
    )

    Promise.all(results).then(() => {
      const imagesPromise = momentImageService.getAllUserImages(req.params.user_id)
      const eventsPromise = userEventService.getAllUserEvents(req.params.user_id)
      Promise.all([imagesPromise, eventsPromise]).then(values => {
        const [outImages, outEvents] = values
        outImages.forEach(image => {
          for (let event of outEvents) {
            //console.log('PROCESSING EVENT:', event.event_title, event.first_name, event.user_id, image)
            if (event.user_id === image.user_id) {
              if (event.images) {
                console.log('ADDING IMAGE:', event.event_title, event.first_name, image)
                event.images.push(toImageProps(image))
              } else {
                console.log('ADDING FIRST IMAGE:', event.event_title, event.first_name, image)
                event.images = [toImageProps(image)]
              }
            }
          }
        })
        console.log('event images POST returning:', outEvents)
        res.json(outEvents)
      }).catch((localErr) => next(localErr))
    })
  })
})

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
