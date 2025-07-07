import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  solicitarRecuperacion,
  cambiarPasswordToken
} from '../controllers/userController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/recuperar', solicitarRecuperacion); 
router.post('/recuperar/reset', cambiarPasswordToken); 


// Rutas protegidas con JWT
router.get('/perfil', authMiddleware, getProfile);
router.put('/perfil', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);

export default router;
