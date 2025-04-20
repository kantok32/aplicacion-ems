const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) { // Si usas cookies
  //   token = req.cookies.token;
  // }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Obtener usuario del token Y verificar si está activo
    // Seleccionar explícitamente los campos necesarios, excluyendo password
    const currentUser = await User.findById(decoded.id).select('+activo'); // Incluir activo

    if (!currentUser) {
      return res.status(401).json({ message: 'Usuario perteneciente a este token ya no existe' });
    }

    // Verificar si el usuario está activo
    if (!currentUser.activo) {
        return res.status(403).json({ message: 'Usuario inactivo. Contacte al administrador.'});
    }

    // Adjuntar usuario al request (sin la contraseña ni el estado activo si no se necesita después)
    req.user = await User.findById(decoded.id).select('-password'); // Consulta de nuevo sin campos sensibles

    // Actualizar último login (opcional, podría hacerse en el login controller)
    // currentUser.ultimoLogin = Date.now();
    // await currentUser.save({ validateBeforeSave: false }); // Evitar validaciones en este save

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
       return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(401).json({ message: 'No autorizado' });
  }
};

// Middleware para restringir acceso basado en roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      // Seguridad extra: asegurar que protect corrió antes
      return res.status(401).json({ message: 'Usuario no autenticado para verificación de rol.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
    }
    next();
  };
}; 