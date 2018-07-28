/* Copyright 2018, Socializing Syndicate Corp. */
const UserEventService = require('../database/services/userEventService')
const MomentImageService = require('../database/services/momentImageService')

const toImageProps = image => {
  return {
    id: image.id,
    image_url: image.image_url
  }
}

const getUserEventsWithImages = (userId, done) => {
  const userEventService = new UserEventService()
  const momentImageService = new MomentImageService()
  const imagesPromise = momentImageService.getAllUserImages(userId)
  const eventsPromise = userEventService.getAllUserEvents(userId, done)
  return Promise.all([imagesPromise, eventsPromise]).then(values => {
    const [outImages, outEvents] = values
    outImages.forEach(image => {
      for (let event of outEvents) {
        if (event.event_id === image.event_id) {
          if (event.images) {
            event.images.push(toImageProps(image))
          } else {
            event.images = [toImageProps(image)]
          }
        }
      }
    })
    console.log('getAllUserEventsWithImages:', outEvents)
    return outEvents
  })
}

module.exports = {
  getUserEventsWithImages
}
