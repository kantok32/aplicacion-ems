// Placeholder para el Contexto de Autenticación
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api'; // Instancia de axios configurada

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar cargar el usuario desde localStorage o verificar token al inicio
    const token = localStorage.getItem('token');
    if (token) {
      // Establecer token en cabeceras de api al cargar
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Cargar usuario desde localStorage (simplificado)
      // En una app real, verificar token con /api/auth/me aquí
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          try {
              setUser(JSON.parse(storedUser));
          } catch (e) {
              console.error("Error parsing stored user:", e);
              logout(); // Limpiar si los datos están corruptos
          }
      }
    } else {
        // Asegurarse que no haya token viejo en las cabeceras si no hay en localStorage
        delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Llamar al servicio de autenticación (que maneja admin o llama a la API)
      const { token, user: userData } = await authService.login(credentials);
      
      // Guardar token y usuario
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Configurar cabecera de Axios para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Actualizar estado del usuario en el contexto
      setUser(userData);
      
    } catch (error) {
      console.error('Error en AuthContext login:', error);
      logout(); // Limpiar estado si falla el login
      throw error; // Relanzar para que el componente Login muestre el error
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
     setLoading(true);
     try {
       // Llamar al servicio de registro
       const { token, user: newUser } = await authService.register(userData);
       // Asumimos que el registro exitoso también loguea al usuario
       localStorage.setItem('token', token);
       localStorage.setItem('user', JSON.stringify(newUser));
       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       setUser(newUser);
       // No relanzar error aquí si queremos que el componente decida qué hacer
     } catch (error) {
       console.error('Error en AuthContext register:', error);
       logout(); // Limpiar estado si falla
       throw error; // Relanzar para que el componente Register muestre el error
     } finally {
       setLoading(false);
     }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 