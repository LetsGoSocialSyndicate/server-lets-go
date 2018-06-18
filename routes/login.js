/* Copyright 2018, Socializing Syndicate Corp. */
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const UserService = require('../database/services/userService')
const TokenService = require('../database/services/tokenService')
const { sendEmail } = require('../utilities/mailUtils')
const {invalidInput, constructFailure} = require('../utilities/routeUtil')
const {NOT_VERIFIED, BAD_EMAIL_OR_PASSWORD, DATABASE_ERROR} = require('../utilities/constants')

require('dotenv').config()

const ONE_DAY = 1000 * 3600 * 24

const verifyUserInDatabase = (userService, email) => {
  return userService.getByEmail(email).then(result => {
    return "ok"
  }).catch(err => {
    if (err.typeof === boom.notFound) {
      throw boom.badRequest(
        'The email you have entered is not found.',
        {errorType: BAD_EMAIL_OR_PASSWORD})
    }
    throw err
  })
}

router.post('/', (req, res, next) => {
  const {email, password} = req.body
  console.log("login:", email, password)
  if (email && password) {
    const userService = new UserService()
    userService.getByEmail(email).then((result) => {
      if (bcrypt.compareSync(password, result.hashed_password)) {
        if (result.verified_at) {
          const payload = {
            email,
            userId: result.id
          }
          const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'})
          res.status(200).json({user: result, token})
        } else {
          next(constructFailure(NOT_VERIFIED, 'Your account has not been verified.', 401))
        }
      } else {
        next(constructFailure(BAD_EMAIL_OR_PASSWORD, 'Bad email or password.', 401))
      }
    }).catch((err) => {
      console.log("login error:", err)
      let status = 500
      let payload = constructFailure(DATABASE_ERROR, 'Error while looking up user in database', status)
      if (err.isBoom) {
        const data = err.data
          ? err.data
          : {}
        status = err.output.statusCode
        if (status === 404) {
          payload = constructFailure(BAD_EMAIL_OR_PASSWORD, 'Bad email or password.', 401)
        } else {
          payload = {
            ...data,
            ...err.output.payload
          }
        }
      }
      next(payload)
    })
  } else {
    next(invalidInput('Username and/or password was not sent'))
  }
  console.log("End of POST /login")
})

router.post('/code_for_pswd', (req, res, next) => {
  console.log("HEADERS:", req.headers)
  const {email} = req.body
  if (!email) {
    next(invalidInput("Email cannot be blank"))
    return
  }
  const userService = new UserService()
  const tokenService = new TokenService()

  verifyUserInDatabase(userService, email).then(() => {
    const tokenEntry = {
      email: email,
      token: crypto.randomBytes(3).toString('hex') //we will need at least 6 in migrations
    }
    console.log(tokenEntry);
    // TODO: check if token exists and return error.
    return tokenService.insert(tokenEntry).catch(err => {
      throw err
    }).then(result => {
      return sendEmail(email, 'Let\'s Go: Create New Password', `<html>
              <head>
                <title>Let's Go: Create New Password</title>
              </head>
              <body>
                <p>
                  Hello,<br><br>
                  Please enter the code below on the screen and press OK to continue.<br><br>
                  The confirmation code is <b>${tokenEntry.token}</b>.<br>
                </p>
              </body>
            </html>`, 'A verification code has been sent to ' + email + '.', 'Error while sending verification email')
    }).then((result) => res.json(result)).catch((err) => next(err))
  }).catch((err) => {
    console.log("code_for_pswd error:", err)
    let status = 500
    let payload = constructFailure(DATABASE_ERROR, 'Error while accessing user database', status)
    if (err.isBoom) {
      const data = err.data
        ? err.data
        : {}
      status = err.output.statusCode
      payload = {
        ...data,
        ...err.output.payload
      }
    }
    next(payload)
  })
})

router.get('/:token', (req, res, next) => {
  console.log('Params', req.params.token)
  const {token} = req.params

  if (!token) {
    next(invalidInput(res, "Invalid link with missing token"))
    return
  }

  const tokenService = new TokenService()
  const userService = new UserService()

  tokenService.get(token).then(resultTokenRecord => {
    const created_at = new Date(resultTokenRecord.created_at)
    const tokenAge = Date.now() - created_at
    //change later to 10 minutes
    if (tokenAge > ONE_DAY) {
      tokenService.delete(token).then(resultTokenDelete => {
        next(constructFailure(TOKEN_EXPIRED, 'The token has expired.', 401))
        return
      })
    }
    userService.getByEmail(resultTokenRecord.email).then(resultUserRecord => {
      if (!resultUserRecord.verified_at) {
        next(constructFailure(NOT_VERIFIED, 'Your account has not been verified.', 401))
        return
      }
      tokenService.delete(token).then(resultTokenDelete => {
        const payload = {
          email: resultUserRecord.email,
          userId: resultUserRecord.id
        }
        const sessionToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'})
        return res.status(200).send({user: resultUserRecord, token: sessionToken})
      })
    })
  }).catch((err) => {
    console.log("confirmation request error:", err)
    let status = 500
    let payload = constructFailure(DATABASE_ERROR, 'Error while confirming request.', status)
    if (err.isBoom) {
      const data = err.data
        ? err.data
        : {}
      status = err.output.statusCode
      payload = {
        ...data,
        ...err.output.payload
      }
    }
    next(payload)
  })
})

module.exports = router
