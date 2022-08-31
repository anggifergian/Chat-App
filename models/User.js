const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const USER_TYPE = {
    CONSUMER: "consumer",
    SUPPORT: "support"
};

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => uuid().replace(/\-/g, "")
        },
        firstName: String,
        lastName: String,
        type: String,
    },
    {
        timestamps: true,
        collection: "users",
    }
);

const User = mongoose.model('User', userSchema);

function validateUser(data) {
    const schema = Joi.object({
        _id: Joi.string().guid({ version: ['uuidv4'] }),
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        type: Joi
            .string()
            .valid(USER_TYPE.CONSUMER, USER_TYPE.SUPPORT)
            .required()
    })

    return schema.validate(data)
}

module.exports = {
    UserType: USER_TYPE,
    User,
    validateUser,
}