/* Copyright 2018, Socializing Syndicate Corp. */
const UserEventService = require('../database/services/userEventService')

// NOTE: These constants should match client side
const IMAGE_OP_UPDATE = 'IMAGE_OP_UPDATE'
const IMAGE_OP_ADD = 'IMAGE_OP_ADD'
const IMAGE_OP_DELETE = 'IMAGE_OP_DELETE'

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

module.exports = {
  IMAGE_OP_UPDATE,
  IMAGE_OP_ADD,
  IMAGE_OP_DELETE,
  getImagesFromFormData
}
