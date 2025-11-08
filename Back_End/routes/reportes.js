import express from 'express';
import {
  getReportStats,
  getVentasPorPeriodo,
  getProductosMasVendidos,
  getAnalisisFinanciero,
  getReporteCompleto,
  generarReportePDF
} from '../controllers/reportesController.js';

const router = express.Router();

// Estadísticas generales
router.get('/stats', getReportStats);

// Ventas por período (diario/semanal/mensual)
router.get('/ventas-periodo', getVentasPorPeriodo);

// Productos más vendidos
router.get('/productos-top', getProductosMasVendidos);

// Análisis financiero
router.get('/analisis-financiero', getAnalisisFinanciero);

// Reporte completo (todos los datos)
router.get('/completo', getReporteCompleto);

// Generar PDF
router.get('/pdf', generarReportePDF);

export default router;