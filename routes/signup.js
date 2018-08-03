/* Copyright 2018, Socializing Syndicate Corp. */
const express = require('express')

const router = express.Router()

// const nodemailer = require('nodemailer')
// const bodyParser = require('body-parser')
// const exphbs = require('express-handlebars')
const crypto = require('crypto')
const boom = require('boom')
// const knex = require('../knex')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
const moment = require('moment')
const UserService = require('../database/services/userService')
const ProfileImageService = require('../database/services/profileImageService')
const TokenService = require('../database/services/tokenService')
const {
  ALREADY_EXISTS,
  ALREADY_EXISTS_UNVERIFIED,
  PASSWORD_REGULAR_EXP,
  DATABASE_ERROR,
  // SENDING_MAIL_ERROR,
  TOKEN_EXPIRED
} = require('../utilities/constants')
const {
  // constructSuccess,
  constructFailure,
  invalidInput
} = require('../utilities/routeUtil')
const {
  USER_ROLE_REGULAR,
  DEFAULT_USER_PROFILE_IMAGE
} = require('../database/services/constants')
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
const verifyAge = (birthday) => {
  const minAge = moment().utc().subtract(18, 'years').format('YYYY-MM-DD')
  return moment(birthday).isBefore(minAge)
}
// const isOlderThan18 = (birthday) => {
//   const today = new Date()
//   // console.log(birthday, today)
//   if (today.getFullYear() - birthday.getFullYear() > 18) {
//     return true
//   }
//   if (today.getFullYear() - birthday.getFullYear() < 18) {
//     return false
//   }
//   if (today.getMonth() > birthday.getMonth()) {
//     return true
//   }
//   if (today.getMonth() < birthday.getMonth()) {
//     return false
//   }
//   if (today.getDate() >= birthday.getDate()) {
//     return true
//   }
//   return false
// }

router.post('/', (req, res, next) => {
  // console.log("HEADERS:", req.headers)
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
    next(invalidInput('Birthday cannot be blank'))
    return
  }
  if (!email) {
    next(invalidInput('Email cannot be blank'))
    return
  }
  if (!password) {
    next(invalidInput('Password cannot be blank'))
    return
  }
  // if (process.env.PASSWORD_RULE !== 'DEVELOP') {
  //   if (!password.match(PASSWORD_REGULAR_EXP)) {
  // When password enforcement will be back
  // need to switch to this password rule in .env.production:
  // REACT_APP_PASSWORD_RULE=(?=.*[A-Z])(?=.*[0-9])(?=.{8,})
  // And update invalidInput to the "Password must contain at least...."
  //     next(invalidInput('Invalid password'))
  //     return
  //   }
  // }
  if (!verifyAge(new Date(birthday))) {
    next(invalidInput('You must be 18 or older to signup'))
    return
  }

  const userService = new UserService()
  const tokenService = new TokenService()
  const profileImageService = new ProfileImageService()

  // Create and save the user
  // By default verified_at is null
  const user = {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    email,
    hashed_password: bcrypt.hashSync(password, 8),
    gender,
    birthday,
    role: USER_ROLE_REGULAR
  }
  verifyUserNotInDatabase(userService, email)
    .then(() => userService.insert(user))
    .then(result => {
      user.id = result.id
      // console.log('user', user)
      const tokenEntry = {
        email,
        // we will need 6 in migrations
        token: crypto.randomBytes(3).toString('hex')
      }
      // console.log(tokenEntry);
      // TODO: check if token exists and return error.
      return tokenService.insert(tokenEntry).catch(err => {
        // if we were unable to insert token, we delete user also.
        userService.delete(result.id)
        throw err
      })
        .then(result => {
          profileImageService.insert(user, DEFAULT_USER_PROFILE_IMAGE)
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
            `A verification code has been sent to ${email}.`,
            'Error while sending verification email')
        })
        .then((data) => res.json(data))
        .catch((err) => next(err))
    })
    .catch((err) => {
      console.log('signup error: ', err)
      let status = 500
      let payload = constructFailure(
        DATABASE_ERROR,
        'Error while inserting new user into database',
        status
      )
      if (err.isBoom) {
        const data = err.data ? err.data : {}
        status = err.output.statusCode
        payload = { ...data, ...err.output.payload }
      }
      next(payload)
    })
})

router.patch('/:code', (req, res, next) => {
  // console.log("HEADERS:", req.headers)
  const {
    email,
    password
  } = req.body
  const {
    code
  } = req.params
  if (!email) {
    next(invalidInput('Email cannot be blank'))
    return
  }
  // console.log('email', email, 'code', code)
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
        // console.log('result', resultUserUpdate)
        return res.status(200).send({ user, token: checkTokenResult.token })
      })
    })
    .catch((err) => {
      console.log('verify code error:', err)
      let payload = constructFailure(
        DATABASE_ERROR,
        'Error while inserting new user into database',
        500
      )
      if (err.err === TOKEN_EXPIRED) {
        tokenService.delete(code)
        payload = constructFailure(TOKEN_EXPIRED, 'The code has expired.', 401)
      } else if (err.isBoom) {
        const data = err.data ? err.data : {}
        payload = { ...data, ...err.output.payload }
      }
      next(payload)
    })
})

module.exports = router
