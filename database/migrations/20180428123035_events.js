/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { eventTable, userTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(eventTable, (table) => {
    table.uuid('id')
    table.string('title', 255).notNullable()
    table.string('location', 255).notNullable().defaultTo('')
    table.string('icon_name', 255).notNullable().defaultTo('')
    table.dateTime('start_time').notNullable().defaultTo(knex.raw('now()'))
    table.integer('duration_min').notNullable().defaultTo(0)
    table.text('description').notNullable().defaultTo('')

    table.uuid('user_owner_id').notNullable()
    table.foreign('user_owner_id').references('id').inTable(userTable).onDelete('cascade')

    table.uuid('user_participant_id').notNullable()
    table.foreign('user_participant_id').references('id').inTable(userTable).onDelete('cascade')
    table.timestamps(true, true)
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
