const mongoose = require('mongoose')
const config = require('./index')

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`

mongoose.connect(CONNECTION_URL)

const db = mongoose.connection

db.on('error', error => {
    console.log('Mongo connection has an error', error)
})

db.on('open', () => {
    console.log('Connected to database...')
})
