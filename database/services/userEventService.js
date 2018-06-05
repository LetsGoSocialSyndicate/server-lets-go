/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const uuid = require('uuid/v4')
const { userTable, eventTable, userEventTable } = require('./constants')

class UserEventService {
  getAllEventsByParticipant(userId) {
    if (!userId) {
      throw boom.badRequest('User id is required')
    }
    return knex(userTable)
      .select('*')
      .leftJoin(userEventTable, `${userEventTable}.requested_by`, `${userTable}.id`)
      .leftJoin(eventTable, `${userEventTable}.event_id`, `${eventTable}.id`)
      .where(`${userTable}.id`, userId)
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        throw boom.notFound(`No events found`)
      })
      .catch((err) => {
        console.log('getAllEventsByParticipant: err', err)
        throw boom.badImplementation(`Error retrieving events`)
      })
  }

  getAllEventsByOrganizer(userId) {
    if (!userId) {
      throw boom.badRequest('User id is required')
    }
    return knex(userTable)
      .select('*')
      .leftJoin(userEventTable, `${userEventTable}.created_by`, `${userTable}.id`)
      .leftJoin(eventTable, `${userEventTable}.event_id`, `${eventTable}.id`)
      .where(`${userTable}.id`, userId)
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        throw boom.notFound(`No events found`)
      })
      .catch((err) => {
        console.log('getAllEventsByParticipant: err', err)
        throw boom.badImplementation(`Error retrieving events`)
      })
  }

  getEventOrganizers(eventId) {
    if (!eventId) {
      throw boom.badRequest('Event id is required')
    }
    return knex(eventTable)
      .select('*')
      .leftJoin(eventTable, `${userEventTable}.event_id`, `${eventTable}.id`)
      .leftJoin(userEventTable, `${userEventTable}.created_by`, `${userTable}.id`)
      .where(`${eventTable}.id`, eventId)
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        throw boom.notFound(`No events found`)
      })
      .catch((err) => {
        console.log('getAllEventsByParticipant: err', err)
        throw boom.badImplementation(`Error retrieving events`)
      })
  }

  getEventParticipants(eventId) {
    if (!eventId) {
      throw boom.badRequest('Event id is required')
    }
  }

  get(id) {
    if (!id) {
      throw boom.badRequest('User-Event id is required')
    }
    return knex(userEventTable)
      .where('id', id)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many user-event records for the id, ${id}`)
        }
        throw boom.notFound(`No user-event record found for the id, ${id}`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error retrieving user-event record with the id, ${id}`)
      })
  }

  insert(record) {
    if (!record.event_id) {
      throw boom.badRequest('Event id is required')
    }
    if (!record.posted_by) {
      throw boom.badRequest('Event organizer id is required')
    }

    return knex(userEventTable)
      .returning('*')
      .insert({
        ...record,
        id: uuid()
      })
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many user-event record for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to insert user-event record`)
      })
      .catch((err) => {
        console.log(err)
        throw err.isBoom ? err : boom.badImplementation(`Error inserting user-event record`)
      })
  }
}

module.exports = UserEventService
