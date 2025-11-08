import express from 'express';
import { 
  createOrder, 
  getOrderUser, 
  getAllOrders, 
  updateOrder, 
  deleteOrder,
  getFrequentCustomers,
  getCustomerStats
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/getorderuser', getOrderUser);
router.get('/admin/all', getAllOrders);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/frequent-customers', getFrequentCustomers);
router.get('/customer-stats/:email', getCustomerStats);

export default router;
