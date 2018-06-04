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

  get(id) {
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

  getByUsername(username) {
    if (!username) {
      throw boom.badRequest('Username is required')
    }
    return knex(userTable)
      .where('username', username)
      .then((rows) => {
        console.log("getByUsername rows", rows)
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many users for the username, ${username}`)
        }
        throw boom.notFound(`No users found for the username, ${username}`)
      })
      .catch((err) => {
        throw err.isBoom ? err : boom.badImplementation(`Error retrieving user by the username, ${username}`)
      })
  }

  insert(user) {
    if (!user.username) {
      throw boom.badRequest('Username name is required')
    }
    if (!user.email) {
      throw boom.badRequest('Email must not be blank')
    }

    return knex(userTable)
      .returning('*')
      .insert({
        id: uuid(),
        first_name: user.first_name,
        middle_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        hashed_password: user.hashed_password,
        gender: user.gender,
        image: user.image,
        about: user.about,
        is_verified: user.is_verified,
        birthday: user.birthday,
        avg_speed_min: user.avg_speed_min,
        university_id: UUID_UNIVERSITY_OF_COLORADO
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
        throw err.isBoom ? err : boom.badImplementation(`Error inserting user`)
      })
  }

  update(user) {
    if (!user.username) {
      throw boom.badRequest('Username name is required')
    }
    if (!user.email) {
      throw boom.badRequest('Email must not be blank')
    }
    // TODO: do I need to pass all fields here?
    return knex(userTable)
      .where('username', user.username)
      .update({
        first_name: user.first_name,
        middle_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        hashed_password: user.hashed_password,
        gender: user.gender,
        image: user.image,
        about: user.about,
        is_verified: user.is_verified
        // Not sure, if we let them update university_id
      })
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
