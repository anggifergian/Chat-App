const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const WebSockets = require('./utils/WebSocket');

// Loads environment
require('dotenv').config()

const PORT = process.env.PORT || 9000;
const app = express();

// Enable CORS
app.use(cors())

// Allow JSON request
app.use(bodyParser.json())

// Allow x-www-form-urlencoded request
app.use(bodyParser.urlencoded({ extended: true }))

// Create Mongo connection
require('./config/mongo')

// Main route v1
app.use('/api/v1', require('./routes'));

// Create Server
const server = require('http').createServer(app);

// Create Socket connection
const io = require('socket.io')(server)
io.on('connection', WebSockets.connection)

// Start server
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))