/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { imageTable, eventTable, userTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(imageTable, (table) => {
    table.uuid('id')
    table.text('image_url').notNullable().defaultTo('')

    table.uuid('event_id').notNullable()
    table.foreign('event_id').references('id').inTable(eventTable).onDelete('cascade')

    table.uuid('user_id')
    table.foreign('user_id').references('id').inTable(userTable).onDelete('cascade')

    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(imageTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(imageTable)
}
