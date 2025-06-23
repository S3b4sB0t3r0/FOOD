import express from 'express';
import { getEquipo } from '../controllers/equipoController.js';

const router = express.Router();

router.get('/equipo', getEquipo);

export default router;
