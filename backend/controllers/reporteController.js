const Asistencia = require('../models/Asistencia');
const Usuario = require('../models/Usuario');

// @desc    Obtener asistencia de todos por día
// @route   GET /api/reportes/por-dia?fecha=YYYY-MM-DD
// @access  Private (Director)
exports.getReportePorDia = async (req, res) => {
    const { fecha } = req.query;
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
         return res.status(400).json({ message: 'Formato de fecha inválido (YYYY-MM-DD).' });
    }

    try {
        // Fecha inicio y fin del día en UTC
        const startDate = new Date(Date.UTC(fecha.split('-')[0], fecha.split('-')[1] - 1, fecha.split('-')[2]));
        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 1);
        endDate.setUTCMilliseconds(endDate.getUTCMilliseconds() - 1);

        const asistencias = await Asistencia.find({
            fecha: { $gte: startDate, $lte: endDate }
        })
        .populate('usuario', 'nombre email rol') // Traer datos del usuario
        .sort('usuario.nombre'); // Ordenar por nombre de usuario

        res.json(asistencias);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Obtener usuarios con marcaje incompleto hoy
// @route   GET /api/reportes/incompletos
// @access  Private (Director)
exports.getReporteIncompletos = async (req, res) => {
     try {
        const hoy = new Date();
        const fechaHoy = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));

        // Buscar asistencias de hoy que estén en estado 'CheckedIn'
        // o cuya última sesión no tenga salida
        const asistenciasIncompletas = await Asistencia.find({
            fecha: fechaHoy,
            // $or: [
            //     { estado: 'CheckedIn' },
            //     { 'sesiones.salida': { $exists: false } } // Chequear si la última salida no existe
            // ]
            // Simplificación: Chequear si el estado es CheckedIn (implica última sesión sin salida)
             estado: 'CheckedIn'
        })
        .populate('usuario', 'nombre email rol');

        res.json(asistenciasIncompletas);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
}; 