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
  'events.end_time as event_end_time',
  'user_event.posted_by as event_posted_by',
  'user_event.posted_at as event_posted_at',
  'user_event.requested_by as join_requested_by',
  'user_event.requested_at as join_requested_at',
  'user_event.first_viewed_by as join_request_first_viewed_by',
  'user_event.first_viewed_at as join_request_first_viewed_at',
  'user_event.accepted_at as join_request_accepted_at',
  'user_event.rejected_at as join_request_rejected_at'
]

const USER_EVENT_FULL_FIELDS = [
  'users.id as user_id', 'users.first_name as first_name', 'users.middle_name as middle_name',
  'users.last_name as last_name', 'users.email as email', 'users.role as user_role',
  'users.verified_at as user_verified_at', 'users.birthday as birthday',
  'users.hashed_password as hashed_password', 'users.gender as gender',
  'users.image_url as user_image_url', 'users.about as user_about', 'users.university_id as university_id',
  'events.id as event_id', 'events.title as event_title', 'events.location as event_location',
  'events.icon_url as event_icon_url', 'events.category as event_category',
  'events.description as event_description', 'events.start_time as event_start_time',
  'events.end_time as event_end_time',
  'user_event.posted_by as event_posted_by',
  'user_event.posted_at as event_posted_at',
  'user_event.requested_by as join_requested_by',
  'user_event.requested_at as join_requested_at',
  'user_event.first_viewed_by as join_request_first_viewed_by',
  'user_event.first_viewed_at as join_request_first_viewed_at',
  'user_event.accepted_at as join_request_accepted_at',
  'user_event.rejected_at as join_request_rejected_at',
  'users2.first_name as organizer_first_name', 'users2.middle_name as organizer_middle_name',
  'users2.last_name as organizer_last_name'
]

const USER_FIELDS = [
  'id', 'first_name', 'middle_name', 'last_name',
  'email', 'role', 'verified_at', 'birthday',
  'gender', 'image_url', 'about', 'university_id'
]

module.exports = {
  UUID_UNIVERSITY_OF_COLORADO,
  USER_ROLE_ADMIN, USER_ROLE_REGULAR,
  USER_EVENT_FIELDS, USER_FIELDS,
  USER_EVENT_FULL_FIELDS,
  universityTable,
  userTable, eventTable, tokenTable,
  eventRatingTable, userRatingTable, userEventTable
}
