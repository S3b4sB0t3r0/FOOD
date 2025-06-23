import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import contactoRoutes from './routes/contactoRoutes.js';
import equipoRoutes from './routes/equipoRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/api/contacto', contactoRoutes);
app.use('/api', equipoRoutes);
app.use('/api', productoRoutes);
app.use('/api/user', userRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
