module.exports = {
    login: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        return res.send({
            status: 200,
            data: {
                token: req.authToken
            }
        })
    }
}