/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
 const {INVALID_INPUT} = require('./constants')

 const  constructFailure = (errorType, msg) => {
   console.log("ERROR:", {errorType: errorType, message: msg})
   return {errorType: errorType, message: msg}
 }

 const invalidInput = (res, msg) => {
   return res.status(400).send(constructFailure(INVALID_INPUT, msg))
 }

 module.exports = {
   constructFailure, invalidInput
 }
