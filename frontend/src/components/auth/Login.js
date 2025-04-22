// Placeholder para el componente de Login
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Para el enlace y la redirección
import useAuth from '../../hooks/useAuth'; // Hook de autenticación
import Input from '../common/Input';
import Button from '../common/Button';
import Spinner from '../common/Spinner'; // Para mostrar estado de carga

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Obtener función login del contexto
  const navigate = useNavigate(); // Para redirigir después del login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, introduce el email y la contraseña.');
      setLoading(false);
      return;
    }

    try {
      // Llamar a la función login del contexto (que usa authService)
      await login({ email, password });
      // Si el login es exitoso, el AuthContext actualizará el estado
      // y el ProtectedRoute o la lógica del dashboard redirigirá.
      // O podemos redirigir explícitamente aquí:
      navigate('/dashboard'); // Redirigir al dashboard
    } catch (err) {
      console.error("Error en el login:", err);
      // Usar el mensaje de error del backend si está disponible
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal: flexbox para centrar vertical y horizontalmente, fondo gris claro
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Encabezado con logo/título */}
        <div>
          {/* Placeholder para logo - Puedes reemplazar con <img /> */}
          <div className="mx-auto h-12 w-auto text-center text-4xl text-indigo-600">🏥</div> 
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accede a tu cuenta
          </h2>
        </div>

        {/* Card del formulario */} 
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email (Ahora tipo texto) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Usuario o Correo Electrónico
              </label>
              <div className="mt-1">
                <Input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="admin o tu.email@ejemplo.com"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Campo Contraseña */} 
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Mensaje de Error */} 
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Login */} 
            <div>
              <Button 
                type="submit" 
                disabled={loading} 
                // Botón ancho completo, con estilos de color y estado loading
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Spinner size="sm" /> : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>

          {/* Enlace a Registro */} 
          <div className="text-sm text-center">
            <span className="text-gray-600">¿No tienes una cuenta?</span>{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Regístrate aquí
            </Link>
          </div>
        </div> 
      </div>
    </div>
  );
}

export default Login; 