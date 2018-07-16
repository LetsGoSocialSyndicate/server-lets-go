/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const uuid = require('uuid/v4')
const { profileImageTable } = require('./constants')


class ProfileImageService {
  // Returned list contains all stored image properties.
  getProfileImageDetails(id) {
    if (!id) {
      throw boom.badRequest('Image id is required')
    }
    return knex(profileImageTable)
      .select('*')
      .where('id', id)
      .then(rows => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many images for the id, ${id}`)
        }
        throw boom.notFound(`No image found for the id, ${id}`)
      })
      .catch((err) => {
        console.log('ProfileImageService.getProfileImageDetails: err', err)
        throw boom.badImplementation(`Error retrieving image details`)
      })
  }

  // Returned list contains only image id and url,
  // intentionally no other details included.
  getProfileImages(user_id) {
    if (!user_id) {
      throw boom.badRequest('User id is required')
    }
    return knex(profileImageTable)
      .select(['id', 'image_url'])
      .where('user_id', user_id)
      .catch((err) => {
        console.log('ProfileImageService.getProfileImages: err', err)
        throw boom.badImplementation(`Error retrieving images`)
      })
  }

  insert(user, imageUrl, publicId = '') {
    if (!user) {
      throw boom.badRequest('User is required')
    }
    if (!imageUrl) {
      throw boom.badRequest('Image URL is required')
    }

    return knex(profileImageTable)
      .returning('*')
      .insert({
        id: uuid(),
        user_id: user.id,
        image_url: imageUrl,
        public_id: publicId
      })
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many user profile images for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to insert user profile image`)
      })
      .catch((err) => {
        console.log('ERROR in ProfileImageService.insert:', err)
        throw err.isBoom ? err : boom.badImplementation(`Error inserting user profile image`)
      })
  }

  update(profileImage) {
    if (!profileImage.id) {
      throw boom.badRequest('Id is required')
    }
    if (!profileImage.image_url) {
      throw boom.badRequest('Image URL is required')
    }

    return knex(profileImageTable)
      .returning('*')
      .update({
        image_url: profileImage.image_url,
        public_id: profileImage.public_id
      })
      .where('id', profileImage.id)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many user profile images for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to update user profile image`)
      })
      .catch((err) => {
        console.log('ERROR in ProfileImageService.update:', err)
        throw err.isBoom ? err : boom.badImplementation(`Error updating user profile image`)
      })
  }

  delete(id) {
    if (!id) {
      throw boom.badRequest('Image id is required')
    }
    return knex(profileImageTable)
      .where('id', id)
      .del()
      .returning('*')
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many images for the id, ${id}`)
        }
        throw boom.notFound(`No image found for the id, ${id}`)
      })
      .catch((err) => {
        console.log('ERROR in ProfileImageService.delete:', err)
        throw boom.badImplementation(`Error deleting image with the id, ${id}`)
      })
  }
}

module.exports = ProfileImageService
