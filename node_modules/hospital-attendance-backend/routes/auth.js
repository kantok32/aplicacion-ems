// Rutas de autenticación (login, register)
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // Solo protect aquí

// Rutas Públicas
router.post('/register', register); // El registro podría ser público o solo admin
router.post('/login', login);

// Rutas Privadas
router.get('/me', protect, getMe); // Requiere token válido

module.exports = router; 