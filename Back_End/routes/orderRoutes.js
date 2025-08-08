import express from 'express';
import { createOrder, getOrderUser, getAllOrders } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/getorderuser', getOrderUser); 
router.get('/admin/all', getAllOrders);

export default router;