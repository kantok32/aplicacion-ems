# Frontend - Sistema de Control de Asistencia Hospitalaria

Este es el frontend del sistema, desarrollado con React.

## Requisitos

- Node.js (v16 o superior recomendado)
- npm o yarn

## Instalación

1.  Clona el repositorio.
2.  Navega a la carpeta `frontend`: `cd frontend`
3.  Instala las dependencias: `npm install` o `yarn install`
4.  (Opcional) Si la API del backend no corre en `http://localhost:5000/api`, crea un archivo `.env` en la raíz de `frontend` y define `REACT_APP_API_URL` con la URL correcta de la API (ej: `REACT_APP_API_URL=http://tu-dominio.com/api`).

## Ejecución

- Inicia el servidor de desarrollo: `npm start` o `yarn start`

La aplicación se abrirá por defecto en `http://localhost:3000`.

## Build para Producción

- Genera los archivos estáticos para desplegar: `npm run build` o `yarn build`
- Los archivos se encontrarán en la carpeta `build/`.

## Estructura

- `public/`: Archivos estáticos (HTML principal, iconos).
- `src/`: Código fuente de la aplicación React.
  - `assets/`: Imágenes, fuentes, etc.
  - `components/`: Componentes reutilizables de UI.
    - `auth/`: Componentes específicos de autenticación.
    - `attendance/`: Componentes para el registro de asistencia.
    - `common/`: Componentes genéricos (botones, inputs, etc.).
    - `dashboard/`: Componentes para los diferentes dashboards.
    - `layout/`: Componentes de estructura (Navbar, Footer).
  - `context/`: React Context API para manejo de estado global (ej: AuthContext).
  - `hooks/`: Hooks personalizados (ej: useAuth).
  - `pages/`: Componentes que representan páginas completas de la aplicación.
  - `routes/`: Configuración del enrutamiento (AppRouter, ProtectedRoute).
  - `services/`: Lógica para interactuar con la API backend (api.js, authService.js, etc.).
  - `App.js`: Componente raíz principal.
  - `index.js`: Punto de entrada de React (renderiza App).
  - `index.css`: Estilos globales o configuración de Tailwind/MUI.
- `.gitignore`: Archivos y carpetas ignorados por Git.
- `package.json`: Dependencias y scripts. 