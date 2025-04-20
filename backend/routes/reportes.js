// routes/reportes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
    getReportePorDia,
    getReporteIncompletos
} = require('../controllers/reporteController');

// Todas las rutas de reportes requieren autenticación y rol de Director
router.use(protect);
router.use(restrictTo('DIRECTOR'));

// Rutas
router.get('/por-dia', getReportePorDia);
router.get('/incompletos', getReporteIncompletos);

module.exports = router; 