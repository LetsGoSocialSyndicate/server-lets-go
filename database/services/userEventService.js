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
}
