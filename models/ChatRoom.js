const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const CHAT_ROOM_TYPES = {
    CONSUMER_TO_CONSUMER: "consumer-to-consumer",
    CONSUMER_TO_SUPPORT: "consumer-to-support",
}

const { Schema } = mongoose;

const chatRoomSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => uuid().replace(/\-/g, ""),
        },
        userIds: Array,
        type: String,
        chatInitiator: String,
    },
    {
        timestamps: true,
        collection: "chatrooms",
    }
)

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)

chatRoomSchema.statics.initiateChat = async function (
    userIds,
    type,
    chatInitiator,
) {
    try {
        const availableRoom = await this.findOne({
            userIds: {
                $size: userIds.length,
                $all: [...userIds]
            },
            type,
        })

        if (availableRoom) {
            return {
                isNew: false,
                message: 'retrieving an old chat room...',
                chatRoomId: availableRoom._doc._id,
                type: availableRoom._doc.type,
            }
        }

        const newRoom = await this.create({
            userIds,
            type,
            chatInitiator,
        })

        return {
            isNew: true,
            message: 'create a new chatroom',
            chatRoomId: newRoom._doc._id,
            type: newRoom._doc._id
        }
    } catch (error) {
        throw error
    }
}

function validateChatRoom(data) {
    const schema = Joi.object({
        _id: Joi.string().guid({ version: ['uuidv4'] }),
        userIds: Joi
            .array()
            .items(Joi.string())
            .required(),
        type: Joi
            .string()
            .valid(CHAT_ROOM_TYPES.CONSUMER_TO_CONSUMER, CHAT_ROOM_TYPES.CONSUMER_TO_SUPPORT)
            .required()
    });

    return schema.validate(data)
}

module.exports = {
    ChatRoomTypes: CHAT_ROOM_TYPES,
    ChatRoom,
    validateChatRoom,
}