const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  observations: {
    type: String
  },
  // Otros campos como la fecha explícita si se necesita indexar por día
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0) // Guardar solo la fecha
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas comunes
attendanceSchema.index({ user: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance; 