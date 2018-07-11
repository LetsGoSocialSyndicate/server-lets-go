/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { profileImageTable, userTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(profileImageTable, (table) => {
    table.uuid('id')
    table.text('image_url').notNullable().defaultTo('')

    table.uuid('user_id')
    table.foreign('user_id').references('id').inTable(userTable).onDelete('cascade')

    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(profileImageTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(profileImageTable)
}
