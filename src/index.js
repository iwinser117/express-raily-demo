// const path = require("node:path");
const mongoose = require('mongoose')
const routes = require('./routes/routes')
const express = require('express')
const rateLimit = require('express-rate-limit');
const port = process.env.PORT || 3000
require('dotenv').config()

const bodyParser = require('body-parser')
const app = express()

const cors = require('cors')
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 50,
	legacyHeaders: false, 
  message: 'Demasiadas solicitudes desde esta IP, intenta nuevamente en 15 minutos.',
})
app.use(limiter)
app.use(express.json())
app.use(bodyParser.json())

app.use('/api', routes)

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('conectado a mongodb'))
  .catch((e) => {
    console.error('error de conexión a MongoDB:', e.message)
    process.exit(1)
  })

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err)
  
  const status = err.status || 500
  const message = err.message || 'Error interno del servidor'
  
  res.status(status).json({
    success: false,
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  })
})

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Ruta no encontrada',
    timestamp: new Date().toISOString()
  })
})

const server = app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`)
})

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error)
  process.exit(1)
})
