/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const jwt = require('jsonwebtoken')
const boom = require('boom')

function handleResponse(op, email, httpRes, user) {
  // console.log('email: ', email)
  const token = jwt.sign({
    'email': email
  }, process.env.SECRET_KEY)
  // console.log('token: ', token)
  httpRes.setHeader('Set-Cookie', `token=${token};`)
}

function noCaching(res) {
  res.setHeader('Cache-Control', `no-cache, no-store, must-revalidate`)
}

// for Logged in request:
function verifyToken(req, res, next) {
  const { authorization } = req.headers
  // console.log('verifyToken - authorization: ', authorization)

  try {
    if (!authorization) {
      throw new Error('Authorization header not found')
    }
    const authParsed = authorization.split(' ')
    if (authParsed.length !== 2) {
      throw new Error('Authorization header is corrupt')
    }
    jwt.verify(authParsed[1], process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new Error('JWT token is invalid')
      }
      else {
        // console.log('decoded', decoded)
        req.email = decoded.email
        req.userId = decoded.userId
        next()
      }
    })
  }
  catch (error) {
    res.status(403).json({ error })
  }
}

module.exports = {
  handleResponse,
  noCaching,
  verifyToken
}
