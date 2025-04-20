// Placeholder para un indicador de carga
import React from 'react';

function Spinner({ size = 'md' }) { // size puede ser 'sm', 'md', 'lg'
  // Puedes usar una librería como react-spinners o CSS puro
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClasses[size]}`}>
      {/* Spinner visual */}
    </div>
  );
}

export default Spinner; 