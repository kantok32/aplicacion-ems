// routes/turnos.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
    getTurnos,
    crearTurno,
    actualizarTurno,
    eliminarTurno
} = require('../controllers/turnoController');

// Todas las rutas de turnos requieren autenticación y rol de Director
router.use(protect);
router.use(restrictTo('DIRECTOR'));

// Rutas CRUD
router.route('/')
    .get(getTurnos)
    .post(crearTurno);

router.route('/:id')
    // Podríamos añadir un GET /:id si se necesita obtener un turno específico por su ID
    // .get(getTurnoById) 
    .patch(actualizarTurno)
    .delete(eliminarTurno);

module.exports = router; 