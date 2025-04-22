// Placeholder para la barra de navegación
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Hook para obtener usuario y logout
import Button from '../common/Button'; // Usar nuestro botón estilizado

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login'); // Redirige al login
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Título */} 
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              🏥 Asistencia Hosp.
            </Link>
          </div>

          {/* Enlaces / Info Usuario */} 
          <div className="flex items-center">
            {user ? (
              // Usuario Logueado
              <div className="ml-4 flex items-center md:ml-6">
                <span className="text-gray-700 mr-4">Hola, {user.name}!</span>
                <Button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-md"
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              // Usuario No Logueado
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register"
                  className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 