const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Por favor usa un email válido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false, // No incluir por defecto en las consultas
  },
  rol: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    enum: {
      values: ['EMS', 'MÉDICO', 'DIRECTOR'],
      message: 'Rol inválido. Valores permitidos: EMS, MÉDICO, DIRECTOR',
    },
  },
  activo: {
    type: Boolean,
    default: true,
  },
  ultimoLogin: {
    type: Date,
  },
  // creadoEn será manejado por timestamps
}, {
  timestamps: true, // Añade createdAt (creadoEn) y updatedAt automáticamente
  collection: 'usuarios' // Especificar nombre explícito de la colección
});

// Middleware: Encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  // Generar salt y hashear
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método de instancia: Comparar contraseñas
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  // 'this.password' no está disponible si se usó .select('-password') ANTES de llamar a este método
  // Por eso, en login, debemos seleccionar explícitamente la contraseña.
  return await bcrypt.compare(candidatePassword, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario; 