/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const {INVALID_INPUT} = require('./constants')

const  constructFailure = (errorType, msg, code) => {
  console.log('ERROR:', {errorType: errorType, message: msg})
  return {errorType: errorType, message: msg, statusCode: code}
}

<<<<<<< HEAD
const invalidInput = (msg) => {
  return constructFailure(INVALID_INPUT, msg, 400)
}

module.exports = {
  constructFailure, invalidInput
}
=======
 const constructSuccess = (msg) => {
   console.log("SUCCESS:", {message: msg})
   return {message: msg}
 }
 const invalidInput = (res, msg) => {
   return res.status(400).send(constructFailure(INVALID_INPUT, msg))
 }

 module.exports = {
   constructFailure, constructSuccess, invalidInput
 }
>>>>>>> signup route connected to frontend
