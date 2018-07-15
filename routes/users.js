/* Copyright 2018, Socializing Syndicate Corp. */
const boom = require('boom')
const cloudinary = require('cloudinary')
const express = require('express')
const ProfileImageService = require('../database/services/profileImageService')
const UserService = require('../database/services/userService')
const UserEventService = require('../database/services/userEventService')

const router = express.Router()
const DATA_URI_PREFIX = 'data:'
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_LOGIN,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// NOTE: These constants should match client side
const IMAGE_OP_UPDATE = 'IMAGE_OP_UPDATE'
const IMAGE_OP_ADD = 'IMAGE_OP_ADD'
const IMAGE_OP_DELETE = 'IMAGE_OP_DELETE'

const getImageDescription = image => {
  if (image.image_url.startsWith(DATA_URI_PREFIX)) {
    const image_url = `${image.image_url.split(',')[0]},...`
    return { ...image, image_url }
  }
  return image
}

const updateImage = image => {
  if (!image.image_url.startsWith(DATA_URI_PREFIX)) {
    return Promise.resolve({
      id: image.id,
      image_url: image.image_url,
      public_id: ''
    })
  }
  return cloudinary.v2.uploader.upload(
    image.image_url, { type: 'private' }
  ).then(response => {
    console.log('users PATCH updateImage:', response)
    return {
      id: image.id,
      image_url: response.secure_url,
      public_id: response.public_id
    }
  })
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  const userService = new UserService()
  userService.getList()
    .then((rows) => res.json(rows))
    .catch((err) => next(err))
})

router.get('/:id', (req, res, next) => {
  console.log('In router GET /users/:id:', req.params.id)
  const userService = new UserService()
  userService.getById(req.params.id).then((row) => {
    res.json(row)
  }).catch((err) => next(err))
})

router.get('/:email/requested', (req, res, next) => {
  console.log('In router GET: /users/requested', req.user)
  const userEventService = new UserEventService()
  userEventService.getAllEventsByParticipant(req.user.id).then((rows) => {
    res.json(rows)
  }).catch((err) => next(err))
})

router.get('/:email/hosted', (req, res, next) => {
  console.log('In router GET: /users/hosted', req.user)
  const userEventService = new UserEventService()
  userEventService.getAllEventsByOrganizer(req.user.id).then((rows) => {
    res.json(rows)
  }).catch((err) => next(err))
})

router.post('/', (req, res) => {
  res.send('respond with a resource')
})

router.patch('/:id', (req, res, next) => {
  // verifyToken middleware puts userId and email to request
  console.log('users PATCH:', req.params, req.userId, req.email, req.body)
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

router.patch('/:id/images', (req, res, next) => {
  // verifyToken middleware puts userId and email to request
  console.log('users images PATCH start:', req.params, req.userId, req.email)
  if (req.userId !== req.params.id) {
    next(boom.unauthorized('User ID does not match'))
    return
  }
  if (!('images' in req.body) || req.body.images.length <= 0) {
    next(boom.unauthorized('No valid images provided'))
    return
  }

  const userService = new UserService()
  const profileImageService = new ProfileImageService()

  const results = req.body.images.map(image => {
    console.log('users images PATCH image:', getImageDescription(image))
    switch (image.op) {
    case IMAGE_OP_UPDATE:
      return updateImage(image).then(
        cloudinaryImage => profileImageService.update(cloudinaryImage)
      )
    case IMAGE_OP_ADD:
      return profileImageService.insert(req.user, image.image_url)
    case IMAGE_OP_DELETE:
      return profileImageService.delete(image.id)
    default:
      return Promise.resolve()
    }
  })

  Promise.all(results).then(() => {
    userService.getById(req.params.id).then((row) => {
      console.log('users images PATCH returning:', row)
      res.json(row)
    }).catch((err) => next(err))
  })
})

router.delete('/:email', (req, res) => {
  res.send('respond with a resource')
})

module.exports = router
