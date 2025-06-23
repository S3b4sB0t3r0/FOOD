import express from 'express';
import { postContacto } from '../controllers/contactoController.js';

const router = express.Router();

router.post('/', postContacto);

export default router;
