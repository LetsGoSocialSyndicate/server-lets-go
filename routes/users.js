/* Copyright 2018, Socializing Syndicate Corp. */
const boom = require('boom')
const express = require('express')
const ProfileImageService = require('../database/services/profileImageService')
const UserService = require('../database/services/userService')
const UserEventService = require('../database/services/userEventService')
const {
  cloudinaryForceAddImage,
  cloudinaryRemoveImage
} = require('../utilities/cloudinary')
const multiparty = require('multiparty')

const router = express.Router()

// NOTE: These constants should match client side
const IMAGE_OP_UPDATE = 'IMAGE_OP_UPDATE'
const IMAGE_OP_ADD = 'IMAGE_OP_ADD'
const IMAGE_OP_DELETE = 'IMAGE_OP_DELETE'

/* GET users listing. */
router.get('/', (req, res, next) => {
  const userService = new UserService()
  userService.getList()
    .then((rows) => res.json(rows))
    .catch((err) => next(err))
})

router.get('/:id', (req, res, next) => {
  // console.log('In router GET /users/:id:', req.params.id)
  const userService = new UserService()
  userService.getById(req.params.id).then((row) => {
    res.json(row)
  }).catch((err) => next(err))
})

router.get('/:email/requested', (req, res, next) => {
  // console.log('In router GET: /users/requested', req.user)
  const userEventService = new UserEventService()
  userEventService.getAllEventsByParticipant(req.user.id).then((rows) => {
    res.json(rows)
  }).catch((err) => next(err))
})

router.get('/:email/hosted', (req, res, next) => {
  // console.log('In router GET: /users/hosted', req.user)
  const userEventService = new UserEventService()
  userEventService.getAllEventsByOrganizer(req.user.id).then((rows) => {
    res.json(rows)
  }).catch((err) => next(err))
})

router.get('/:email/all', (req, res, next) => {
  // console.log('In router GET: /users/all', req.user)
  const userEventService = new UserEventService()
  Promise.all([
    userEventService.getAllEventsByParticipant(req.user.id),
    userEventService.getAllEventsByOrganizer(req.user.id)
  ]).then((rows) => {
    // console.log('All events', [...rows[0], ...rows[1]])
    res.json([...rows[0], ...rows[1]])
  }).catch((err) => {
    //console.log('ERR:', err)
    next(err)
  })
})

router.get('/:email/others', (req, res, next) => {
  // console.log('In router GET: /users/others', req.user)
  const userEventService = new UserEventService()
  userEventService.getAllEventsByOtherOrganizer(req.user.id)
    .then((rows) => {
      // console.log('All other events', rows)
      res.json(rows)
    }).catch((err) => next(err))
})

router.get('/:email/statistics', (req, res, next) => {
  // console.log('In router GET: /users/statistics', req.user)
  const userEventService = new UserEventService()
  Promise.all([
    userEventService.countEventsByParticipant(req.user.id),
    userEventService.countEventsByOrganizer(req.user.id)
  ]).then((rows) => {
    const statistics = {
      countJoined: rows[0].count,
      countHosted: rows[1].count
    }
    // console.log('All events statistics', statistics)
    res.json({ statistics })
  }).catch((err) => next(err))
})

router.post('/', (req, res) => {
  res.send('respond with a resource')
})

router.patch('/:id', (req, res, next) => {
  // verifyToken middleware puts userId and email to request
  // console.log('users PATCH:', req.params, req.userId, req.email, req.body)
  const userService = new UserService()
  if (req.userId !== req.params.id) {
    next(boom.unauthorized('User ID does not match'))
    return
  }
  const user = { id: req.userId, ...req.body }
  userService.update(user).then(result => {
    res.json(result)
  }).catch((err) => next(err))
})

router.post('/:id/images', (req, res, next) => {
  // verifyToken middleware puts userId and email to request
  // console.log('users images POST start:', req.params, req.userId, req.email)
  if (req.userId !== req.params.id) {
    next(boom.unauthorized('User ID does not match'))
    return
  }

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

    const userService = new UserService()
    const profileImageService = new ProfileImageService()

    const results = images.map(
      image => processImageOpRequest(profileImageService, req.user, image)
    )

    Promise.all(results).then(() => {
      userService.getById(req.params.id).then((row) => {
        // console.log('users images POST returning:', row)
        res.json(row)
      }).catch((localErr) => next(localErr))
    })
  })
})

router.delete('/:email', (req, res) => {
  res.send('respond with a resource')
})

const processImageOpRequest = (profileImageService, user, image) => {
  // console.log('users processImageOpRequest:', getImageDescription(image))
  switch (image.op) {
  case IMAGE_OP_UPDATE: {
    const oldImagePromise =
      profileImageService.getProfileImageDetails(image.id)
    // NOTE: Maybe it is possible here to do "Add with overwrite",
    // instead "Add and delete".
    return cloudinaryForceAddImage(image).then(cloudinaryImage => {
      return oldImagePromise.then(oldImage => {
        return profileImageService.update(cloudinaryImage).then(
          () => cloudinaryRemoveImage(oldImage)
        )
      })
    })
  }
  case IMAGE_OP_ADD:
    return cloudinaryForceAddImage(image).then(cloudinaryImage => {
      return profileImageService.insert(
        user, cloudinaryImage.image_url, cloudinaryImage.public_id
      )
    })
  case IMAGE_OP_DELETE:
    return profileImageService.getProfileImageDetails(
      image.id
    ).then(oldImage => {
      return profileImageService.delete(oldImage.id).then(
        () => cloudinaryRemoveImage(oldImage)
      )
    })
  default:
    return Promise.resolve()
  }
}

module.exports = router
