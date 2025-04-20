// Servicios relacionados con la autenticación
import api from './api';

const authService = {
  login: async (credentials) => {
    // const response = await api.post('/auth/login', credentials);
    // return response.data; // Debería devolver { token, user }
    // Placeholder:
    console.log('Llamando a login con:', credentials);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay
    if (credentials.email === 'director@test.com' && credentials.password === 'password') {
      return { token: 'fake-jwt-token-director', user: { _id: '1', name: 'Director User', email: 'director@test.com', role: 'Director' } };
    }
    if (credentials.email === 'medico@test.com' && credentials.password === 'password') {
       return { token: 'fake-jwt-token-medico', user: { _id: '2', name: 'Médico User', email: 'medico@test.com', role: 'Médico' } };
    }
     if (credentials.email === 'ems@test.com' && credentials.password === 'password') {
       return { token: 'fake-jwt-token-ems', user: { _id: '3', name: 'EMS User', email: 'ems@test.com', role: 'EMS' } };
    }
    throw new Error('Credenciales inválidas (placeholder)');
  },

  register: async (userData) => {
    // const response = await api.post('/auth/register', userData);
    // return response.data; // Debería devolver { token, user }
    // Placeholder:
    console.log('Llamando a register con:', userData);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simular registro exitoso
    const newUser = { _id: Date.now().toString(), ...userData };
    return { token: `fake-jwt-token-${newUser.role.toLowerCase()}`, user: newUser };
    // throw new Error('Error en registro (placeholder)');
  },

  // Opcional: verificar token existente
  verifyToken: async () => {
    // const response = await api.get('/auth/me'); // Endpoint que devuelva datos del usuario si el token es válido
    // return response.data;
    // Placeholder:
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
        return JSON.parse(storedUser);
    }
    throw new Error('No hay sesión válida (placeholder)');
  }
};

export default authService; 