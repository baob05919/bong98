const express = require('express')
const app = express.Router()

const webRoute = require('../../routers/webRouter')



app.use('/api', webRoute)
module.exports = app
