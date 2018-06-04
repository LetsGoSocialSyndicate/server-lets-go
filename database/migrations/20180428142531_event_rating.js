/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
 const { eventTable, userTable, eventRatingTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(eventRatingTable, (table) => {
    table.uuid('id')
    table.integer('number_of_stars').notNullable().defaultTo(0)
    table.text('comment').notNullable().defaultTo('')

    table.dateTime('rated_at').notNullable().defaultTo(knex.raw('now()'))

    table.uuid('rated_by').notNullable()
    table.foreign('rated_by').references('id').inTable(userTable).onDelete('cascade')

    table.uuid('event_rated').notNullable()
    table.foreign('event_rated').references('id').inTable(eventTable).onDelete('cascade')

    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(eventRatingTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(eventRatingTable)
}
