const jwt = require('jsonwebtoken')

const { User } = require('../models/User')
const { jwt_token } = require('../config')

module.exports.encode = async (req, res, next) => {
    try {
        const { userId } = req.params
        
        const user = await User.findById(userId)
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            
            return res.send(JSON.stringify({
                status: 400,
                message: `Id invalid`
            }))
        }

        const payload = {
            userId: user.id,
            userType: user.type
        }

        const authToken = jwt.sign(payload, jwt_token);

        req.authToken = authToken;

        next();
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        
        res.send(JSON.stringify({
            status: 400,
            message: error.error
        }))
    }
}

module.exports.decode = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        res.setHeader('Content-Type', 'application/json');

        return res.send(JSON.stringify({
            status: 400,
            message: `No access token provided`
        })) 
    }

    const accessToken = authHeader.split(' ')[1]

    try {
        const decode = jwt.decode(accessToken, jwt_token)

        req.userId = decode.userId
        req.userType = decode.userType

        next();
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');

        res.send(JSON.stringify({
            status: 400,
            message: error.error
        }))
    }
}
