// Loads environment
require('dotenv').config();

// Create Mongo connection
require('./config/mongo')

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const { createServer } = require('http')
const { Server } = require('socket.io')

const PORT = process.env.PORT || 9000;
const app = express();

// Enable CORS
app.use(cors())

// Allow JSON request
app.use(bodyParser.json())

// Allow x-www-form-urlencoded request
app.use(bodyParser.urlencoded({ extended: true }))

// Main route v1
app.use('/api/v1', require('./routes'));

// Create Server
const server = createServer(app);

// Create Socket.io connection
const io = new Server(server)
io.on('connection', (socket) => {
    console.log('connecting...', socket)
})

// Start server
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))