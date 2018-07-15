/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { profileImageTable, DEFAULT_USER_PROFILE_IMAGE } = require('../services/constants')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex(profileImageTable).del()
    .then(() => {
      // Inserts seed entries
      return knex(profileImageTable).insert([
        {
          id: 'be544fd3-7fc8-42c7-bc3b-696490aa22f5',
          image_url: DEFAULT_USER_PROFILE_IMAGE,
          user_id: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
          // public_id: ''
        },
        {
          id: '14235592-520c-43ed-883e-7fb74404f973',
          image_url: DEFAULT_USER_PROFILE_IMAGE,
          user_id: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
          // public_id: ''
        },
        {
          id: 'e9a76a0e-1709-4b5a-aed2-0740f7b09547',
          image_url: DEFAULT_USER_PROFILE_IMAGE,
          user_id: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
          // public_id: ''
        },
        {
          id: '6899d17c-199b-4f4d-8735-bb8d82234051',
          image_url: DEFAULT_USER_PROFILE_IMAGE,
          user_id: '4201b6db-bde1-43c5-9245-5fd59ec2796b'
          // public_id: ''
        },
        {
          id: '63c8f7e4-7aea-4f43-a40c-98a8cc38c42e',
          image_url: DEFAULT_USER_PROFILE_IMAGE,
          user_id: 'e407bfa4-f37e-4185-813c-677c935dbc4d'
          // public_id: ''
        },
        {
          id: '4bf714f3-4036-4817-8fa8-4dbee6d3b470',
          image_url: DEFAULT_USER_PROFILE_IMAGE,
          user_id: '747478d5-c17f-46a5-89ac-b44b5fdf2045'
          // public_id: ''
        }
      ])
    })
}
