/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const EMAIL_DOMAIN = 'gmail.com'

const NOT_VERIFIED = 'NOT_VERIFIED'
const BAD_PASSWORD = 'BAD_PASSWORD'
const INVALID_INPUT = 'INVALID_INPUT'
const ALREADY_EXISTS = 'ALREADY_EXISTS'
const ALREADY_EXISTS_UNVERIFIED = 'ALREADY_EXISTS_UNVERIFIED'
const ALREADY_VERIFIED = 'ALREADY_VERIFIED'
const TOKEN_EXPIRED = 'TOKEN_EXPIRED'
const DATABASE_ERROR = 'DATABASE_ERROR'
const SENDING_MAIL_ERROR = 'SENDING_MAIL_ERROR'

module.exports = {
  EMAIL_DOMAIN, NOT_VERIFIED,
  BAD_PASSWORD, INVALID_INPUT,
  ALREADY_EXISTS, ALREADY_EXISTS_UNVERIFIED, DATABASE_ERROR,
  SENDING_MAIL_ERROR
}
