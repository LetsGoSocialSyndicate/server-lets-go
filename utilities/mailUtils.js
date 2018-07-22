/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const nodemailer = require('nodemailer')
const { EMAIL_PROVIDER, SENDING_MAIL_ERROR } = require('./constants')
const { constructSuccess, constructFailure, invalidInput } = require('./routeUtil')

const sendEmail = (to, subject, text, confirmMessage, errorMessage) => {
  const transporter = nodemailer.createTransport({
    service: EMAIL_PROVIDER,
    auth: {
      user: process.env.LETS_GO_EMAIL,
      pass: process.env.LETS_GO_EMAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.LETS_GO_EMAIL,
    to, subject,
    html: text
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('email error:', mailOptions, error)
        reject(constructFailure(SENDING_MAIL_ERROR, errorMessage, 500))
      }
      // console.log('sendMailResult:', info)
      resolve(constructSuccess(confirmMessage))
    })
  })
}

module.exports = { sendEmail }
