// Placeholder para la lista de registros de asistencia
import React, { useState, useEffect } from 'react';
// import attendanceService from '../../services/attendanceService';
// import useAuth from '../../hooks/useAuth';

function AttendanceList({ all = false }) { // Prop `all` para vista de Director
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  // const { user } = useAuth();
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      // setIsLoading(true);
      // setError(null);
      // try {
      //   let data;
      //   if (all && user?.role === 'Director') {
      //     data = await attendanceService.getAllAttendance();
      //   } else {
      //     // Podría ser historial propio o del día
      //     data = await attendanceService.getAttendanceHistory(); // O getTodaysAttendance
      //   }
      //   setAttendanceRecords(data);
      // } catch (err) {
      //   setError(err.message || 'Error al cargar asistencias');
      // } finally {
      //   setIsLoading(false);
      // }
    };

    // fetchAttendance();
  }, [all/*, user*/]);

  return (
    <div>
      <h4>{all ? 'Historial Global' : 'Mi Historial'} de Asistencia</h4>
      {/* {isLoading && <p>Cargando...</p>} */}
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
      {/* {!isLoading && !error && attendanceRecords.length === 0 && <p>No hay registros.</p>} */}
      {/* {!isLoading && !error && attendanceRecords.length > 0 && (
        <table>
          <thead>
            <tr>
              {all && <th>Usuario</th>}
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map(record => (
              <tr key={record._id}>
                {all && <td>{record.user?.name || 'N/A'}</td>}
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                <td>{record.observations || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )} */}
    </div>
  );
}

export default AttendanceList; 