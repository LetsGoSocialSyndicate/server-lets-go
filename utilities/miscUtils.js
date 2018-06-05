/*
 * Copyright 2018, Socializing Syndicate Corp.
 */

const formatName = (firstName, lastName, middleName) => {
  return middleName ?
    `${firstName} ${middleName} ${lastName}` :
    `${firstName} ${lastName}`
}

module.exports = {
  formatName
}
