// Lógica para autenticación
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
// bcrypt es necesario en el modelo User, no aquí directamente para hash

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // 2. Crear nuevo usuario (la contraseña se hashea automáticamente por el hook pre-save del modelo)
    user = new User({
      name,
      email,
      password,
      role,
    });

    // 3. Guardar usuario en la base de datos
    await user.save(); // Mongoose creará la colección 'usuarios' si no existe

    // 4. Crear payload para JWT
    const payload = {
      id: user.id, // Mongoose usa 'id' como alias virtual para '_id'
      role: user.role
    };

    // 5. Firmar el token JWT
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }, // Usar valor de .env o default
      (err, token) => {
        if (err) throw err;
        // 6. Enviar respuesta con el token y datos básicos del usuario
        res.status(201).json({ // 201 Created
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );

  } catch (error) {
    console.error('Error en el registro:', error.message);
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).send('Error del servidor');
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica de entrada
  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor provea email y contraseña' });
  }

  try {
    // 1. Buscar usuario por email y seleccionar la contraseña para comparar
    const user = await User.findOne({ email }).select('+password');

    // 2. Verificar si el usuario existe y la contraseña es correcta
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Verificar si el usuario está activo
    if (!user.activo) {
        return res.status(403).json({ message: 'Usuario inactivo. Contacte al administrador.'});
    }

    // 4. Crear payload para JWT
    const payload = {
      id: user.id,
      role: user.role
    };

    // 5. Firmar el token JWT
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' },
      (err, token) => {
        if (err) throw err;

        // Opcional: Actualizar ultimoLogin
        user.ultimoLogin = Date.now();
        // Guardar sin correr validaciones que podrían fallar (como require password)
        user.save({ validateBeforeSave: false });

        // 6. Enviar respuesta con el token y datos básicos del usuario
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );

  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Obtener datos del usuario autenticado
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  // El middleware 'protect' ya adjuntó el usuario (sin password) a req.user
  // Simplemente lo devolvemos
  // Podríamos volver a buscarlo si quisiéramos datos más frescos, pero no suele ser necesario.
  res.status(200).json({ user: req.user });
}; 