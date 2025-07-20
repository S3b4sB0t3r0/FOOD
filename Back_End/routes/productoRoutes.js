import express from 'express';
import { getProductos, toggleEstadoProducto, updateProducto  } from '../controllers/productoController.js';

const router = express.Router();

router.get('/menu', getProductos);
router.put('/:id/estado', toggleEstadoProducto);
router.put('/menu/:id', updateProducto); // <-- más consistente

export default router;
