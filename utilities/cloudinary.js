/* Copyright 2018, Socializing Syndicate Corp. */
const cloudinary = require('cloudinary')

const DATA_URI_PREFIX = 'data:'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_LOGIN,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudinaryAddImage = image => {
  if (!image.image_url.startsWith(DATA_URI_PREFIX)) {
    return Promise.resolve({
      id: image.id,
      image_url: image.image_url,
      public_id: ''
    })
  }
  return cloudinaryForceAddImage(image)
}

const cloudinaryForceAddImage = image => {
  return cloudinary.v2.uploader.upload(
    image.image_url, { type: 'private' }
  ).then(response => {
    // console.log('cloudinaryAddImage:', response)
    return {
      id: image.id,
      image_url: response.secure_url,
      public_id: response.public_id
    }
  })
}

const cloudinaryRemoveImage = image => {
  if (!image.public_id) {
    return Promise.resolve({})
  }
  return cloudinary.v2.uploader.destroy(
    image.public_id, { type: 'private' }
  ).then(response => { // eslint-disable-line no-unused-vars
    // console.log('cloudinaryRemoveImage:', response)
    return {}
  })
}

const getImageDescription = image => {
  if (image.image_url.startsWith(DATA_URI_PREFIX)) {
    const image_url = `${image.image_url.split(',')[0]},...`
    return { ...image, image_url }
  }
  return image
}


module.exports = {
  cloudinaryAddImage, cloudinaryForceAddImage, cloudinaryRemoveImage, getImageDescription
}
