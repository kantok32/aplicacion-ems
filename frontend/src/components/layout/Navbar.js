// Placeholder para la barra de navegación
import React from 'react';
// import { Link } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth'; // Para mostrar/ocultar enlaces

function Navbar() {
  // const { user, logout } = useAuth();

  return (
    <nav>
      {/* Links de navegación, condicionales según estado de auth y rol */}
      <ul>
        <li>{/* <Link to="/">Inicio</Link> */}</li>
        {/* {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button onClick={logout}>Cerrar Sesión</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Registro</Link></li>
          </>
        )} */}
      </ul>
    </nav>
  );
}

export default Navbar; 