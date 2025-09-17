import express from 'express';
import { 
  createOrder, 
  getOrderUser, 
  getAllOrders, 
  updateOrder, 
  deleteOrder 
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/getorderuser', getOrderUser);
router.get('/admin/all', getAllOrders);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
