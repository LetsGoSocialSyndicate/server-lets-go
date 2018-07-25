/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { momentImageTable, eventTable, userTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(momentImageTable, (table) => {
    table.uuid('id')
    table.text('image_url').notNullable().defaultTo('')
    table.text('public_id').notNullable().defaultTo('')

    table.uuid('user_id')
    table.foreign('user_id').references('id').inTable(userTable).onDelete('cascade')

    table.uuid('event_id')
    table.foreign('event_id').references('id').inTable(eventTable).onDelete('cascade')

    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(momentImageTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(momentImageTable)
}
