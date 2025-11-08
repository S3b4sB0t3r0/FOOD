import express from 'express';
import {
  getAllOrdersEmployee,
  editOrderEmployee,
  createOrderEmployee,
  getOrderByIdEmployee,
  deleteOrderEmployee,
} from '../controllers/employeeController.js';

const router = express.Router();

////////////////////////////////////////////////////////////////
// NOTA: Agregar middlewares de autenticación y roles después
// import { authMiddleware } from '../middleware/authMiddleware.js';
// import { isEmployeeOrAdmin } from '../middleware/roleMiddleware.js';
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// OBTENER TODAS LAS ÓRDENES
// GET /api/employee/orders
// Query params opcionales: ?status=pendiente&limit=50&page=1
////////////////////////////////////////////////////////////////
router.get('/orders', getAllOrdersEmployee);

////////////////////////////////////////////////////////////////
// OBTENER ORDEN ESPECÍFICA POR ID
// GET /api/employee/orders/:id
// Incluye información completa de la orden y sus movimientos
////////////////////////////////////////////////////////////////
router.get('/orders/:id', getOrderByIdEmployee);

////////////////////////////////////////////////////////////////
// CREAR NUEVA ORDEN
// POST /api/employee/orders
// Body: { items, totalPrice, orderDescription, status, customerEmail, sendEmail }
////////////////////////////////////////////////////////////////
router.post('/orders', createOrderEmployee);

////////////////////////////////////////////////////////////////
// EDITAR ORDEN EXISTENTE
// PUT /api/employee/orders/:id
// Body: { items, totalPrice, orderDescription, status, customerEmail, sendEmail }
////////////////////////////////////////////////////////////////
router.put('/orders/:id', editOrderEmployee);

////////////////////////////////////////////////////////////////
// ELIMINAR ORDEN
// DELETE /api/employee/orders/:id
// Elimina la orden y repone el stock automáticamente
////////////////////////////////////////////////////////////////
router.delete('/orders/:id', deleteOrderEmployee);

export default router;