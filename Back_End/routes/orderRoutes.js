import express from 'express';
import { createOrder, getOrderUser } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/getorderuser', getOrderUser); 

export default router;