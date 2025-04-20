const mongoose = require('mongoose');

const sesionSchema = new mongoose.Schema({
  entrada: {
    type: Date,
    required: true,
  },
  salida: {
    type: Date,
  },
}, { _id: false }); // No crear IDs para subdocumentos de sesión

const asistenciaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    index: true, // Indexar para búsquedas rápidas por usuario
  },
  fecha: {
    type: Date,
    required: true,
    index: true, // Indexar para búsquedas rápidas por fecha
    // Asegurarse de guardar solo la fecha (inicio del día)
    set: (val) => {
      if (val instanceof Date) {
        return new Date(val.getFullYear(), val.getMonth(), val.getDate());
      }
      return val; // Mantener si ya es un valor adecuado
    }
  },
  sesiones: {
    type: [sesionSchema],
    default: [],
  },
  totalHoras: {
    type: Number,
    default: 0,
    min: 0
  },
  estado: {
    // 'Presente', 'Ausente', 'Atrasado', 'Incompleto' o 'CheckedIn', 'CheckedOut'
    // Se recomienda 'CheckedIn' / 'CheckedOut' para reflejar el último evento
    type: String,
    enum: ['CheckedIn', 'CheckedOut', 'Ausente'], // Ausente puede ser estado inicial o inferido
    default: 'Ausente' // O manejarlo en la lógica al crear
  },
  // Otros campos como observaciones del día podrían ir aquí
}, {
  timestamps: true,
  collection: 'asistencias' // Especificar nombre explícito
});

// Método para calcular horas de una sesión (en segundos)
function calcularDuracionSesion(entrada, salida) {
  if (!entrada || !salida) return 0;
  return (salida.getTime() - entrada.getTime()) / 1000; // Duración en segundos
}

// Middleware o método para recalcular totalHoras antes de guardar (opcional)
// asistenciaSchema.pre('save', function(next) {
//   this.totalHoras = this.sesiones.reduce((total, sesion) => {
//     return total + calcularDuracionSesion(sesion.entrada, sesion.salida);
//   }, 0) / 3600; // Convertir segundos a horas
//   next();
// });

// Método de instancia para añadir/actualizar sesión y recalcular horas
asistenciaSchema.methods.marcar = function(tipo) {
  const ahora = new Date();
  let duracionUltimaSesion = 0;

  if (tipo === 'entrada') {
    // Validar: No marcar entrada si ya está 'CheckedIn'
    if (this.estado === 'CheckedIn') {
      throw new Error('Ya se ha registrado una entrada sin su correspondiente salida.');
    }
    this.sesiones.push({ entrada: ahora });
    this.estado = 'CheckedIn';

  } else if (tipo === 'salida') {
    // Validar: No marcar salida si no está 'CheckedIn'
    if (this.estado !== 'CheckedIn') {
      throw new Error('Debe registrar una entrada antes de registrar una salida.');
    }
    const ultimaSesion = this.sesiones[this.sesiones.length - 1];
    if (!ultimaSesion || ultimaSesion.salida) {
       throw new Error('Error lógico: No se encontró una entrada abierta para cerrar.'); // Seguridad extra
    }
    ultimaSesion.salida = ahora;
    this.estado = 'CheckedOut';
    duracionUltimaSesion = calcularDuracionSesion(ultimaSesion.entrada, ultimaSesion.salida);

  } else {
     throw new Error('Tipo de marcaje inválido.');
  }

  // Recalcular totalHoras (sumando solo la última sesión si es salida)
  // Podría recalcularse todo el array, pero sumar incrementalmente es más eficiente
  if (tipo === 'salida'){
      this.totalHoras = (this.totalHoras * 3600 + duracionUltimaSesion) / 3600; // Mantener en horas
      // Redondear a 2 decimales si se desea
      this.totalHoras = Math.round(this.totalHoras * 100) / 100;
  }

  // No es necesario llamar a save() aquí, se llamará después en el controlador
};


const Asistencia = mongoose.model('Asistencia', asistenciaSchema);

module.exports = Asistencia; 