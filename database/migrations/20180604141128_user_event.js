/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { userEventTable, userTable, eventTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(userEventTable, (table) => {
    table.uuid('id')

    table.uuid('event_id').notNullable()
    table.foreign('event_id').references('id').inTable(eventTable).onDelete('cascade')

    // who posted the event, i.e. event organizer(s)
    table.uuid('posted_by')
    table.foreign('posted_by').references('id').inTable(userTable).onDelete('cascade')
    table.dateTime('posted_at').notNullable().defaultTo(knex.raw('now()'))

    // who requested to join the event, i.e. event participants
    table.uuid('requested_by')
    table.foreign('requested_by').references('id').inTable(userTable).onDelete('cascade')
    table.dateTime('requested_at')

    // who viewed the join request, i.e. one of event organizers viewed the participant
    // profile for the first time
    table.uuid('first_viewed_by')
    table.foreign('first_viewed_by').references('id').inTable(userTable).onDelete('cascade')
    table.dateTime('first_viewed_at')

    // who accepted the join request,
    table.uuid('accepted_by')
    table.foreign('accepted_by').references('id').inTable(userTable).onDelete('cascade')
    table.dateTime('accepted_at')

    // who rejected the join request,
    table.uuid('rejected_by')
    table.foreign('rejected_by').references('id').inTable(userTable).onDelete('cascade')
    table.dateTime('rejected_at')

    // the event organizer rates a participant, i.e. the user captured in requested_by
    // Number 1 through 5
    table.integer('creator_requestor_rating').notNullable().defaultTo(0)
    table.dateTime('creator_requestor_rated_at')
    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(userEventTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(userEventTable)
}
