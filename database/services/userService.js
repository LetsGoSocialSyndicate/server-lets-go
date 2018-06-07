const { UUID_UNIVERSITY_OF_COLORADO, USER_FIELDS } = require('./constants')

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
      .select(USER_FIELDS)
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
      .select(USER_FIELDS)
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
      .select('*')
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
      .returning(USER_FIELDS)
      .insert({
        ...user,
        id: uuid(),
        university_id: UUID_UNIVERSITY_OF_COLORADO,
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
    let params = {}
    if (user.id) {
      params = {key: 'id', value: user.id}
    } else if (user.email) {
      params = {key: 'email', value: user.email}
    } else {
      throw boom.badRequest('Email or Id is required')
    }
    console.log("user update start:", user)

    return knex(userTable)
      .where(params.key, params.value)
      // object keys === database keys
      // If we do not want to update whole user, but only few fields,
      // then we need to check that these fields present in user obj.
      .update(user)
      .returning(USER_FIELDS)
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
      .returning(USER_FIELDS)
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
