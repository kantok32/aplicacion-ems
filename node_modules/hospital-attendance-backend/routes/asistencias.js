// routes/asistencias.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
    getAsistencias,
    marcarAsistencia,
    getResumenAsistencia
} = require('../controllers/asistenciaController');

// Todas las rutas de asistencia requieren autenticación
router.use(protect);

// Rutas específicas
router.get('/', getAsistencias);                 // Propio usuario o Director (valida controller)
router.post('/marcar', marcarAsistencia);          // Propio usuario (valida controller)
router.get('/resumen/:usuarioId', getResumenAsistencia); // Propio usuario o Director (valida controller)

module.exports = router; 