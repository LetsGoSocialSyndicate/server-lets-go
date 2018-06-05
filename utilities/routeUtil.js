/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { INVALID_INPUT } = require('./routesConstants')

const  constructFailure = (errorType, msg, code) => {
  return { errorType: errorType, message: msg, statusCode: code }
}

const invalidInput = (msg) => {
  return constructFailure(INVALID_INPUT, msg, 400)
}

module.exports = {
  constructFailure, invalidInput
}
