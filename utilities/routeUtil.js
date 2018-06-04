/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
 const  constructFailure = (errorType, msg) => {
   return {errorType: errorType, message: msg}
 }

 const invalidInput = (msg) => {
   return res.status(400).send(constructFailure(INVALID_INPUT, msg))
 }

 module.exports = {
   constructFailure, invalidInput
 }
