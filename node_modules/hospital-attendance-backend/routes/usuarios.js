// routes/usuarios.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
    getUsuarios,
    getUsuarioById,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarioController');

// Todas las rutas de usuarios requieren autenticación
router.use(protect);

// Rutas específicas
router.route('/')
    .get(restrictTo('DIRECTOR'), getUsuarios)       // Solo Director puede listar todos
    .post(restrictTo('DIRECTOR'), crearUsuario);     // Solo Director puede crear

router.route('/:id')
    .get(getUsuarioById)                             // Director o propio usuario (validación en controller)
    .patch(restrictTo('DIRECTOR'), actualizarUsuario) // Solo Director puede actualizar
    .delete(restrictTo('DIRECTOR'), eliminarUsuario); // Solo Director puede desactivar (eliminar)

module.exports = router; 