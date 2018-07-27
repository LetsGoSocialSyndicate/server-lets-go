/* Copyright 2018, Socializing Syndicate Corp. */
const UserEventService = require('../database/services/userEventService')
const {
  cloudinaryForceAddImage,
  cloudinaryRemoveImage
} = require('../utilities/cloudinary')

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

const getImagesFromFormData = (fields, files, next) => {
  const images = []
  Object.entries(fields).forEach(
    ([key, value]) => {
      if (!files[key]) {
        next(boom.badRequest(`Image file for entry ${key} not found`))
        return null
      }
      const image = JSON.parse(value[0])

      image.image_url = files[key][0].path
      images.push(image)
    }
  )

  if (images.length === 0) {
    next(boom.badRequest('No valid images provided'))
    return null
  }
  return images
}
const getAllUserEventsWithImages = (momentImageService, userId) => {
  const userEventService = new UserEventService()
  const imagesPromise = momentImageService.getAllUserImages(userId)
  const eventsPromise = userEventService.getAllUserEvents(userId)
  return Promise.all([imagesPromise, eventsPromise]).then(values => {
    const [outImages, outEvents] = values
    outImages.forEach(image => {
      for (let event of outEvents) {
        if (event.event_id === image.event_id) {
          if (event.images) {
            event.images.push(toImageProps(image))
          } else {
            event.images = [toImageProps(image)]
          }
        }
      }
    })
    console.log('getAllUserEventsWithImages:', outEvents)
    return outEvents
  })
}

module.exports = {
  IMAGE_OP_UPDATE,
  IMAGE_OP_ADD,
  IMAGE_OP_DELETE,
  getImagesFromFormData,
  getAllUserEventsWithImages
}
