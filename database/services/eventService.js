/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const uuid = require('uuid/v4')
const { eventTable } = require('./constants')

class EventService {
  getList() {
    return knex(eventTable)
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        throw boom.notFound(`No events found`)
      })
      .catch((err) => {
        console.log('get event list: err', err)
        throw boom.badImplementation(`Error retrieving events`)
      })
  }

  get(id) {
    if (!id) {
      throw boom.badRequest('Event id is required')
    }
    return knex(eventTable)
      .where('id', id)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many events for the id, ${id}`)
        }
        throw boom.notFound(`No event found for the id, ${id}`)
      })
      .catch((err) => {
        console.log('get event: err', err)
        throw boom.badImplementation(`Error retrieving event with the id, ${id}`)
      })
  }

  insert(event) {
    if (!event.title) {
      throw boom.badRequest('Event title is required')
    }
    if (!event.location) {
      throw boom.badRequest('Even location must not be blank')
    }

    return knex(eventTable)
      .returning('*')
      .insert({
        id: uuid()
      })
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many events for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to insert event`)
      })
      .catch((err) => {
        console.log('Insert event: err', err)
        throw boom.badImplementation(`Error inserting event`)
      })
  }

  update(event) {
    if (!event.title) {
      throw boom.badRequest('Event title is required')
    }
    if (!event.location) {
      throw boom.badRequest('Even location must not be blank')
    }

    return knex(eventTable)
      .returning('*')
      .update({
        title: event.title
      })
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many events for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to update event`)
      })
      .catch((err) => {
        console.log('update: err', err)
        throw boom.badImplementation(`Error updating event`)
      })
  }

  delete(id) {
    if (!id) {
      throw boom.badRequest('Event id is required')
    }
    return knex(eventTable)
      .where('id', id)
      .del()
      .returning('*')
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many events for the id, ${id}`)
        }
        throw boom.notFound(`No event found for the id, ${id}`)
      })
      .catch((err) => {
        console.log('delete event: err', err)
        throw boom.badImplementation(`Error deleting event with the id, ${id}`)
      })
  }
}

module.exports = EventService
