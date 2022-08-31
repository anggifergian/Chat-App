const express = require('express');
const router = express.Router();

const { encode } = require('./middlewares/jwt');

const user = require('./contollers/user');
const room = require('./contollers/chatRoom');
const deleteC = require('./contollers/delete');
const login = require('./contollers/login');

router
    .post(`/login/:userId`, encode, login.login)
    .get(`/user`, user.onGetAllUsers)
    .get(`/user/:id`, user.onGetUserById)
    .post(`/user`, user.onCreateUser)
    .delete(`/user/:id`, user.onDeleteUserById)
    .get(`/room`, room.getRecentConversation)
    .get(`/room/:roomId`, room.getConversationByRoomId)
    .post(`/room/initiate`, room.initiate)
    .post(`/room/:rooId/message`, room.postMessage)
    .put(`/room/:roomId/mark-read`, room.markConversationReadByRoomId)
    .delete(`/room/:roomId`, deleteC.deleteRoomById)
    .delete(`/message/:messageId`, deleteC.deleteMessageById)

module.exports = router