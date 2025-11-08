import express from 'express';
import {
  getTendenciaVentas,
  getVentasHoy,
  getPedidosHoy,
  getUsuariosActivos,
  getProductosMasVendidos,
  getIngresosMes,
  getPedidosPorDia,
  getHorasPico,
  getBajoStock
} from '../controllers/statsController.js';

const router = express.Router();

router.get('/tendencia-ventas', getTendenciaVentas);
router.get('/ventas-hoy', getVentasHoy);
router.get('/pedidos-hoy', getPedidosHoy);
router.get('/usuarios-activos', getUsuariosActivos);
router.get('/productos-mas-vendidos', getProductosMasVendidos);
router.get('/ingresos-mes', getIngresosMes);
router.get('/pedidos-por-dia', getPedidosPorDia);
router.get('/horas-pico', getHorasPico);
router.get('/bajo-stock', getBajoStock);

export default router;
