/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const userTable = 'users'
const eventTable = 'events'
const tokenTable = 'tokens'
const universityTable = 'universities'
const eventRatingTable = 'event_rating'
const userRatingTable = 'user_rating'
const userEventTable = 'user_event'

const UUID_UNIVERSITY_OF_COLORADO = 'a8471c7a-16c4-480d-8c2b-ce05af92417d'

const USER_ROLE_ADMIN = 'admin'
const USER_ROLE_REGULAR = 'regular'

module.exports = {
  UUID_UNIVERSITY_OF_COLORADO,
  USER_ROLE_ADMIN, USER_ROLE_REGULAR,
  universityTable,
  userTable, eventTable, tokenTable,
  eventRatingTable, userRatingTable, userEventTable
}
