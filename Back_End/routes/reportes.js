import express from 'express';
import { getReportStats, generarReportePDF  } from '../controllers/reportesController.js';

const router = express.Router();

router.get('/estadisticas', getReportStats);
router.get('/pdf', generarReportePDF);

export default router;
