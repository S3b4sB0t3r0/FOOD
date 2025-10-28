import express from 'express';
import {
  getProductos,
  toggleEstadoProducto,
  updateProducto,
  getClienteProductos,
  createProducto,
  bulkUpdateProductos 
} from '../controllers/productoController.js';

const router = express.Router();

router.put('/menu/bulk', bulkUpdateProductos); 

router.get('/menu', getProductos);
router.get('/menu-cliente', getClienteProductos);
router.put('/:id/estado', toggleEstadoProducto);
router.put('/menu/:id', updateProducto);
router.post('/menu', createProducto);

export default router;
