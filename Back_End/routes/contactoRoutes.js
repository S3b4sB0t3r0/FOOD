import express from 'express';
import { postContacto, getContactos } from '../controllers/contactoController.js';

const router = express.Router();

router.post('/', postContacto);
router.get('/dashboard', getContactos);

export default router;