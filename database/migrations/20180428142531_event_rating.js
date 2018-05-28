/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
exports.up = (knex, Promise) => {
  return knex.schema.createTable('event_rating', (table) => {
    table.uuid('id')
    table.integer('number_of_stars').notNullable().defaultTo(0)
    table.text('comment').notNullable().defaultTo('')

    table.uuid('rated_by').notNullable()
    table.foreign('rated_by').references('id').inTable('users').onDelete('cascade')

    table.uuid('event_rated').notNullable()
    table.foreign('event_rated').references('id').inTable('events').onDelete('cascade')

    table.timestamps(true, true)

  })
    .then(() => {
      return knex.schema.alterTable('event_rating', (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('event_rating')
}
