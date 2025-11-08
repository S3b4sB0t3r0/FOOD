import Order from '../models/Order.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

////////////////////////////////////////////////////////////// REPORTE GENERAL //////////////////////////////////////////////////////////////
export const getReportStats = async (req, res) => {
  try {
    const totalVentas = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalPedidos = await Order.countDocuments();
    const totalUsuarios = await User.countDocuments();

    res.json({
      totalVentas: totalVentas[0]?.total || 0,
      totalPedidos,
      totalUsuarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando estadísticas' });
  }
};

////////////////////////////////////////////////////////////// VENTAS POR PERÍODO //////////////////////////////////////////////////////////////
export const getVentasPorPeriodo = async (req, res) => {
  try {
    const { periodo } = req.query; // 'diario', 'semanal', 'mensual'
    
    const hoy = new Date();
    let fechaInicio;
    let groupBy;
    let formatLabel;

    switch(periodo) {
      case 'diario':
        // Últimos 7 días
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 7);
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        };
        formatLabel = (doc) => `${doc._id.day}/${doc._id.month}`;
        break;

      case 'semanal':
        // Últimas 8 semanas
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 56);
        groupBy = {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" }
        };
        formatLabel = (doc) => `Sem ${doc._id.week}`;
        break;

      case 'mensual':
      default:
        // Últimos 12 meses
        fechaInicio = new Date(hoy);
        fechaInicio.setMonth(hoy.getMonth() - 12);
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        };
        formatLabel = (doc) => {
          const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          return meses[doc._id.month - 1];
        };
    }

    const ventas = await Order.aggregate([
      { $match: { createdAt: { $gte: fechaInicio } } },
      {
        $group: {
          _id: groupBy,
          total: { $sum: "$totalPrice" },
          cantidad: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } }
    ]);

    const resultado = ventas.map(v => ({
      name: formatLabel(v),
      ventas: v.total,
      pedidos: v.cantidad
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error obteniendo ventas por período:", error);
    res.status(500).json({ error: "Error al obtener ventas por período" });
  }
};

////////////////////////////////////////////////////////////// PRODUCTOS MÁS VENDIDOS //////////////////////////////////////////////////////////////
export const getProductosMasVendidos = async (req, res) => {
  try {
    const { limite } = req.query;
    const maxProductos = parseInt(limite) || 5;

    const productos = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.title",
          cantidad: { $sum: "$items.quantity" },
          ingresos: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { cantidad: -1 } },
      { $limit: maxProductos }
    ]);

    // Colores para el gráfico de pie
    const colores = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

    const resultado = productos.map((p, index) => ({
      name: p._id,
      value: p.cantidad,
      ingresos: p.ingresos,
      color: colores[index % colores.length]
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error obteniendo productos más vendidos:", error);
    res.status(500).json({ error: "Error al obtener productos más vendidos" });
  }
};

////////////////////////////////////////////////////////////// ANÁLISIS DE INGRESOS Y GASTOS //////////////////////////////////////////////////////////////
export const getAnalisisFinanciero = async (req, res) => {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Ingresos por día del mes actual
    const ingresosDiarios = await Order.aggregate([
      { $match: { createdAt: { $gte: inicioMes } } },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          ingresos: { $sum: "$totalPrice" },
          pedidos: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Comparación mes actual vs mes anterior
    const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    const mesActual = await Order.aggregate([
      { $match: { createdAt: { $gte: inicioMes } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const mesAnterior = await Order.aggregate([
      { $match: { createdAt: { $gte: inicioMesAnterior, $lte: finMesAnterior } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalMesActual = mesActual[0]?.total || 0;
    const totalMesAnterior = mesAnterior[0]?.total || 0;
    const porcentajeCambio = totalMesAnterior > 0 
      ? ((totalMesActual - totalMesAnterior) / totalMesAnterior * 100).toFixed(2)
      : 0;

    res.json({
      ingresosDiarios: ingresosDiarios.map(d => ({
        dia: d._id,
        ingresos: d.ingresos,
        pedidos: d.pedidos
      })),
      comparativa: {
        mesActual: totalMesActual,
        mesAnterior: totalMesAnterior,
        porcentajeCambio: parseFloat(porcentajeCambio),
        tendencia: porcentajeCambio >= 0 ? 'positiva' : 'negativa'
      }
    });
  } catch (error) {
    console.error("Error obteniendo análisis financiero:", error);
    res.status(500).json({ error: "Error al obtener análisis financiero" });
  }
};

////////////////////////////////////////////////////////////// REPORTE COMPLETO PARA PDF //////////////////////////////////////////////////////////////
export const getReporteCompleto = async (req, res) => {
  try {
    // Obtener todas las estadísticas necesarias
    const [statsGenerales, ventasMensuales, topProductos, analisisFinanciero] = await Promise.all([
      // Stats generales
      Order.aggregate([
        {
          $facet: {
            totalVentas: [
              { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ],
            totalPedidos: [
              { $count: "total" }
            ]
          }
        }
      ]),
      
      // Ventas de los últimos 12 meses
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
            }
          }
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            total: { $sum: "$totalPrice" },
            cantidad: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      
      // Top 5 productos
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.title",
            cantidad: { $sum: "$items.quantity" },
            ingresos: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        },
        { $sort: { cantidad: -1 } },
        { $limit: 5 }
      ]),
      
      // Análisis del mes actual
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        },
        {
          $group: {
            _id: null,
            totalMes: { $sum: "$totalPrice" },
            pedidosMes: { $sum: 1 },
            promedioTicket: { $avg: "$totalPrice" }
          }
        }
      ])
    ]);

    const totalUsuarios = await User.countDocuments();

    res.json({
      general: {
        totalVentas: statsGenerales[0]?.totalVentas[0]?.total || 0,
        totalPedidos: statsGenerales[0]?.totalPedidos[0]?.total || 0,
        totalUsuarios
      },
      ventasMensuales,
      topProductos,
      mesActual: analisisFinanciero[0] || {
        totalMes: 0,
        pedidosMes: 0,
        promedioTicket: 0
      }
    });
  } catch (error) {
    console.error("Error obteniendo reporte completo:", error);
    res.status(500).json({ error: "Error al obtener reporte completo" });
  }
};

////////////////////////////////////////////////////////////// GENERAR REPORTE PDF //////////////////////////////////////////////////////////////
export const generarReportePDF = async (req, res) => {
  try {
    // Obtener datos del reporte
    const statsGenerales = await Order.aggregate([
      {
        $facet: {
          totalVentas: [
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
          ],
          totalPedidos: [
            { $count: "total" }
          ]
        }
      }
    ]);

    const totalUsuarios = await User.countDocuments();
    const totalVentas = statsGenerales[0]?.totalVentas[0]?.total || 0;
    const totalPedidos = statsGenerales[0]?.totalPedidos[0]?.total || 0;

    // Top productos
    const topProductos = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.title",
          cantidad: { $sum: "$items.quantity" },
          ingresos: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { cantidad: -1 } },
      { $limit: 5 }
    ]);

    // Ventas del mes actual
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const ventasMes = await Order.aggregate([
      { $match: { createdAt: { $gte: inicioMes } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
          pedidos: { $sum: 1 }
        }
      }
    ]);

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Disposition', 'attachment; filename=reporte-vandalo-grill.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Logo (con más espacio)
    const logoPath = path.join(process.cwd(), 'img', 'LOGOO.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 250, 40, { width: 100 });
      doc.moveDown(6); // Más espacio después del logo
    }

    // Título
    doc
      .fontSize(26)
      .font('Helvetica-Bold')
      .fillColor('#f59e0b')
      .text('REPORTE DE ESTADISTICAS', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(18)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text('El Vandalo Grill', { align: 'center' })
      .moveDown(0.5);

    // Info empresa
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#666666')
      .text('Cra 4 Este #39-02sur, San Cristobal, Bogota', { align: 'center' })
      .text('Tel: 57 314 577 3241', { align: 'center' })
      .text('elvandalogrillcolombia@gmail.com', { align: 'center' })
      .moveDown(1);

    // Fecha de generación
    const fecha = new Date().toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc
      .fontSize(10)
      .fillColor('#999999')
      .text(`Generado el: ${fecha}`, { align: 'center' })
      .moveDown(2);

    // Línea separadora
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#f59e0b').lineWidth(2).stroke();
    doc.moveDown(2);

    // ===== SECCIÓN 1: MÉTRICAS GENERALES =====
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('METRICAS GENERALES', { underline: true })
      .moveDown(1);

    const metricas = [
      { label: 'Ventas Totales:', valor: `$${totalVentas.toLocaleString('es-CO')}`, color: '#10b981' },
      { label: 'Total de Pedidos:', valor: totalPedidos.toString(), color: '#3b82f6' },
      { label: 'Usuarios Registrados:', valor: totalUsuarios.toString(), color: '#8b5cf6' },
      { 
        label: 'Promedio por Pedido:', 
        valor: totalPedidos > 0 ? `$${(totalVentas / totalPedidos).toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '$0.00', 
        color: '#f59e0b' 
      }
    ];

    metricas.forEach(metrica => {
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text(metrica.label, 70, doc.y, { continued: true, width: 220 })
        .font('Helvetica')
        .fillColor(metrica.color)
        .text(metrica.valor, { align: 'right' })
        .moveDown(0.7);
    });

    doc.moveDown(2);

    // ===== SECCIÓN 2: VENTAS DEL MES =====
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('VENTAS DEL MES ACTUAL', { underline: true })
      .moveDown(1);

    const ventasMesActual = ventasMes[0] || { total: 0, pedidos: 0 };
    
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('Ingresos del mes: ', 70, doc.y, { continued: true })
      .font('Helvetica')
      .fillColor('#10b981')
      .text(`$${ventasMesActual.total.toLocaleString('es-CO')}`)
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('Pedidos realizados: ', 70, doc.y, { continued: true })
      .font('Helvetica')
      .fillColor('#3b82f6')
      .text(`${ventasMesActual.pedidos}`)
      .moveDown(2);

    // ===== SECCIÓN 3: PRODUCTOS MÁS VENDIDOS =====
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('TOP 5 PRODUCTOS MAS VENDIDOS', { underline: true })
      .moveDown(1);

    topProductos.forEach((producto, index) => {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text(`${index + 1}. ${producto._id}`, 70)
        .font('Helvetica')
        .fillColor('#666666')
        .text(`   ${producto.cantidad} unidades vendidas`, 70, doc.y, { continued: true })
        .fillColor('#10b981')
        .text(` | $${producto.ingresos.toLocaleString('es-CO')}`)
        .moveDown(0.5);
    });

    doc.moveDown(2);

    // Línea separadora final
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').lineWidth(1).stroke();
    doc.moveDown(1.5);

    // Footer
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#999999')
      .text('Este reporte es confidencial y de uso exclusivo para El Vandalo Grill', { align: 'center' })
      .moveDown(0.3)
      .text('Para mas informacion: elvandalogrillcolombia@gmail.com', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('Error generando PDF:', err);
    res.status(500).json({ message: 'Error generando PDF' });
  }
};