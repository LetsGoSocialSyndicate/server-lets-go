/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const uuid = require('uuid/v4')
const { momentImageTable } = require('./constants')

class MomentImageService {
  // Returned list contains all stored image properties.
  getMomentImageDetails(id) {
    if (!id) {
      throw boom.badRequest('Image id is required')
    }
    return knex(momentImageTable)
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
        console.log('MomentImageService.getMomentImageDetails: err', err)
        throw boom.badImplementation(`Error retrieving image details`)
      })
  }

  getAllUserImages(userId) {
    if (!userId) {
      throw boom.badRequest('User id is required')
    }
    return knex(momentImageTable)
      .select('*')
      .where('user_id', userId)
      .catch((err) => {
        console.log('momentImageService.getAllUserImages: err', err)
        throw boom.badImplementation(`Error retrieving images`)
      })
  }

  insert(eventId, userId, imageUrl, publicId = '') {
    if (!eventId) {
      throw boom.badRequest('Event ID is required')
    }
    if (!userId) {
      throw boom.badRequest('User ID is required')
    }
    if (!imageUrl) {
      throw boom.badRequest('Image URL is required')
    }

    return knex(momentImageTable)
      .returning('*')
      .insert({
        id: uuid(),
        event_id: eventId,
        user_id: userId,
        image_url: imageUrl,
        public_id: publicId
      })
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many moment images for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to insert moment image`)
      })
      .catch((err) => {
        console.log('ERROR in momentImageService.insert:', err)
        throw err.isBoom ? err : boom.badImplementation(`Error inserting moment image`)
      })
  }

  update(momentImage) {
    if (!momentImage.id) {
      throw boom.badRequest('Id is required')
    }
    if (!momentImage.image_url) {
      throw boom.badRequest('Image URL is required')
    }

    return knex(momentImageTable)
      .returning('*')
      .update({
        image_url: momentImage.image_url,
        public_id: momentImage.public_id
      })
      .where('id', momentImage.id)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many moment images for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to update moment image`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error updating moment image`)
      })
  }

  delete(id) {
    if (!id) {
      throw boom.badRequest('Image id is required')
    }
    return knex(momentImageTable)
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
        console.log('delete image: err', err)
        throw boom.badImplementation(`Error deleting image with the id, ${id}`)
      })
  }
}

module.exports = MomentImageService
