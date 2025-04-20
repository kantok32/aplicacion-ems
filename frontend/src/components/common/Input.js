// Placeholder para un componente Input reutilizable
import React from 'react';

function Input({ type = 'text', value, onChange, placeholder, name, required = false, className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      required={required}
      className={`border p-2 rounded w-full ${className}`}
      // Añade clases base de Tailwind/MUI o estilos propios
    />
  );
}

export default Input; 