/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const jwt = require('jsonwebtoken')

// for Logged in request:
function getValidToken(req) {
  const { authorization } = req.headers
  // console.log('getValidToken - headers:', req.headers)
  // console.log('getValidToken - authorization:', authorization)
  if (!authorization) {
    throw new Error('Authorization header not found')
  }
  const authParsed = authorization.split(' ')
  if (authParsed.length !== 2) {
    throw new Error('Authorization header is corrupt')
  }
  try {
    return jwt.verify(authParsed[1], process.env.JWT_SECRET)
  } catch (error) {
    throw new Error('JWT token is invalid')
  }
}

function verifyToken(req, res, next) {
  try {
    const token = getValidToken(req)
    // console.log('verifyToken:', token)
    req.email = token.email // eslint-disable-line no-param-reassign
    req.userId = token.userId // eslint-disable-line no-param-reassign
    next()
  } catch (error) {
    // console.log('verifyToken error:', error)
    res.status(403).json({ error })
  }
}

module.exports = {
  getValidToken,
  verifyToken
}
