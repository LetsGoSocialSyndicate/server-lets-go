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

const USER_EVENT_FIELDS = [
  'users.id as user_id', 'users.first_name as first_name', 'users.middle_name as middle_name',
  'users.last_name as last_name', 'users.email as email', 'users.role as user_role',
  'users.verified_at as user_verified_at', 'users.birthday as birthday',
  'users.hashed_password as hashed_password', 'users.gender as gender',
  'users.image_url as user_image_url', 'users.about as user_about', 'users.university_id as university_id',
  'events.id as event_id', 'events.title as event_title', 'events.location as event_location',
  'events.icon_url as event_icon_url', 'events.category as event_category',
  'events.description as event_description', 'events.start_time as event_start_time',
  'events.end_time as event_end_time'
]

module.exports = {
  UUID_UNIVERSITY_OF_COLORADO,
  USER_ROLE_ADMIN, USER_ROLE_REGULAR,
  USER_EVENT_FIELDS,
  universityTable,
  userTable, eventTable, tokenTable,
  eventRatingTable, userRatingTable, userEventTable
}
