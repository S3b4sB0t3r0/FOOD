import express from 'express';
import { 
  createOrder, 
  getOrderUser, 
  getAllOrders, 
  updateOrder, 
  deleteOrder,
  getFrequentCustomers,
  getCustomerStats,
  confirmOrder,
  reportOrder,
  editOrder
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ==================== RUTAS PÚBLICAS / CLIENTES ====================
router.post('/', authMiddleware, createOrder);
router.get('/getorderuser', getOrderUser);

//  RUTAS PARA CLIENTE - Confirmar o reportar pedido
router.patch('/:id/confirm', confirmOrder);  // Cliente confirma recepción
router.patch('/:id/report', reportOrder);    // Cliente reporta problema

// ==================== RUTAS ADMIN / EMPLEADOS ====================
router.get('/admin/all', getAllOrders);
router.put('/:id', updateOrder);            // Actualizar estado del pedido
router.put('/:id/edit', editOrder);         // Editar pedido completo (items, precios, etc)
router.delete('/:id', deleteOrder);

// ==================== ESTADÍSTICAS ====================
router.get('/frequent-customers', getFrequentCustomers);
router.get('/customer-stats/:email', getCustomerStats);

export default router;