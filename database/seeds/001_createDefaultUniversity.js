/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { UUID_UNIVERSITY_OF_COLORADO, universityTable } = require('../services/constants')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex(universityTable).del()
    .then(() => {
      // Inserts seed entries
      return knex(universityTable).insert([
        {
          id: UUID_UNIVERSITY_OF_COLORADO,
          name: 'University of Colorado',
          email_domain: 'colorado.edu',
          address: 'Boulder, Colorado'
        }
      ])
    })
}
