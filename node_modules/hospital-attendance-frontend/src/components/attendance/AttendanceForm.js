// Placeholder para el formulario de registro de asistencia
import React, { useState } from 'react';
// import attendanceService from '../../services/attendanceService';
// import useAuth from '../../hooks/useAuth';

function AttendanceForm() {
  const [observations, setObservations] = useState('');
  // const { user } = useAuth(); // Para obtener ID del usuario
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [lastAction, setLastAction] = useState(null); // 'check-in' or 'check-out'

  const handleCheckIn = async () => {
    // setIsLoading(true);
    // setError(null);
    // try {
    //   await attendanceService.checkIn({ observations });
    //   setLastAction('check-in');
    //   // Opcional: recargar datos, mostrar mensaje
    // } catch (err) {
    //   setError(err.message || 'Error al registrar entrada');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleCheckOut = async () => {
     // setIsLoading(true);
    // setError(null);
    // try {
    //   await attendanceService.checkOut({ observations });
    //   setLastAction('check-out');
    //   // Opcional: recargar datos, mostrar mensaje
    // } catch (err) {
    //   setError(err.message || 'Error al registrar salida');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div>
      <h4>Registrar Asistencia</h4>
      <textarea
        placeholder="Observaciones (opcional)"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
      />
      <button onClick={handleCheckIn} /* disabled={isLoading || lastAction === 'check-in'} */>
        Registrar Entrada
      </button>
      <button onClick={handleCheckOut} /* disabled={isLoading || lastAction === 'check-out'} */>
        Registrar Salida
      </button>
      {/* {isLoading && <p>Cargando...</p>} */}
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
    </div>
  );
}

export default AttendanceForm; 