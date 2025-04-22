// Placeholder para la página del Dashboard (renderiza el dashboard específico)
import React from 'react';
import useAuth from '../hooks/useAuth';
import EmsDashboard from '../components/dashboard/EmsDashboard';
import DoctorDashboard from '../components/dashboard/DoctorDashboard';
// import DirectorDashboard from '../components/dashboard/DirectorDashboard';
import Spinner from '../components/common/Spinner';

// --- Componentes del Dashboard del Director --- 
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {/* Icono (Placeholder) - Puedes usar una librería como Heroicons */} 
          <span className="text-2xl">{icon}</span> 
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const DirectorAdminDashboard = () => {
  // Datos simulados (podrían venir de una API en el futuro)
  const avgHours = 7.8;
  const medicosActivos = 4;
  const emsActivos = 12;
  const directoresActivos = 1;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Resumen del Sistema</h2>
      {/* Grid para las tarjetas de estadísticas */} 
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Promedio Horas (Mes)" value={avgHours.toFixed(1)} icon="⏱️" />
        <StatCard title="Médicos en Servicio" value={medicosActivos} icon="🧑‍⚕️" />
        <StatCard title="EMS en Servicio" value={emsActivos} icon="🚑" />
        <StatCard title="Directores en Servicio" value={directoresActivos} icon="👤" />
      </div>

      {/* Placeholder para otras secciones del dashboard del director */} 
      <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="flex space-x-4">
             {/* Estos serían Links o botones que lleven a las rutas correspondientes */}
             <button className="text-indigo-600 hover:text-indigo-900">Ver Reportes</button>
             <button className="text-indigo-600 hover:text-indigo-900">Gestionar Usuarios</button>
             <button className="text-indigo-600 hover:text-indigo-900">Gestionar Turnos</button>
          </div>
      </div>
    </div>
  );
}
// --- Fin Componentes Director ---

function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Esto no debería pasar si ProtectedRoute funciona, pero es una salvaguarda
    return <p className="text-center text-red-600">Error: Usuario no autenticado.</p>;
  }

  // Renderizar dashboard según el rol
  const renderSpecificDashboard = () => {
    switch (user.role) {
      case 'DIRECTOR':
        return <DirectorAdminDashboard />;
      case 'MÉDICO':
        return <DoctorDashboard />; // Aún usa placeholder
      case 'EMS':
        return <EmsDashboard />; // Aún usa placeholder
      default:
        return <p className="text-center text-red-600">Rol de usuario no reconocido.</p>;
    }
  };

  return (
    // Layout principal del Dashboard
    <div className="bg-gray-100 min-h-[calc(100vh-4rem)]"> {/* Fondo gris y altura mínima */} 
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Saludo */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Bienvenido, <span className="text-indigo-600">{user.name}!</span>
          </h1>
          
          {/* Contenido específico del rol */} 
          {renderSpecificDashboard()}
        </div>
    </div>
  );
}

export default DashboardPage; 