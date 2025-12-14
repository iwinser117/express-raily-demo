const mongoose = require('mongoose')

// Crear esquema con validaciones mejoradas
const tareaSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la tarea es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    minlength: [3, 'La descripción debe tener al menos 3 caracteres'],
    maxlength: [200, 'La descripción no puede exceder 200 caracteres'],
    trim: true
  },
  statusTarea: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

module.exports = mongoose.model('Tarea', tareaSchema)
