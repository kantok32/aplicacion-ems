// Enrutador principal de la aplicación
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
// import useAuth from '../hooks/useAuth'; // Para lógica condicional si es necesario

function AppRouter() {
  // const { user, loading } = useAuth(); // Podría usarse para mostrar/ocultar layout

  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: '80vh', padding: '20px' }}> {/* Estilo básico para contenido */} 
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas Protegidas (ejemplo: acceso para todos los roles logueados) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Otras rutas protegidas comunes a todos los roles */}
          </Route>

          {/* Rutas Protegidas por Rol (Ejemplo para Director) */}
          {/* 
          <Route element={<ProtectedRoute allowedRoles={['Director']} />}>
            <Route path="/admin/users" element={<div>Gestión Usuarios (Director)</div>} />
            <Route path="/admin/reports" element={<div>Generar Reportes (Director)</div>} />
          </Route>
          */}
          
          {/* Ruta Médico (si tuviera páginas específicas además del dashboard) */}
          {/* 
          <Route element={<ProtectedRoute allowedRoles={['Médico', 'Director']} />}>
             <Route path="/patients/today" element={<div>Atenciones Hoy (Médico/Director)</div>} />
          </Route>
          */}

          {/* Ruta No Encontrada */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default AppRouter; 