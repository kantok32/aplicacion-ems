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
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="tu.email@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {loading ? <Spinner size="sm" /> : 'Entrar'}
        </Button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: 'blue' }}>Crear usuario</Link>
      </p>
    </div>
  );
}

export default Login; 