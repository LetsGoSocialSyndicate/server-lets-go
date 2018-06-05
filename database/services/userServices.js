const { UUID_UNIVERSITY_OF_COLORADO } = require('./constants')

/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const uuid = require('uuid/v4')
const { userTable } = require('./constants')

class UserService {
  getList() {
    return knex(userTable)
      .then((rows) => {
        if (rows.length > 0) {
          return rows
        }
        throw boom.notFound(`No users found`)
      })
      .catch((err) => {
        console.log('get User: err', err)
        throw boom.badImplementation(`Error retrieving users`)
      })
  }

  getById(id) {
    if (!id) {
      throw boom.badRequest('User id is required')
    }
    return knex(userTable)
      .where('id', id)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many users for the id, ${id}`)
        }
        throw boom.notFound(`No user found for the id, ${id}`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error retrieving user with the id, ${id}`)
      })
  }

  getByEmail(email) {
    if (!email) {
      throw boom.badRequest('Email is required')
    }
    return knex(userTable)
      .where('email', email)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many users for the email, ${email}`)
        }
        throw boom.notFound(`No users found for the email, ${email}`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error retrieving user by the email, ${email}`)
      })
  }

  insert(user) {
    if (!user.email) {
      throw boom.badRequest('Email is required')
    }

    return knex(userTable)
      .returning('*')
      .insert({
        id: uuid(),
        university_id: UUID_UNIVERSITY_OF_COLORADO,
        ...user
      })
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many users for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to insert user`)
      })
      .catch((err) => {
        console.log("user insert error:", err)
        throw err.isBoom ? err : boom.badImplementation(`Error inserting user`)
      })
  }

  update(user) {
    if (!user.email) {
      throw boom.badRequest('Email is required')
    }
    console.log("user update start:", user)

    return knex(userTable)
      .where('email', user.email)
      // object keys === database keys
      // If we do not want to update whole user, but only few fields,
      // then we need to check that these fields present in user obj.
      .update(user)
      .returning('*')
      .then((rows) => {
        console.log("update rows", rows)
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many users for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to update user`)
      })
      .catch((err) => {
        console.log("user update error:", err)
        throw err.isBoom ? err : boom.badImplementation(`Error updating user`)
      })
  }

  delete(id) {
    if (!id) {
      throw boom.badRequest('User id is required')
    }

    return knex(userTable)
      .where('id', id)
      .del()
      .returning('*')
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many users for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to delete user`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error deleting user`)
      })
  }
}

module.exports = UserService
