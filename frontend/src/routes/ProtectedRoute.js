// Componente para proteger rutas que requieren autenticación
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner'; // Para mostrar mientras carga

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Muestra un spinner mientras se verifica la autenticación
    return <Spinner size="lg" />;
  }

  if (!user) {
    // Si no hay usuario, redirige al login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si el rol no está permitido para esta ruta, redirige (ej: a una página "No autorizado" o al dashboard)
    // Podrías tener una página específica <UnauthorizedPage />
    console.warn(`Usuario con rol ${user.role} intentó acceder a ruta protegida para ${allowedRoles}`);
    return <Navigate to="/dashboard" replace />; // O a "/unauthorized"
  }

  // Si el usuario está autenticado y tiene el rol permitido (o no se especificaron roles), renderiza el contenido
  return <Outlet />; // Renderiza el componente hijo de la ruta protegida
};

export default ProtectedRoute; 