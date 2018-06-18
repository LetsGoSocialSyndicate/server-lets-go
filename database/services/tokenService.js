/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const { tokenTable } = require('./constants')

class TokenService {
  get(token) {
    if (!token) {
      throw boom.badRequest('Token/Code is required')
    }
    return knex(tokenTable)
      .where('token', token)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many entries with same token/code`)
        }
        throw boom.notFound(`Token/Code not found`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error retrieving token/code`)
      })
  }

  insert({token, email}) {
    if (!token) {
      throw boom.badRequest('Token/Code is required')
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
          throw boom.badImplementation(`Too many entries with same token/code`)
        }
        throw boom.badImplementation(`Unable to insert token/code`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error inserting token/code`)
      })
  }

  delete(token) {
    if (!token) {
      throw boom.badRequest('Token/Code is required.')
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
          throw boom.badImplementation(`Too many entries with same token/code`)
        }
        throw boom.badImplementation(`Unable to delete token/code`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error deleting token/code`)
      })
  }
}

module.exports = TokenService
