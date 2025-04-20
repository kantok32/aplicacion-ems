// Placeholder para la página del Dashboard (renderiza el dashboard específico)
import React from 'react';
// import useAuth from '../hooks/useAuth';
// import EmsDashboard from '../components/dashboard/EmsDashboard';
// import DoctorDashboard from '../components/dashboard/DoctorDashboard';
// import DirectorDashboard from '../components/dashboard/DirectorDashboard';

function DashboardPage() {
  // const { user } = useAuth();

  // const renderDashboard = () => {
  //   if (!user) return <p>Cargando...</p>; // O redirigir si no hay usuario

  //   switch (user.role) {
  //     case 'EMS':
  //       return <EmsDashboard />;
  //     case 'Médico':
  //       return <DoctorDashboard />;
  //     case 'Director':
  //       return <DirectorDashboard />;
  //     default:
  //       return <p>Rol no reconocido.</p>;
  //   }
  // };

  return (
    <div>
      <h2>Dashboard</h2>
      {/* {renderDashboard()} */}
      <p>Aquí se mostrará el dashboard según el rol.</p>
    </div>
  );
}

export default DashboardPage; 