// Placeholder para un componente Botón reutilizable
import React from 'react';

function Button({ onClick, children, type = 'button', disabled = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-4 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      // Añade clases base de Tailwind/MUI o estilos propios
    >
      {children}
    </button>
  );
}

export default Button; 