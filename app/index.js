// const path = require("node:path");
const mongoose = require('mongoose')
const routes = require('./routes/routes')
const express = require('express')
const port = process.env.PORT || 3000
require('dotenv').config()

const bodyParser = require('body-parser')
const app = express()

const cors = require('cors')
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(bodyParser.json())

app.use('/api', routes)

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('conectado a mongodb'))
  .catch((e) => console.log('error de conexión', e))
app.listen(port, () => {
  console.log('escuchando efectivamente' + port)
})
