/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { messageTable, userTable } = require('../services/constants')

exports.up = (knex, Promise) => { // eslint-disable-line no-unused-vars
  return knex.schema.createTable(messageTable, (table) => {
    table.uuid('id')
    table.text('message').notNullable().defaultTo('')
    table.dateTime('sent_at').notNullable()

    table.varchar('type', 20).notNullable()
    table.uuid('sender')
    table.uuid('recipient')
    table.foreign('sender').references('id').inTable(userTable).onDelete('cascade')
    table.foreign('recipient').references('id').inTable(userTable).onDelete('cascade')

    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(messageTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => { // eslint-disable-line no-unused-vars
  return knex.schema.dropTableIfExists(messageTable)
}
