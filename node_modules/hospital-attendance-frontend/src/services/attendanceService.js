// Servicios relacionados con la asistencia
import api from './api';

const attendanceService = {
  checkIn: async (data) => {
    // const response = await api.post('/attendance/check-in', data);
    // return response.data;
    // Placeholder:
    console.log('Llamando a checkIn con:', data);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: 'Entrada registrada (placeholder)' };
  },

  checkOut: async (data) => {
    // const response = await api.post('/attendance/check-out', data);
    // return response.data;
     // Placeholder:
    console.log('Llamando a checkOut con:', data);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: 'Salida registrada (placeholder)' };
  },

  getAttendanceHistory: async () => {
    // const response = await api.get('/attendance/'); // Historial del usuario logueado
    // return response.data;
    // Placeholder:
    console.log('Obteniendo historial de asistencia propio');
    await new Promise(resolve => setTimeout(resolve, 700));
    // Devolver datos de ejemplo
    return [
        { _id: 'a1', user: { _id: '3', name: 'EMS User' }, date: new Date(Date.now() - 86400000), checkInTime: new Date(Date.now() - 86400000 + 3600000 * 8), checkOutTime: new Date(Date.now() - 86400000 + 3600000 * 17), observations: 'Día anterior' },
        { _id: 'a2', user: { _id: '3', name: 'EMS User' }, date: new Date(), checkInTime: new Date(Date.now() - 3600000 * 2), checkOutTime: null, observations: 'Turno actual' },
    ];
  },

  getTodaysAttendance: async () => {
     // const response = await api.get('/attendance/today');
     // return response.data;
     // Placeholder:
     console.log('Obteniendo asistencia de hoy');
     await new Promise(resolve => setTimeout(resolve, 600));
     return [
         { _id: 'a2', user: { _id: '3', name: 'EMS User' }, date: new Date(), checkInTime: new Date(Date.now() - 3600000 * 2), checkOutTime: null, observations: 'Turno actual' },
     ];
  },

  // Solo para Director
  getAllAttendance: async () => {
    // const response = await api.get('/attendance/all');
    // return response.data;
    // Placeholder:
    console.log('Obteniendo toda la asistencia (Director)');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        { _id: 'a1', user: { _id: '3', name: 'EMS User' }, date: new Date(Date.now() - 86400000), checkInTime: new Date(Date.now() - 86400000 + 3600000 * 8), checkOutTime: new Date(Date.now() - 86400000 + 3600000 * 17), observations: 'Día anterior EMS' },
        { _id: 'a2', user: { _id: '3', name: 'EMS User' }, date: new Date(), checkInTime: new Date(Date.now() - 3600000 * 2), checkOutTime: null, observations: 'Turno actual EMS' },
        { _id: 'b1', user: { _id: '2', name: 'Médico User' }, date: new Date(), checkInTime: new Date(Date.now() - 3600000 * 1), checkOutTime: null, observations: 'Turno actual Médico' },
    ];
  },

  // Solo para Director
  generateReport: async (format) => { // format = 'csv' or 'pdf'
    // const response = await api.get(`/reports/${format}`, { responseType: 'blob' }); // importante responseType
    // // Descargar el archivo
    // const url = window.URL.createObjectURL(new Blob([response.data]));
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', `reporte_asistencia.${format}`);
    // document.body.appendChild(link);
    // link.click();
    // link.parentNode.removeChild(link);
    // window.URL.revokeObjectURL(url);
    // Placeholder:
    console.log(`Generando reporte en formato: ${format}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Reporte ${format} generado (simulado)`);
    return { message: `Reporte ${format} generado (placeholder)` };
  }

};

export default attendanceService; 