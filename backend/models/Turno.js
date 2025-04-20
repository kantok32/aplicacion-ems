const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
  // Aplicable a un usuario específico o a un rol completo
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    index: true,
    // Validación personalizada para asegurar exclusividad con rol
    validate: {
      validator: function(v) {
        // 'this' se refiere al documento actual
        // Retorna true si usuario tiene valor Y rol NO tiene valor, O si usuario NO tiene valor
        return (v && !this.rol) || !v;
      },
      message: 'No se puede asignar un turno a un usuario y a un rol simultáneamente.'
    }
  },
  rol: {
    type: String,
    enum: ['EMS', 'MÉDICO', 'DIRECTOR'],
    index: true,
    // Validación personalizada para asegurar exclusividad con usuario
     validate: {
      validator: function(v) {
        return (v && !this.usuario) || !v;
      },
      message: 'No se puede asignar un turno a un rol y a un usuario simultáneamente.'
    }
  },
  nombreTurno: {
    type: String,
    trim: true,
    maxlength: 100
  },
  horaEntrada: {
    type: String, // Guardar como HH:MM (ej: "08:00")
    required: [true, 'La hora de entrada es obligatoria'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)']
  },
  horaSalida: {
    type: String, // Guardar como HH:MM (ej: "17:30")
    required: [true, 'La hora de salida es obligatoria'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)']
  },
  diasSemana: {
    // Array de números: 0 (Domingo) a 6 (Sábado)
    type: [Number],
    required: [true, 'Se deben especificar los días de la semana'],
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0 && arr.every(d => d >= 0 && d <= 6);
      },
      message: 'Días de la semana inválidos (deben ser números entre 0 y 6)'
    }
  },
  requiereAlmuerzo: {
    type: Boolean,
    default: false
  },
  toleranciaMinutos: {
    type: Number,
    default: 0,
    min: 0
  },
}, {
  timestamps: true,
  collection: 'turnos', // Nombre explícito
  validateBeforeSave: true // Asegurar que las validaciones personalizadas se ejecuten
});

// Validación a nivel de Schema para asegurar que al menos uno (usuario o rol) esté definido
turnoSchema.pre('validate', function(next) {
  if (!this.usuario && !this.rol) {
    next(new Error('Se debe especificar un usuario o un rol para el turno.'));
  } else {
    next();
  }
});


const Turno = mongoose.model('Turno', turnoSchema);

module.exports = Turno; 