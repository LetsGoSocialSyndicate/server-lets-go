/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const uuid = require('uuid/v4')
const { imageTable } = require('./constants')

class ImageService {
  insertUserProfileImage(user, imageUrl) {
    if (!user) {
      throw boom.badRequest('User is required')
    }
    if (!imageUrl) {
      throw boom.badRequest('Image URL is required')
    }

    return knex(imageTable)
      .returning('*')
      .insert({
        id: uuid(),
        user_id: user.id,
        image_url: imageUrl
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
        throw err.isBoom ? err : boom.badImplementation(`Error inserting user profile image`)
      })
  }

  insertMomentImage(event, imageUrl) {
    if (!event) {
      throw boom.badRequest('Event is required')
    }
    if (!imageUrl) {
      throw boom.badRequest('Image URL is required')
    }

    return knex(imageTable)
      .returning('*')
      .insert({
        id: uuid(),
        event_id: event.id,
        image_url: imageUrl
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
        throw err.isBoom ? err : boom.badImplementation(`Error inserting moment image`)
      })
  }

  delete(id) {
    if (!id) {
      throw boom.badRequest('Image id is required')
    }
    return knex(imageTable)
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

module.exports = ImageService
