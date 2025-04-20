const Usuario = require('../models/Usuario');

// @desc    Obtener todos los usuarios (con filtro opcional por rol)
// @route   GET /api/usuarios
// @access  Private (Director)
exports.getUsuarios = async (req, res) => {
    try {
        const query = {};
        if (req.query.rol) {
            query.rol = req.query.rol;
        }
        // Excluir contraseñas y usuarios inactivos por defecto (opcional)
        // query.activo = true;
        const usuarios = await Usuario.find(query).select('-password');
        res.json(usuarios);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/usuarios/:id
// @access  Private (Director o propio usuario)
exports.getUsuarioById = async (req, res) => {
    try {
        // Validar si el ID es válido antes de buscar (opcional)
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }
        // Verificar si el usuario autenticado es el mismo que se solicita o es Director
        if (req.user.role !== 'DIRECTOR' && req.user.id !== req.params.id) {
             return res.status(403).json({ message: 'No autorizado para ver este usuario' });
        }

        const usuario = await Usuario.findById(req.params.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Crear un nuevo usuario
// @route   POST /api/usuarios
// @access  Private (Director)
exports.crearUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        usuario = new Usuario({ nombre, email, password, rol });
        await usuario.save();

        // Devolver usuario creado (sin contraseña)
        const usuarioCreado = await Usuario.findById(usuario.id).select('-password');
        res.status(201).json(usuarioCreado);

    } catch (err) {
        console.error(err.message);
         if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Actualizar un usuario (incluye activar/desactivar)
// @route   PATCH /api/usuarios/:id
// @access  Private (Director)
exports.actualizarUsuario = async (req, res) => {
    const { nombre, email, rol, activo } = req.body;
    const camposActualizar = {};
    if (nombre) camposActualizar.nombre = nombre;
    if (email) camposActualizar.email = email;
    if (rol) camposActualizar.rol = rol;
    // Permitir cambiar explícitamente el estado activo
    if (activo !== undefined) camposActualizar.activo = activo;

    // ¡No permitir actualizar contraseña aquí! Crear endpoint específico si es necesario.

    try {
        let usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Validar si se intenta cambiar email a uno ya existente
        if (email && email !== usuario.email) {
            const existeEmail = await Usuario.findOne({ email: email });
            if (existeEmail) {
                 return res.status(400).json({ message: 'El nuevo correo electrónico ya está en uso' });
            }
        }

        usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { $set: camposActualizar },
            { new: true, runValidators: true } // Devuelve el doc actualizado y corre validaciones
        ).select('-password');

        res.json(usuario);

    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
         if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Desactivar un usuario (Soft Delete)
// @route   DELETE /api/usuarios/:id
// @access  Private (Director)
exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // No eliminar, solo desactivar
        usuario.activo = false;
        await usuario.save();

        res.json({ message: 'Usuario desactivado correctamente' });

    } catch (err) {
        console.error(err.message);
         if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(500).send('Error del Servidor');
    }
}; 