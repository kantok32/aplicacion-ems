# Backend - Sistema de Control de Asistencia Hospitalaria

Este es el backend del sistema, desarrollado con Node.js y Express.

## Requisitos

- Node.js (v16 o superior recomendado)
- npm o yarn
- MongoDB (se recomienda MongoDB Atlas para la nube)

## Instalación

1.  Clona el repositorio.
2.  Navega a la carpeta `backend`: `cd backend`
3.  Instala las dependencias: `npm install` o `yarn install`
4.  Crea un archivo `.env` en la raíz de `backend` basándote en `.env.example` (o el que se generó).
5.  Añade tu string de conexión de MongoDB Atlas en `MONGO_URI` dentro del archivo `.env`.
6.  Configura un `JWT_SECRET` seguro en el archivo `.env`.

## Ejecución

- Para desarrollo (con nodemon para recarga automática): `npm run dev` o `yarn dev`
- Para producción: `npm start` o `yarn start`

El servidor se ejecutará por defecto en `http://localhost:5000` (o el puerto definido en `.env`).

## Estructura

- `config/`: Archivos de configuración (ej: JWT secret).
- `controllers/`: Lógica de negocio para cada ruta.
- `middlewares/`: Funciones middleware (ej: autenticación, autorización).
- `models/`: Esquemas de Mongoose para la base de datos.
- `routes/`: Definición de las rutas de la API.
- `utils/`: Funciones de utilidad.
- `server.js`: Punto de entrada principal del servidor.
- `.env`: Variables de entorno (¡No subir a Git!).
- `package.json`: Dependencias y scripts. 