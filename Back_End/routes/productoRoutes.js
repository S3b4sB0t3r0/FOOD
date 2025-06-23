import express from 'express';
import { getProductos } from '../controllers/productoController.js';

const router = express.Router();

router.get('/menu', getProductos);

export default router;
