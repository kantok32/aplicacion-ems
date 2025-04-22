// Servicios relacionados con la autenticación
import api from './api';

const authService = {
  login: async (credentials) => {
    // *** Inicio: Caso especial para admin ***
    if (credentials.email === 'admin' && credentials.password === '123') {
      console.log('Login simulado para usuario admin');
      await new Promise(resolve => setTimeout(resolve, 300)); // Simular pequeño delay
      return {
        token: 'fake-jwt-token-admin-director', // Token falso
        user: { 
          _id: 'admin001', // ID Falso
          id: 'admin001', // Mongoose virtual
          name: 'Administrador Principal', 
          email: 'admin', 
          role: 'DIRECTOR' // Rol clave
        }
      };
    }
    // *** Fin: Caso especial para admin ***

    // Si no es admin, intentar con el backend (o placeholder existente)
    // console.log('Llamando a login real con:', credentials);
    // const response = await api.post('/auth/login', credentials);
    // return response.data; // Debería devolver { token, user }
    
    // --- Placeholder original (mantener si el backend no está listo) ---
    console.log('Llamando a login (placeholder) con:', credentials);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (credentials.email === 'director@test.com' && credentials.password === 'password') {
        return { token: 'fake-jwt-token-director', user: { _id: '1', id:'1', name: 'Director User', email: 'director@test.com', role: 'DIRECTOR' } };
      }
      if (credentials.email === 'medico@test.com' && credentials.password === 'password') {
         return { token: 'fake-jwt-token-medico', user: { _id: '2', id:'2', name: 'Médico User', email: 'medico@test.com', role: 'MÉDICO' } };
      }
       if (credentials.email === 'ems@test.com' && credentials.password === 'password') {
         return { token: 'fake-jwt-token-ems', user: { _id: '3', id:'3', name: 'EMS User', email: 'ems@test.com', role: 'EMS' } };
      }
      throw new Error('Credenciales inválidas (placeholder)');
     // --- Fin Placeholder original ---

  },

  register: async (userData) => {
    // const response = await api.post('/auth/register', userData);
    // return response.data;
    console.log('Llamando a register (placeholder) con:', userData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = { _id: Date.now().toString(), id: Date.now().toString(), ...userData };
    // Si registras desde frontend, el rol será EMS por defecto
    return { token: `fake-jwt-token-${(userData.role || 'EMS').toLowerCase()}`, user: newUser };
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