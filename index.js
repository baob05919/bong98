const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const process = require('node:process')
const configFile = require('./app/config/createConfig')

const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

server.timeout = 0;


let isValidLicense = { isValid: true, message: 'Valid license' }

const mainRoute = require('./app/middleware/api/route')

app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));



app.use((req, res, next) => {
  if (!isValidLicense.isValid) {
    return res.status(401).send({ message: isValidLicense.message })
  }
  next()
})
configFile.createConfig()
app.use((req, res, next) => {
  next()
})
app.use(mainRoute)
const port = process.env.PORT
console.log(`Server is running on http://localhost:${port}`);
server.listen(port, '0.0.0.0')
