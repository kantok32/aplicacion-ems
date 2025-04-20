// controllers/asistenciaController.js
const Asistencia = require('../models/Asistencia');
const Usuario = require('../models/Usuario'); // Puede ser necesario para validaciones
const Turno = require('../models/Turno');   // Necesario para validaciones y resúmenes
const mongoose = require('mongoose');

// Helper para obtener inicio y fin de un mes YYYY-MM
const getMonthDateRange = (yearMonth) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1)); // Mes es 0-indexado
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // Último día del mes anterior
    return { startDate, endDate };
};

// @desc    Listar asistencias de un usuario por mes
// @route   GET /api/asistencias?usuarioId=...&mes=YYYY-MM
// @access  Private (Director o propio usuario)
exports.getAsistencias = async (req, res) => {
    const { usuarioId, mes } = req.query;

    // Validar parámetros
    if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
        return res.status(400).json({ message: 'ID de usuario inválido o faltante.' });
    }
    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
         return res.status(400).json({ message: 'Formato de mes inválido (YYYY-MM).' });
    }

    // Autorización: Director puede ver cualquiera, otros solo el suyo
    if (req.user.role !== 'DIRECTOR' && req.user.id !== usuarioId) {
        return res.status(403).json({ message: 'No autorizado para ver esta asistencia.' });
    }

    try {
        const { startDate, endDate } = getMonthDateRange(mes);

        const asistencias = await Asistencia.find({
            usuario: usuarioId,
            fecha: { $gte: startDate, $lte: endDate }
        })
        .populate('usuario', 'nombre rol') // Opcional: traer datos del usuario
        .sort({ fecha: 1 }); // Ordenar por fecha

        res.json(asistencias);

    } catch (err) {
        console.error('Error getAsistencias:', err.message);
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Marcar entrada o salida
// @route   POST /api/asistencias/marcar
// @access  Private (Propio usuario o Director)
exports.marcarAsistencia = async (req, res) => {
    // Quién marca? El usuario autenticado por defecto.
    // Un director podría marcar por otro usuario si se pasa usuarioId en body?
    // Simplificación: Solo el usuario autenticado marca su asistencia.
    const usuarioId = req.user.id;
    const hoy = new Date();
    const fechaHoy = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));

    try {
        let asistencia = await Asistencia.findOne({
            usuario: usuarioId,
            fecha: fechaHoy
        });

        let tipoMarcaje;

        if (!asistencia) {
            // Primera marca del día -> Entrada
            tipoMarcaje = 'entrada';
            asistencia = new Asistencia({
                usuario: usuarioId,
                fecha: fechaHoy,
                sesiones: [],
                estado: 'Ausente' // El método marcar lo cambiará
            });

        } else {
            // Ya existe registro hoy, determinar si es entrada o salida
            const ultimaSesion = asistencia.sesiones[asistencia.sesiones.length - 1];
            if (ultimaSesion && !ultimaSesion.salida) {
                tipoMarcaje = 'salida'; // Tiene entrada abierta -> marcar salida
            } else {
                tipoMarcaje = 'entrada'; // Tiene sesiones cerradas o ninguna -> marcar entrada
            }
        }

        // Usar el método del modelo para actualizar sesiones y estado
        asistencia.marcar(tipoMarcaje); // Esto puede lanzar errores de validación

        // TODO: Integrar lógica de Turno para validar hora y calcular atrasos aquí.
        // 1. Buscar Turno del usuario para hoy.
        // 2. Si es entrada, comparar con turno.horaEntrada + turno.tolerancia.
        // 3. Actualizar estado si es necesario ('Atrasado').

        await asistencia.save();
        res.status(200).json(asistencia);

    } catch (err) {
        console.error('Error marcarAsistencia:', err.message);
         if (err.message.includes('Ya se ha registrado') || err.message.includes('Debe registrar')) {
             return res.status(400).json({ message: err.message });
         }
        res.status(500).send('Error del Servidor');
    }
};

// @desc    Obtener resumen mensual de asistencia
// @route   GET /api/asistencias/resumen/:usuarioId?mes=YYYY-MM
// @access  Private (Director o propio usuario)
exports.getResumenAsistencia = async (req, res) => {
    const { usuarioId } = req.params;
    const { mes } = req.query;

    // Validaciones
    if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
        return res.status(400).json({ message: 'ID de usuario inválido.' });
    }
    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
         return res.status(400).json({ message: 'Formato de mes inválido (YYYY-MM).' });
    }
    if (req.user.role !== 'DIRECTOR' && req.user.id !== usuarioId) {
        return res.status(403).json({ message: 'No autorizado para ver este resumen.' });
    }

    try {
        const { startDate, endDate } = getMonthDateRange(mes);

        // 1. Obtener asistencias del mes
        const asistencias = await Asistencia.find({
            usuario: usuarioId,
            fecha: { $gte: startDate, $lte: endDate }
        });

        // 2. Obtener el turno del usuario (o el de su rol)
        // Esta lógica puede ser compleja si hay turnos por rol y específicos
        let turno = await Turno.findOne({ usuario: usuarioId });
        if (!turno) {
            const usuarioDoc = await Usuario.findById(usuarioId).select('rol');
            if (usuarioDoc) {
                turno = await Turno.findOne({ rol: usuarioDoc.rol });
            }
        }
        // Si no hay turno asignado, no se pueden calcular ausencias/atrasos
        if (!turno) {
            // Devolver solo horas trabajadas
            const totalHorasMes = asistencias.reduce((sum, dia) => sum + dia.totalHoras, 0);
             return res.json({ 
                mes: mes, 
                totalHoras: Math.round(totalHorasMes * 100) / 100, 
                diasTrabajados: asistencias.length,
                mensaje: 'No se encontró turno asignado para calcular ausencias/atrasos.' 
            });
        }

        // 3. Calcular resumen
        let totalHorasMes = 0;
        let diasTrabajados = 0;
        let diasAusente = 0;
        let diasAtraso = 0;
        let diasIncompletos = 0; // Marcó entrada pero no salida al final del día

        const asistenciasMap = new Map();
        asistencias.forEach(a => {
            asistenciasMap.set(a.fecha.toISOString().split('T')[0], a);
            totalHorasMes += a.totalHoras;
            diasTrabajados++;
            if(a.estado === 'CheckedIn') diasIncompletos++; // Si terminó el día como CheckedIn
        });

        // Iterar días del mes para verificar ausencias y atrasos según turno
        const [year, monthNum] = mes.split('-').map(Number);
        const diasEnMes = new Date(year, monthNum, 0).getDate();

        for (let i = 1; i <= diasEnMes; i++) {
            const fechaActual = new Date(Date.UTC(year, monthNum - 1, i));
            const diaSemana = fechaActual.getUTCDay(); // 0 = Domingo, 6 = Sábado

            // Es día laboral según turno?
            if (turno.diasSemana.includes(diaSemana)) {
                const fechaStr = fechaActual.toISOString().split('T')[0];
                const asistenciaDia = asistenciasMap.get(fechaStr);

                if (!asistenciaDia) {
                    diasAusente++;
                } else {
                    // Verificar Atraso (comparar primera entrada con hora de turno + tolerancia)
                    if (asistenciaDia.sesiones.length > 0) {
                        const primeraEntrada = asistenciaDia.sesiones[0].entrada;
                        const [hEntrada, mEntrada] = turno.horaEntrada.split(':').map(Number);
                        const horaLimiteEntrada = new Date(fechaActual);
                        horaLimiteEntrada.setUTCHours(hEntrada, mEntrada + turno.toleranciaMinutos, 0, 0);

                        if (primeraEntrada > horaLimiteEntrada) {
                            diasAtraso++;
                        }
                    }
                }
            }
        }

        res.json({
            mes: mes,
            totalHoras: Math.round(totalHorasMes * 100) / 100,
            diasTrabajados,
            diasAusente,
            diasAtraso,
            diasIncompletos
            // Puedes añadir más detalles si es necesario
        });

    } catch (err) {
        console.error('Error getResumenAsistencia:', err.message);
        res.status(500).send('Error del Servidor');
    }
}; 