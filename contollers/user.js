const _ = require("lodash");

const { validateUser, User } = require('../models/User');

module.exports = {
    onCreateUser: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const { error } = validateUser(req.body);
        if (error) {
            return res.send(JSON.stringify({
                status: 400,
                message: error.details[0].message
            }))
        };

        let user = await User.findOne({
            $or: [
                { firstName: req.body.firstName },
                { lastName: req.body.lastName }
            ]
        });

        if (user) {
            return res.send(JSON.stringify({
                status: 400,
                message: `User has been registered.`
            }));
        }

        user = new User(_.pick(req.body, ["firstName", "lastName", "type"]));

        const newUser = await user.save();

        res.send(JSON.stringify({
            status: 200,
            message: `Success create user with id ${newUser.id}`
        }));
    },
    onGetAllUsers: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const users = await User.find().sort('firstName');
        res.send(JSON.stringify({
            status: 200,
            data: users
        }))
    },
    onGetUserById: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const _id = req.params.id;
        if (!_id) {
            return res.send(JSON.stringify({
                status: 400,
                message: `Id required`
            }))
        }

        const user = await User.findById(_id)
        if (!user) {
            return res.send(JSON.stringify({
                status: 400,
                message: `Id invalid`
            }))
        }

        res.send(JSON.stringify({
            status: 200,
            data: user
        }))
    },
    onDeleteUserById: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const _id = req.params.id;
        if (!_id) {
            return res.send(JSON.stringify({
                status: 400,
                message: `Id required`
            }))
        }

        const user = await User.findById(_id)
        if (!user) {
            return res.send(JSON.stringify({
                status: 400,
                message: `Id invalid`
            }))
        }

        await User.findByIdAndDelete(_id)

        res.send(JSON.stringify({
            status: 200,
            message: `Success delete user with id ${_id}`
        }))
    },
}