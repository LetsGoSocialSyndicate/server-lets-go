/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const knex = require('../../knex')
const boom = require('boom')
const moment = require('moment')
const {
  messageTable,
  userTable,
  profileImageTable,
  MESSAGE_FIELDS_WITH_USERNAMES,
  CHAT_USERS_FIELDS
} = require('./constants')

const dedupChatmates = array => {
  const deduped = {}
  array.forEach(entry => {
    if (!(entry.id in deduped)) {
      deduped[entry.id] = entry
    } else {
      const oldTimestamp = moment(deduped[entry.id].sent_at)
      const newTimestamp = moment(entry.sent_at)
      if (newTimestamp > oldTimestamp) {
        deduped[entry.id] = entry
      }
    }
  })
  return Object.values(deduped)
}

class MessageService {
  get(id) {
    if (!id) {
      throw boom.badRequest('Message id is required')
    }
    return knex(messageTable)
      .select('*')
      .where('id', id)
      .then(rows => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many messages for the id, ${id}`)
        }
        throw boom.notFound(`No message found for the id, ${id}`)
      })
      .catch((err) => {
        console.log('MessageService.get: err', err)
        throw boom.badImplementation(`Error retrieving message details`)
      })
  }

  getChatMates(user_id) {
    if (!user_id) {
      throw boom.badRequest('User id is required')
    }
    return Promise.all([
      this.getSenders(user_id), this.getRecipients(user_id)
    ]).then(values => dedupChatmates(Array.prototype.concat(...values)))
  }

  getSenders(user_id) {
    if (!user_id) {
      throw boom.badRequest('User id is required')
    }
    return knex(messageTable)
      .select(CHAT_USERS_FIELDS)
      .innerJoin(userTable, `${messageTable}.sender`, `${userTable}.id`)
      .leftJoin(profileImageTable, `${messageTable}.recipient`, `${profileImageTable}.user_id`)
      .where('recipient', user_id)
      .then(rows =>
        dedupChatmates(rows.map(row => {
          return {
            id: row.sender,
            first_name: row.first_name,
            last_name: row.last_name,
            image_url: row.image_url,
            message: row.message,
            sent_at: row.sent_at,
            is_incoming: true
          }
        }))
      )
      .catch((err) => {
        console.log('MessageService.getSenders: err', err)
        throw boom.badImplementation(`Error retrieving senders`)
      })
  }

  getRecipients(user_id) {
    if (!user_id) {
      throw boom.badRequest('User id is required')
    }
    return knex(messageTable)
      .select(CHAT_USERS_FIELDS)
      .innerJoin(userTable, `${messageTable}.recipient`, `${userTable}.id`)
      .leftJoin(profileImageTable, `${messageTable}.recipient`, `${profileImageTable}.user_id`)
      .where('sender', user_id)
      .then(rows =>
        dedupChatmates(rows.map(row => {
          return {
            id: row.recipient,
            first_name: row.first_name,
            last_name: row.last_name,
            image_url: row.image_url,
            message: row.message,
            sent_at: row.sent_at,
            is_incoming: false
          }
        }))
      )
      .catch((err) => {
        console.log('MessageService.getRecipients: err', err)
        throw boom.badImplementation(`Error retrieving recipients`)
      })
  }

  getMessages(user_id, chatmate_id = null) {
    if (!user_id) {
      throw boom.badRequest('User id is required')
    }
    return Promise.all([
      this.getSentMessages(user_id, chatmate_id),
      this.getReceivedMessages(user_id, chatmate_id)
    ]).then(values => Array.prototype.concat(...values))
  }

  getSentMessages(user_id, chatmate_id = null) {
    if (!user_id) {
      throw boom.badRequest('User id is required')
    }
    const selection = { sender: user_id }
    if (chatmate_id) {
      selection.recipient = chatmate_id
    }
    return knex(messageTable)
      .select(MESSAGE_FIELDS_WITH_USERNAMES)
      .innerJoin(userTable, `${messageTable}.recipient`, `${userTable}.id`)
      .where(selection)
      .catch((err) => {
        console.log('MessageService.getSentMessages: err', err)
        throw boom.badImplementation(`Error retrieving sent messages`)
      })
  }

  getReceivedMessages(user_id, chatmate_id = null) {
    if (!user_id) {
      throw boom.badRequest('User id is required')
    }
    const selection = { recipient: user_id }
    if (chatmate_id) {
      selection.sender = chatmate_id
    }
    return knex(messageTable)
      .select(MESSAGE_FIELDS_WITH_USERNAMES)
      .innerJoin(userTable, `${messageTable}.sender`, `${userTable}.id`)
      .where(selection)
      .catch((err) => {
        console.log('MessageService.getReceivedMessages: err', err)
        throw boom.badImplementation(`Error retrieving received messages`)
      })
  }

  insert(message) {
    // ID is create by GiftedChat on client side when sending message.
    if (!message.id) {
      throw boom.badRequest('Id is required for inserted message')
    }
    if (!message.sender) {
      throw boom.badRequest('Sender (sender) is required for inserted message')
    }
    if (!message.recipient) {
      throw boom.badRequest('Recipient (recipient) is required for inserted message')
    }

    return knex(messageTable)
      .returning('*')
      .insert(message)
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many messages for the id, ${rows[0].id}`)
        }
        throw boom.badImplementation(`Unable to insert message`)
      })
      .catch((err) => {
        console.log('ERROR in MessageService.insert:', err)
        throw err.isBoom ? err : boom.badImplementation(`Error inserting user profile image`)
      })
  }

  delete(id) {
    if (!id) {
      throw boom.badRequest('Message id is required')
    }
    return knex(messageTable)
      .where('id', id)
      .del()
      .returning('*')
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0]
        }
        if (rows.length > 1) {
          throw boom.badImplementation(`Too many message for the id, ${id}`)
        }
        throw boom.notFound(`No message found for the id, ${id}`)
      })
      .catch((err) => {
        console.log('ERROR in MessageService.delete:', err)
        throw boom.badImplementation(`Error deleting message with the id, ${id}`)
      })
  }
}

module.exports = MessageService
