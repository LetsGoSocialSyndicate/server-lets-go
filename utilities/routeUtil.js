/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { INVALID_INPUT } = require('./constants')

const  constructFailure = (errorType, msg, code) => {
  console.log('ERROR:', {errorType: errorType, message: msg})
  return {errorType: errorType, message: msg, statusCode: code}
}

const invalidInput = (msg) => {
  return constructFailure(INVALID_INPUT, msg, 400)
}

const constructSuccess = (msg) => {
  console.log("SUCCESS:", {message: msg})
  return {message: msg}
}

module.exports = {
  constructFailure, constructSuccess, invalidInput
}
