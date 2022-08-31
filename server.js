const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

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
app.use('/api/v1', require('./routes'))

// Start server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))