/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const uuid = require('uuid/v4')
const { momentImageTable } = require('./constants')

class MomentImageService {
  insert(event, imageUrl) {
    if (!event) {
      throw boom.badRequest('Event is required')
    }
    if (!imageUrl) {
      throw boom.badRequest('Image URL is required')
    }

    return knex(momentImageTable)
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
        image_url: momentImage.image_url
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
