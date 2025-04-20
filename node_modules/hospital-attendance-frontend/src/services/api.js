// Configuración de la instancia de Axios
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // URL base del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Opcional: Interceptor para manejar errores 401 (Unauthorized) globalmente
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Aquí podrías llamar a logout() del AuthContext o redirigir al login
//       console.error('No autorizado. Deslogueando...');
//       // Asegúrate de no crear un bucle infinito si el error 401 viene del login
//       // window.location = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default api; 