// Placeholder para el Contexto de Autenticación
import React, { createContext, useState, useEffect } from 'react';
// import authService from '../services/authService';
// import api from '../services/api'; // Instancia de axios configurada

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar cargar el usuario desde localStorage o verificar token al inicio
    const token = localStorage.getItem('token');
    if (token) {
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Aquí podrías hacer una petición para verificar el token y obtener datos del usuario
      // authService.verifyToken().then(userData => setUser(userData)).catch(() => logout());
      // Ejemplo simplificado:
      // const storedUser = localStorage.getItem('user');
      // if (storedUser) setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // setLoading(true);
    // try {
    //   const { token, user: userData } = await authService.login(credentials);
    //   localStorage.setItem('token', token);
    //   localStorage.setItem('user', JSON.stringify(userData)); // Guardar datos del usuario
    //   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //   setUser(userData);
    // } catch (error) {
    //   console.error('Error en login:', error);
    //   logout(); // Limpiar estado si falla
    //   throw error; // Relanzar para manejar en el componente
    // } finally {
    //   setLoading(false);
    // }
  };

  const register = async (userData) => {
     // setLoading(true);
    // try {
    //   // El backend podría devolver el token y usuario directamente al registrar
    //   const { token, user: newUser } = await authService.register(userData);
    //   localStorage.setItem('token', token);
    //   localStorage.setItem('user', JSON.stringify(newUser));
    //   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //   setUser(newUser);
    // } catch (error) {
    //   console.error('Error en registro:', error);
    //   logout();
    //   throw error;
    // } finally {
    //   setLoading(false);
    // }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 