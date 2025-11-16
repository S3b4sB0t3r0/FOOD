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

// ===== RUTAS CON RANGO DE FECHAS =====

// Estadísticas generales
// GET /api/reports/stats?fechaInicio=2024-01-01&fechaFin=2024-12-31
router.get('/stats', getReportStats);

// Ventas por período con agrupación personalizada
// GET /api/reports/ventas-periodo?fechaInicio=2024-01-01&fechaFin=2024-12-31&agrupacion=dia
// agrupacion: 'dia', 'semana', 'mes'
router.get('/ventas-periodo', getVentasPorPeriodo);

// Productos más vendidos en el rango de fechas
// GET /api/reports/productos-top?fechaInicio=2024-01-01&fechaFin=2024-12-31&limite=5
router.get('/productos-top', getProductosMasVendidos);

// Análisis financiero del período seleccionado
// GET /api/reports/analisis-financiero?fechaInicio=2024-01-01&fechaFin=2024-12-31
router.get('/analisis-financiero', getAnalisisFinanciero);

// Reporte completo con todos los datos del rango
// GET /api/reports/completo?fechaInicio=2024-01-01&fechaFin=2024-12-31
router.get('/completo', getReporteCompleto);

// Generar PDF del reporte con rango de fechas
// GET /api/reports/pdf?fechaInicio=2024-01-01&fechaFin=2024-12-31
router.get('/pdf', generarReportePDF);

export default router;