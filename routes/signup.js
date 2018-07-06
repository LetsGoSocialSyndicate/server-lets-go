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
const moment = require('moment')
const UserService = require('../database/services/userService')
const ImageService = require('../database/services/imageService')
const TokenService = require('../database/services/tokenService')
const { ALREADY_EXISTS, ALREADY_EXISTS_UNVERIFIED, PASSWORD_REGULAR_EXP,
  DATABASE_ERROR, SENDING_MAIL_ERROR, TOKEN_EXPIRED } = require('../utilities/constants')
const { constructSuccess, constructFailure, invalidInput } = require('../utilities/routeUtil')
const { USER_ROLE_REGULAR, DEFAULT_USER_PROFILE_IMAGE } = require('../database/services/constants')
const { sendEmail } = require('../utilities/mailUtils')
const { checkToken } = require('../utilities/dbUtils')

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
  console.log("HEADERS:", req.headers)
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
  if (process.env.PASSWORD_RULE !== 'DEVELOP') {
    if (!password.match(PASSWORD_REGULAR_EXP)) {
      next(invalidInput("Password must contain at least one upper case letter and at least one number, and must be at least 8 characters or more."))
      return
    }
  }
  if (!isOlderThan18(new Date(birthday))) {
    next(invalidInput("You must be 18 or older to signup"))
    return
  }

  const userService = new UserService()
  const tokenService = new TokenService()
  const imageService = new ImageService()

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
  verifyUserNotInDatabase(userService, email).then(() => {
    return userService.insert(user)
  })
    .then(result => {
      user.id = result.id
      console.log('user', user)
      const tokenEntry = {
        email: email,
        token: crypto.randomBytes(3).toString('hex') //we will need 6 in migrations
      }
      console.log(tokenEntry);
      // TODO: check if token exists and return error.
      return tokenService.insert(tokenEntry).catch(err => {
        //if we were unable to insert token, we delete user also.
        userService.delete(result.id)
        throw err
      })
        .then(result => {
          console.log('result', result)
          console.log('result', result)
          imageService.insertUserProfileImage(user, DEFAULT_USER_PROFILE_IMAGE)

          return sendEmail(email, 'Let\'s Go: Account Verification',
            `<html>
              <head>
                <title>Let's Go: Account Verification</title>
              </head>
              <body>
                <p>
                  Hello,<br><br>
                  Please enter the code below on the screen and press OK to continue.<br><br>
                  The confirmation code is <b>${tokenEntry.token}</b>.<br>
                </p>
              </body>
            </html>`,
            'A verification code has been sent to ' + email + '.',
            'Error while sending verification email')
        })
        .then((result) => res.json(result))
        .catch((err) => next(err))
    })
    .catch((err) => {
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

router.patch('/:code', (req, res, next) => {
  console.log("HEADERS:", req.headers)
  const {
    email,
    password
  } = req.body
  const {
    code
  } = req.params
  if (!email) {
    next(invalidInput("Email cannot be blank"))
    return
  }
  console.log('email', email, 'code', code)
  const userService = new UserService()
  const tokenService = new TokenService()
  checkToken(email, code)
    .then((checkTokenResult) => {
      const user = checkTokenResult.user
      if (password) {
        user.hashed_password = bcrypt.hashSync(password, 8)
      }
      if (!user.verified_at) {
        user.verified_at = moment().format('YYYY-MM-DD')
      }
      userService.update(user).then(resultUserUpdate => {
        tokenService.delete(code)
        console.log('result', resultUserUpdate)
        return res.status(200).send({user: user, token: checkTokenResult.token})
      })
    })
    .catch((err) => {
      console.log("verify code error:", err)
      let payload = constructFailure(DATABASE_ERROR, 'Error while inserting new user into database', 500)
      if (err.err === TOKEN_EXPIRED) {
        tokenService.delete(code)
        payload = constructFailure(TOKEN_EXPIRED, 'The code has expired.', 401)
      } else if (err.isBoom) {
        const data = err.data ? err.data : {}
        payload =  {...data, ...err.output.payload}
      }
      next(payload)
    })
})

module.exports = router
