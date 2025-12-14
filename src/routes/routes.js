const express = require('express')
const router = express.Router()
const tareaSchema = require('../models/tareasModel')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())

// Función auxiliar para validar ID de MongoDB
const isValidMongoId = (id) => mongoose.Types.ObjectId.isValid(id)

// obteniendo las tareas
router.get('/tareas', async (req, res, next) => {
  try {
    const data = await tareaSchema.find()
    res.status(200).json({
      success: true,
      data: data,
      count: data.length
    })
  } catch (error) {
    console.error('Error al obtener tareas:', error.message)
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message
    })
  }
})
// obtener una sola tarea por id
router.get('/tareas/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    
    if (!isValidMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      })
    }
    
    const data = await tareaSchema.findById(id)
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      })
    }
    
    res.status(200).json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('Error al obtener tarea:', error.message)
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    })
  }
})
// eliminar tareas , se usa el id.
router.delete("/tareas/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    
    if (!isValidMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      })
    }
    
    const deletedTarea = await tareaSchema.deleteOne({ _id: id })
    
    if (deletedTarea.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Tarea eliminada correctamente',
      data: deletedTarea
    })
  } catch (error) {
    console.error('Error al eliminar tarea:', error.message)
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message
    })
  }
})


// creando una nueva tarea
router.post('/tareas', async (req, res, next) => {
  try {
    const { name, descripcion, statusTarea } = req.body
    
    // Validación de campos requeridos
    if (!name || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Los campos name y descripcion son requeridos'
      })
    }
    
    // Validación de longitud mínima
    if (name.length < 3 || descripcion.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Name y descripcion deben tener al menos 3 caracteres'
      })
    }
    
    const tareas = new tareaSchema({ name, descripcion, statusTarea })
    const data = await tareas.save()
    
    res.status(201).json({
      success: true,
      message: 'Tarea creada correctamente',
      data: data
    })
  } catch (error) {
    console.error('Error al crear tarea:', error.message)
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    })
  }
})

// actualizar tarea
router.patch('/tareas/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, descripcion } = req.body
    
    if (!isValidMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      })
    }
    
    if (!name && !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar (name o descripcion)'
      })
    }
    
    if ((name && name.length < 3) || (descripcion && descripcion.length < 3)) {
      return res.status(400).json({
        success: false,
        message: 'Name y descripcion deben tener al menos 3 caracteres'
      })
    }
    
    const updateData = {}
    if (name) updateData.name = name
    if (descripcion) updateData.descripcion = descripcion
    
    const data = await tareaSchema.updateOne({ _id: id }, { $set: updateData })
    
    if (data.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Tarea actualizada correctamente',
      data: data
    })
  } catch (error) {
    console.error('Error al actualizar tarea:', error.message)
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    })
  }
})
// actualizar estado de tarea
router.patch('/tareas/:id/estado', async (req, res, next) => {
  try {
    const { id } = req.params
    const { statusTarea } = req.body
    
    if (!isValidMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de tarea inválido'
      })
    }
    
    if (statusTarea === undefined || statusTarea === null) {
      return res.status(400).json({
        success: false,
        message: 'El campo statusTarea es requerido'
      })
    }
    
    if (typeof statusTarea !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'statusTarea debe ser un valor booleano (true o false)'
      })
    }
    
    const data = await tareaSchema.updateOne({ _id: id }, { $set: { statusTarea } })
    
    if (data.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Estado de tarea actualizado correctamente',
      data: data
    })
  } catch (error) {
    console.error('Error al actualizar estado de tarea:', error.message)
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de la tarea',
      error: error.message
    })
  }
})

module.exports = router
