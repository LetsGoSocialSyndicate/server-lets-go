/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
 const { userTable, userRatingTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(userRatingTable, (table) => {
    table.uuid('id')
    table.integer('number_of_stars').notNullable().defaultTo(0)
    table.text('comment').notNullable().defaultTo('')

    table.dateTime('rated_at').notNullable().defaultTo(knex.raw('now()'))
    table.uuid('rated_by').notNullable()
    table.foreign('rated_by').references('id').inTable(userTable).onDelete('cascade')

    table.uuid('user_rated').notNullable()
    table.foreign('user_rated').references('id').inTable(userTable).onDelete('cascade')

    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(userRatingTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(userRatingTable)
}
