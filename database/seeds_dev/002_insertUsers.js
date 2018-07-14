/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { UUID_UNIVERSITY_OF_COLORADO, USER_ROLE_ADMIN, USER_ROLE_REGULAR, userTable } = require('../services/constants')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex(userTable).del()
    .then(() => {
      // Inserts seed entries
      return knex(userTable).insert([
        {
          id: '747478d5-c17f-46a5-89ac-b44b5fdf2045',
          first_name: 'Sukmi',
          middle_name: '',
          last_name: 'Ledru',
          email: 'sukmi.ledru@gmail.com',
          role: USER_ROLE_REGULAR,
          verified_at: '2018-07-10',
          birthday: '2000-07-11',
          hashed_password: '$2b$08$vCYuiN3EEm99oqEFx6qn3eFlTvCqX6zxYi7iGbaZ3zjo6fGQdXfzG',
          gender: 'female',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        },
        {
          id: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4',
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          email: 'slledru+3@gmail.com',
          verified_at: '1999-01-01',
          role: USER_ROLE_REGULAR,
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'female',
          birthday: '1999-01-01',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        },
        {
          id: 'd7ff1352-305b-4f25-8104-062646ef9eb4',
          first_name: 'John',
          middle_name: '',
          last_name: 'Doe',
          email: 'slledru+4@gmail.com',
          verified_at: '1999-01-01',
          role: USER_ROLE_REGULAR,
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'male',
          birthday: '1999-01-01',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        },
        {
          id: 'e02ea500-0f47-4ea5-9031-f55d0b536708',
          first_name: 'Sam',
          middle_name: '',
          last_name: 'Smith',
          email: 'slledru+5@gmail.com',
          verified_at: '1999-01-01',
          role: USER_ROLE_REGULAR,
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'male',
          birthday: '1999-01-01',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        },
        {
          id: 'e407bfa4-f37e-4185-813c-677c935dbc4d',
          first_name: 'Sukmi',
          middle_name: '',
          last_name: 'Ledru',
          email: 'slledru+1@gmail.com',
          verified_at: '1999-01-01',
          role: USER_ROLE_REGULAR,
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'female',
          birthday: '1999-01-01',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        },
        {
          id: '4201b6db-bde1-43c5-9245-5fd59ec2796b',
          first_name: 'Kathy',
          middle_name: '',
          last_name: 'Kim',
          email: 'slledru+2@gmail.com',
          verified_at: '1999-01-01',
          role: USER_ROLE_REGULAR,
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'female',
          birthday: '1999-01-01',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        }
      ])
    })
}
