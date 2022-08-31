module.exports = {
    db: {
        url: process.env.DB_URL,
        name: process.env.DB_NAME,
    },
    jwt_token: process.env.JWT_SECRET_KEY
}

