const Turno = require('../models/Turno');
const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');

// @desc    Obtener turnos (filtrado por usuario o rol)
// @route   GET /api/turnos?usuarioId=... o ?rol=...
// @access  Private (Director)
exports.getTurnos = async (req, res) => {
    try {
        const query = {};
        if (req.query.usuarioId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.usuarioId)){
                 return res.status(400).json({ message: 'ID de usuario inválido' });
            }
            query.usuario = req.query.usuarioId;
        }
        if (req.query.rol) {
            // Validar rol si es necesario
             if (!['EMS', 'MÉDICO', 'DIRECTOR'].includes(req.query.rol)) {
                return res.status(400).json({ message: 'Rol inválido' });
            }
            query.rol = req.query.rol;
        }
        // Si no hay filtro, devuelve todos
        const turnos = await Turno.find(query).populate('usuario', 'nombre email');
        res.json(turnos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Crear un nuevo turno
// @route   POST /api/turnos
// @access  Private (Director)
exports.crearTurno = async (req, res) => {
    // Extraer campos del body
    const { usuario, rol, nombreTurno, horaEntrada, horaSalida, diasSemana, requiereAlmuerzo, toleranciaMinutos } = req.body;

    try {
        // La validación de usuario vs rol y la existencia de uno de ellos
        // se maneja en el pre-save y validaciones del modelo Turno
        const nuevoTurno = new Turno({
            usuario,
            rol,
            nombreTurno,
            horaEntrada,
            horaSalida,
            diasSemana,
            requiereAlmuerzo,
            toleranciaMinutos
        });

        await nuevoTurno.save();
        res.status(201).json(nuevoTurno);

    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            // Incluir el mensaje de la validación pre-save si existe
            if (err.message.includes('Se debe especificar un usuario o un rol')) {
                 messages.push(err.message);
            }
            return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Actualizar un turno
// @route   PATCH /api/turnos/:id
// @access  Private (Director)
exports.actualizarTurno = async (req, res) => {
    try {
        const turno = await Turno.findById(req.params.id);
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        // Actualizar campos permitidos
        const camposActualizar = req.body;
        // Evitar cambiar usuario/rol directamente? Depende de la lógica de negocio.
        // Por ahora, permitirlo, pero con validación.

        // Aplicar actualizaciones y correr validadores
        Object.assign(turno, camposActualizar);

        await turno.save(); // Esto correrá las validaciones del modelo

        res.json(turno);

    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            if (err.message.includes('Se debe especificar un usuario o un rol')) {
                 messages.push(err.message);
            }
            return res.status(400).json({ message: messages.join('. ') });
        }
         if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Eliminar un turno
// @route   DELETE /api/turnos/:id
// @access  Private (Director)
exports.eliminarTurno = async (req, res) => {
     try {
        const turno = await Turno.findByIdAndDelete(req.params.id);

        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        res.json({ message: 'Turno eliminado correctamente' });

    } catch (err) {
        console.error(err.message);
         if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        res.status(500).send('Error del Servidor');
    }
}; 