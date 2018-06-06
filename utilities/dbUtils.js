const uuid = require('uuid')
const express = require('express')
const boom = require('boom')

const UserService = require('../database/services/userService')
const userService = new UserService()

function retrieveUser(req, res, next) {
  if (req.email) {
    userService.getByEmail(req.email)
      .then((user) => {
        req.user = user
        next()
      })
      .catch(() => {
        next(boom.unauthorized())
      })
  }
  else {
    next(boom.unauthorized())
  }
}

console.log(uuid())

module.exports = {
  retrieveUser
}
