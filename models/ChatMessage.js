const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const CHAT_MESSAGE_TYPES = {
    TYPE_TEXT: 'text'
}

const { Schema } = mongoose;

const readByRecipientSchema = new Schema(
    {
        _id: false,
        readByUserId: String,
        readAt: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: false
    }
)

const chatMessageSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => uuid().replace(/\-/g, "")
        },
        chatRoomId: String,
        message: mongoose.Schema.Types.Mixed,
        type: {
            type: String,
            default: () => CHAT_MESSAGE_TYPES.TYPE_TEXT
        },
        postedByUser: String,
        readByRecipient: [readByRecipientSchema]
    },
    {
        timestamps: true,
        collection: "chatmessages"
    }
)

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

function validateChatMessage(data) {
    const schema = Joi.object({
        messageText: Joi.string().required(),
    })

    return schema.validate(data);
}

module.exports = {
    ChatTypes: CHAT_MESSAGE_TYPES,
    ChatMessage,
    validateChatMessage,
}
