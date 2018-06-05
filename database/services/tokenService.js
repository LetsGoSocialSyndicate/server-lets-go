/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const { tokenTable } = require('./constants')

class TokenService {
  get(token) {
    if (!token) {
      throw boom.badRequest('Token is required')
    }
    return knex(tokenTable)
      .where('token', token)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many entries for the token, ${token}`)
        }
        throw boom.notFound(`Token ${token} not found`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error retrieving token ${token}`)
      })
  }

  insert({token, email}) {
    if (!token) {
      throw boom.badRequest('Token is required')
    }
    if (!email) {
      throw boom.badRequest('Email is required')
    }

    return knex(tokenTable)
      .returning('*')
      .insert({
        email: email,
        token: token
      })
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many tokens, ${rows[0].token}`)
        }
        throw boom.badImplementation(`Unable to insert token`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error inserting token`)
      })
  }

  delete(token) {
    if (!token) {
      throw boom.badRequest('Token is required.')
    }

    return knex(tokenTable)
      .where('token', token)
      .del()
      .returning('*')
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many tokens for the token, ${rows[0].token}`)
        }
        throw boom.badImplementation(`Unable to delete token`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error deleting token`)
      })
  }
}

module.exports = TokenService
