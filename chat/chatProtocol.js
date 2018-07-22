/*
 * Copyright 2018, Socializing Syndicate Corp.
 */

// NOTE: This file need to be in sync with client.

// The very first request from user, should be called once per session,
// i.e. on login or first navigation to chat/messages scene.
// It also serves as request to get list of users with which current user
// had conversations.
// Direction: Client -> Server
// Params: userId
const JOIN = 'join'

// Requests conversation history of current user with another chatmate.
// Direction: Client -> Server
// Params: userId, chatmateId
const GET_PREVIOUS_MESSAGES = 'getPreviousMessages'

// Sends message from current user to another chatmate.
// Direction: Client -> Server
// Params: userId, message
//         where message is { _id, text, createdAt, user}
//         where user is {_id, name, avatar}
const SEND_MESSAGE = 'sendMessage'

// Response to JOIN request.
// Sends list of users with which current user had conversations.
// Direction: Server -> Client
// Params: [user, ...]
//         where user is {_id, name, avatar}
const CHATMATES = 'chatmates'

// Response to GET_PREVIOUS_MESSAGES request.
// Sends message from current user to another chatmate.
// Direction: Server -> Client
// Params: chatmateId, [message, ...]
//         where message is { _id, text, createdAt, user}
//         where user is {_id, name, avatar}
const PREVIOUS_MESSAGES = 'previousMessages'

// Response to SEND_MESSAGE request.
// Dispatches message from current user to another chatmate.
// Direction: Server -> Client
// Params: message
//         where message is { _id, text, createdAt, user}
//         where user is {_id, name, avatar}
const MESSAGE = 'message'

module.exports = {
  JOIN,
  GET_PREVIOUS_MESSAGES,
  SEND_MESSAGE,
  CHATMATES,
  PREVIOUS_MESSAGES,
  MESSAGE
}
