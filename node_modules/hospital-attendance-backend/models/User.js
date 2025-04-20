const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    // Validación de email simple (se puede mejorar)
    match: [/\S+@\S+\.\S+/, 'Por favor usa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6,
    select: false // No incluir por defecto en las consultas
  },
  role: {
    type: String,
    enum: ['EMS', 'Médico', 'Director'],
    required: [true, 'El rol es obligatorio']
  },
  // Otros campos si son necesarios
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  // Generar salt y hashear
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User; 