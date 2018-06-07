/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const uuid = require('uuid/v4')
const { userTable, eventTable, userEventTable,
  USER_EVENT_FIELDS, USER_EVENT_FULL_FIELDS
} = require('./constants')

class UserEventService {
  getAllEvents() {
    return knex(userTable)
      .select(USER_EVENT_FIELDS)
      .innerJoin(userEventTable, `${userEventTable}.posted_by`, `${userTable}.id`)
      .innerJoin(eventTable, `${userEventTable}.event_id`, `${eventTable}.id`)
      .orderBy(`${userEventTable}.posted_at`, 'desc')
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        return []
      })
      .catch((err) => {
        console.log('getAllEventsByParticipant: err', err)
        throw boom.badImplementation(`Error retrieving events`)
      })
  }

  getEventById(user_event_id) {
    if (!user_event_id) {
      throw boom.badRequest('User-Event id is required')
    }
    return knex(userTable)
      .select(USER_EVENT_FIELDS)
      .innerJoin(userEventTable, `${userEventTable}.posted_by`, `${userTable}.id`)
      .innerJoin(eventTable, `${userEventTable}.event_id`, `${eventTable}.id`)
      .where(`${userEventTable}.id`, user_event_id)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many user-event records for the id, ${user_event_id}`)
        }
        throw boom.notFound(`No user-event record found for the id, ${user_event_id}`)
      })
      .catch((err) => {
        console.log('getAllEventsByParticipant: err', err)
        throw boom.badImplementation(`Error retrieving events`)
      })
  }

  getAllEventsByParticipant(userId) {
    if (!userId) {
      throw boom.badRequest('User id is required')
    }
    return knex(userTable)
      .select(USER_EVENT_FIELDS)
      .innerJoin(userEventTable, `${userEventTable}.requested_by`, `${userTable}.id`)
      .innerJoin(eventTable, `${userEventTable}.event_id`, `${eventTable}.id`)
      // .innerJoin('users as users2', `${userEventTable}.posted_by`, 'users2.id')
      .where(`${userTable}.id`, userId)
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        return []
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
      .select(USER_EVENT_FIELDS)
      .innerJoin(userEventTable, `${userEventTable}.created_by`, `${userTable}.id`)
      .innerJoin(eventTable, `${userEventTable}.event_id`, `${eventTable}.id`)
      .where(`${userTable}.id`, userId)
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        return []
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
      .select(USER_EVENT_FIELDS)
      .innerJoin(userEventTable, `${userEventTable}.event_id`, `${eventTable}.id`)
      .innerJoin(userTable, `${userEventTable}.posted_by`, `${userTable}.id`)
      .where(`${eventTable}.id`, eventId)
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        return []
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

  update(record) {
    if (!record.id) {
      throw boom.badRequest('User-Event record id is required')
    }
    return knex(userEventTable)
      .returning('*')
      .update(record)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many user-event record for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to update user-event record`)
      })
      .catch((err) => {
        console.log(err)
        throw err.isBoom ? err : boom.badImplementation(`Error updating user-event record`)
      })
  }
}

module.exports = UserEventService
