/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { messageTable } = require('../services/constants')

exports.seed = (knex, Promise) => { // eslint-disable-line no-unused-vars
  // Deletes ALL existing entries
  return knex(messageTable).del()
    .then(() => {
      // Inserts seed entries
      return knex(messageTable).insert([
        {
          id: '5aef9a8f-3d23-4249-9cf5-e837a9e54dd9',
          message: 'Hey PanyaTanich, what`s up?',
          sender: 'a9e6d36c-9ecb-408a-a4e4-e5893fa4154d',
          recipient: 'e2aec1a1-60b4-46c0-8fb6-9bb663de862b',
          sent_at: '2018-07-17 15:53:42'
        }
      ])
    })
}
