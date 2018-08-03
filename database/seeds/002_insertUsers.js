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
          id: '67fe4da3-1a5f-44be-9e1a-c896509e7425',
          first_name: 'Sukmi',
          middle_name: '',
          last_name: 'Ledru',
          email: 'sukmi.ledru@gmail.com',
          role: USER_ROLE_ADMIN,
          verified_at: '2018-07-19',
          birthday: '2000-07-15',
          hashed_password: '00b$08$AIz0pzMGdg/kxPdgQXsXG.ixLfRUbcYbW2vDHmtG1rd2bjd4lfZ5W',
          gender: 'female',
          about: 'Describe yourself here...',
          university_id: UUID_UNIVERSITY_OF_COLORADO,
          created_at: '2018-07-19 15:06:25.801173+00',
          updated_at: '2018-07-19 15:06:25.801173+00'
        },
        {
          id: '364f481c-c7d9-4ea1-9741-c71579efda68',
          first_name: 'Tommy',
          middle_name: '',
          last_name: 'Ziolkowski',
          email: 'ziolkowstr08@uww.edu',
          role: USER_ROLE_ADMIN,
          verified_at: '2018-07-19 00:00:00+00',
          birthday: '1993-06-08',
          hashed_password: '00b$08$1p0BUcBNpn/CMg/iIANHRuix41P41fIy1HmHI/cS9I2VD46grdAHm',
          gender: 'male',
          about: 'I’m an avid skier and cyclist who is studying accounting and finance. You can find me outside or at the library studying.',
          university_id: UUID_UNIVERSITY_OF_COLORADO,
          created_at: '2018-07-19 14:08:03.958573+00',
          updated_at: '2018-07-19 14:08:03.958573+00'
        },
        {
          id: '0c09ee34-72ba-4cc6-946b-ff1f2c5bff44',
          first_name: 'christian',
          middle_name: '',
          last_name: 'bourlier',
          email: 'chrisbourlier@hotmail.com',
          role: USER_ROLE_REGULAR,
          verified_at: '2018-07-24 00:00:00+00',
          birthday: '1981-01-07',
          hashed_password: '00b$08$n0IZxeJ529dQpZBAekudyuDBzTmMBH7Nb8NeS6XHikgNycH66tybi',
          gender: 'male',
          about: 'I cook and I know things! I love getting together for fun outdoor activities. Up for biking, hiking, camping, eating, and hitting the breweries!',
          university_id: UUID_UNIVERSITY_OF_COLORADO,
          created_at: '2018-07-24 00:36:04.237114+00',
          updated_at: '2018-07-24 00:36:04.237114+00'
        },
        {
          id: 'cf1dc34c-6cc2-492a-83fa-e717c141c098',
          first_name: 'Tanya',
          middle_name: '',
          last_name: 'Panich',
          email: 'panich.photos3@gmail.com',
          role: USER_ROLE_REGULAR,
          verified_at: '2018-07-24 00:00:00+00',
          birthday: '1990-09-22',
          hashed_password: '00b$08$eSGKJSMXzWNghjF9tUQ2oegECVH6x4QcrMZN4SdiWr/LF9pMS4HSa',
          gender: 'female',
          about: 'Describe yourself here...',
          university_id: UUID_UNIVERSITY_OF_COLORADO,
          created_at: '2018-07-24 01:06:54.142592+00',
          updated_at: '2018-07-24 01:06:54.142592+00'
        },
        {
          id: 'c58c71fc-a6b8-4502-8a8b-50cd7d104f2a',
          first_name: 'Jordan',
          middle_name: '',
          last_name: 'Caldwell',
          email: 'jordanjane2@yahoo.com',
          role: USER_ROLE_REGULAR,
          verified_at: '2018-07-24 00:00:00+00',
          birthday: '1991-07-24',
          hashed_password: '00b$08$MCdHAM2yhpLsbHffG6dTa.ghMnwNqeKjN8SjnhLYMXHNr6Uru.c5C',
          gender: 'female',
          about: 'Ski, Bike, Climb......try not to crash!',
          university_id: UUID_UNIVERSITY_OF_COLORADO,
          created_at: '2018-07-24 03:46:54.245344+00',
          updated_at: '2018-07-24 03:46:54.245344+00'
        },
        {
          id: 'fd0e9567-abe7-4a0b-968d-ca7b4821eebb',
          first_name: 'John',
          middle_name: '',
          last_name: 'Doe',
          email: 'tommy.ziolkowski@letsgotheapp.com',
          role: USER_ROLE_REGULAR,
          verified_at: '2018-07-26 00:00:00+00',
          birthday: '1995-07-26',
          hashed_password: '00b$08$lysWPWORO3Gl1ISVyry5fevRIFLQ/d8ZVtTG5gW9ThgB1g9kddvMO',
          gender: 'male',
          about: 'Describe yourself here...',
          university_id: UUID_UNIVERSITY_OF_COLORADO,
          created_at: '2018-07-26 18:15:15.842398+00',
          updated_at: '2018-07-26 18:15:15.842398+00'
        }
      ])
    })
}
