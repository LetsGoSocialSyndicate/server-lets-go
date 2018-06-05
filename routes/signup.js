/* Copyright 2018, Socializing Syndicate Corp. */
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const crypto = require('crypto')
const boom = require('boom')
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserService = require('../database/services/userService')
const TokenService = require('../database/services/tokenService')
const { ALREADY_EXISTS, ALREADY_EXISTS_UNVERIFIED,
  DATABASE_ERROR, SENDING_MAIL_ERROR } = require('../utilities/constants')
const { constructSuccess, constructFailure, invalidInput } = require('../utilities/routeUtil')
const { USER_ROLE_REGULAR } = require('../database/services/constants')

const verifyUserNotInDatabase = (userService, email) => {
  return userService.getByEmail(email).then(result => {
    throw boom.badRequest(
      'The email you have entered is already ' +
      'associated with another account.', {
      errorType: result.verified_at
        ? ALREADY_EXISTS
        : ALREADY_EXISTS_UNVERIFIED
    })
  }).catch(err => {
    if (err.typeof !== boom.notFound) {
      throw err
    }
  })
}

const isOlderThan18 = (birthday) => {
  const today = new Date()
  console.log(birthday, today)
  if (today.getFullYear() - birthday.getFullYear() > 18) {
    return true
  }
  if (today.getFullYear() - birthday.getFullYear() < 18) {
    return false
  }
  if (today.getMonth() > birthday.getMonth()) {
    return true
  }
  if (today.getMonth() < birthday.getMonth()) {
    return false
  }
  if (today.getDate() >= birthday.getDate()) {
    return true
  }
  return false
}

router.post('/', (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    middleName,
    gender,
    birthday
  } = req.body
  if (!birthday) {
    next(invalidInput("Birthday cannot be blank"))
    return
  }
  if (!email) {
    next(invalidInput("Email cannot be blank"))
    return
  }
  if (!password) {
    next(invalidInput("Password cannot be blank"))
    return
  }
  if (!isOlderThan18(new Date(birthday))) {
    next(invalidInput("You must be 18 or older to signup"))
    return
  }

  const userService = new UserService()
  const tokenService = new TokenService()

  verifyUserNotInDatabase(userService, email).then(() => {
    // Create and save the user
    // By default verified_at is null
    const user = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email: email,
      hashed_password: bcrypt.hashSync(password, 8),
      gender: gender,
      birthday: birthday,
      role: USER_ROLE_REGULAR
    }
    return userService.insert(user)
  }).then(result => {
    const tokenEntry = {
      email: email,
      token: crypto.randomBytes(128).toString('hex') //we will need 256 in migrations
    }
    // TODO: check if token exists and return error.
    return tokenService.insert(tokenEntry).catch(err => {
      userService.delete(result.id)
      throw err
    }).then(result => {
      // Send the email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.LETS_GO_EMAIL,
          pass: process.env.LETS_GO_EMAIL_PASSWORD
        }
      })
      const mailOptions = {
        from: 'letsgosyndicate@gmail.com',
        to: email,
        subject: 'Let\'s Go: Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link:\n' +
              'http:\/\/' + req.headers.host + '\/confirmation\/' + tokenEntry.token + '.\n'
      }
      transporter.sendMail(mailOptions).then(result => {
        return res.status(200).send(constructSuccess('A verification email has been sent to ' + email + '.'))
      }).catch(err => {
        console.log("email error:", err)
        next(constructFailure(SENDING_MAIL_ERROR, 'Error while sending verification email', 500))
      })
    })
  }).catch((err) => {
    console.log("signup error:", err)
    let status = 500
    let payload = constructFailure(DATABASE_ERROR, 'Error while inserting new user into database', status)
    if (err.isBoom) {
      const data = err.data ? err.data : {}
      status = err.output.statusCode
      payload =  {...data, ...err.output.payload}
    }
    next(payload)
  })
})


module.exports = router
