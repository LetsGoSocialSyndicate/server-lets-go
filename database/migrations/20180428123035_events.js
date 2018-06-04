/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { eventTable, userTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(eventTable, (table) => {
    table.uuid('id')
    table.string('title', 255).notNullable()
    table.string('location', 255).notNullable().defaultTo('')
    table.string('icon_url', 255).notNullable().defaultTo('')
    table.dateTime('start_time').notNullable().defaultTo(knex.raw('now()'))
    table.integer('duration_min').notNullable().defaultTo(0)
    table.text('description').notNullable().defaultTo('')
  })
    .then(() => {
      return knex.schema.alterTable(eventTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(eventTable)
}
