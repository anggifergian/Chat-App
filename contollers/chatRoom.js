const { validateChatMessage, ChatMessage } = require('../models/ChatMessage');
const { ChatRoom, validateChatRoom } = require('../models/ChatRoom')

module.exports = {
    initiate: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        try {
            const { error } = validateChatRoom(req.body);
            if (error) {
                return res.send(JSON.stringify({
                    status: 400,
                    message: error.details[0].message
                }))
            };

            const { userIds, type } = req.body
            const { userId: chatInitiator } = req
            const allUserIds = [...userIds, chatInitiator];
            const chatRoom = await ChatRoom.initiateChat(allUserIds, type, chatInitiator);

            res.send(JSON.stringify({
                status: 200,
                data: chatRoom,
            }))
        } catch (error) {
            return res.send(JSON.stringify({
                status: 500,
                error: error,
            }))
        }
    },
    postMessage: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        try {
            const { roomId } = req.params
            const { messageText, userId } = req.body

            const { error } = validateChatMessage(req.body)
            if (error) {
                res.send(JSON.stringify({
                    status: 400,
                    message: error.details[0].message,
                }))
            }

            let message = await ChatMessage.create({
                chatRoomId: roomId,
                message: {
                    messageText,
                },
                postedByUser: userId,
                readByRecipient: {
                    readByUserId: userId
                }
            })

            let aggregate = await ChatMessage.aggregate([
                { $match: { _id: message.id } },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'postedByUser',
                        foreignField: '_id',
                        as: 'postedByUser'
                    }
                },
                { $unwind: '$postedByUser' },
                {
                    $lookup: {
                        from: 'ChatRoom',
                        localField: 'chatRoomId',
                        foreignField: '_id',
                        as: 'chatRoomInfo'
                    }
                },
                { $unwind: '$chatRoomInfo' },
                { $unwind: '$chatRoomInfo.userIds' },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'chatRoomInfo.userIds',
                        foreignField: '_id',
                        as: 'chatRoomInfo.userProfile'
                    }
                },
                { $unwind: '$chatRoomInfo.userProfile' },
                {
                    $group: {
                        _id: `$chatRoomInfo._id`,
                        postId: { $last: '$_id' },
                        chatRoomId: { $last: '$chatRoomInfo._id' },
                        message: { $last: '$message' },
                        type: { $last: '$type' },
                        postedByUser: { $last: '$postedByUser' },
                        readByRecipient: { $last: '$readByRecipients' },
                        chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
                        createdAt: { $last: '$createdAt' },
                        updatedAt: { $last: '$updatedAt' }
                    }
                }
            ])

            let post = await aggregate[0]
            
            
        } catch (error) {

        }
    },
    getRecentConversation: async (req, res) => { },
    getConversationByRoomId: async (req, res) => { },
    markConversationReadByRoomId: async (req, res) => { },
}