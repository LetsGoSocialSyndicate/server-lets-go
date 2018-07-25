/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { messageTable } = require('../services/constants')
const { MESSAGE_TYPE_CHAT } = require('../../chat/chatProtocol')

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
          message_type: MESSAGE_TYPE_CHAT,
          sent_at: '2018-07-17 15:53:42'
        },
        {
          id: 'c83673e8-ccb0-485b-87af-e70ea4f04f64',
          message: 'Are you up for skiing, Tanya?',
          sender: '4201b6db-bde1-43c5-9245-5fd59ec2796b',
          recipient: 'a9e6d36c-9ecb-408a-a4e4-e5893fa4154d',
          message_type: MESSAGE_TYPE_CHAT,
          sent_at: '2018-07-19 17:53:42'
        },
        {
          id: '98a74254-6472-49bc-a3e5-7449c7c0e05e',
          message: 'Sure, but who will watch my kids?',
          sender: 'a9e6d36c-9ecb-408a-a4e4-e5893fa4154d',
          recipient: '4201b6db-bde1-43c5-9245-5fd59ec2796b',
          message_type: MESSAGE_TYPE_CHAT,
          sent_at: '2018-07-19 17:53:49'
        }
      ])
    })
}
