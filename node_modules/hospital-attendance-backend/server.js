require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB (añade tu string de conexión en .env)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error conectando MongoDB:', err));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/asistencias', require('./routes/asistencias'));
app.use('/api/turnos', require('./routes/turnos'));
app.use('/api/reportes', require('./routes/reportes'));

app.get('/', (req, res) => {
  res.send('API del Sistema de Asistencia Hospitalaria Funcionando');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`)); 