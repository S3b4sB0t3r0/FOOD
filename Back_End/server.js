// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const equipoRoutes = require('./routes/equipoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const connectDB = require('./config/db');

const app = express();

// Puerto
const PORT = process.env.PORT || 5000;

// Uso de cors
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Routes
app.use('/api', equipoRoutes);
app.use('/api', productoRoutes);


// Validacion de conexión
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
