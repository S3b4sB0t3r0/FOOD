import Order from '../models/Order.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

////////////////////////////////////////////////////////////// REPORTE GENERAL CON RANGO DE FECHAS //////////////////////////////////////////////////////////////
export const getReportStats = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    // Construir el filtro de fechas
    let filtroFechas = {};
    if (fechaInicio && fechaFin) {
      filtroFechas = {
        createdAt: {
          $gte: new Date(fechaInicio),
          $lte: new Date(new Date(fechaFin).setHours(23, 59, 59, 999)) // Incluir todo el día final
        }
      };
    }

    const totalVentas = await Order.aggregate([
      { $match: filtroFechas },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalPedidos = await Order.countDocuments(filtroFechas);
    const totalUsuarios = await User.countDocuments();

    res.json({
      totalVentas: totalVentas[0]?.total || 0,
      totalPedidos,
      totalUsuarios,
      rangoFechas: fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando estadísticas' });
  }
};

////////////////////////////////////////////////////////////// VENTAS POR RANGO DE FECHAS CON AGRUPACIÓN //////////////////////////////////////////////////////////////
export const getVentasPorPeriodo = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, agrupacion } = req.query;
    // agrupacion puede ser: 'dia', 'semana', 'mes'
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Se requieren fechaInicio y fechaFin" });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(new Date(fechaFin).setHours(23, 59, 59, 999));

    let groupBy;
    let formatLabel;

    switch(agrupacion) {
      case 'dia':
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        };
        formatLabel = (doc) => `${doc._id.day}/${doc._id.month}/${doc._id.year}`;
        break;

      case 'semana':
        groupBy = {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" }
        };
        formatLabel = (doc) => `Sem ${doc._id.week} ${doc._id.year}`;
        break;

      case 'mes':
      default:
        groupBy = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        };
        formatLabel = (doc) => {
          const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          return `${meses[doc._id.month - 1]} ${doc._id.year}`;
        };
    }

    const ventas = await Order.aggregate([
      { $match: { createdAt: { $gte: inicio, $lte: fin } } },
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

    res.json({
      datos: resultado,
      rangoFechas: { fechaInicio, fechaFin },
      agrupacion: agrupacion || 'mes'
    });
  } catch (error) {
    console.error("Error obteniendo ventas por período:", error);
    res.status(500).json({ error: "Error al obtener ventas por período" });
  }
};

////////////////////////////////////////////////////////////// PRODUCTOS MÁS VENDIDOS CON RANGO DE FECHAS //////////////////////////////////////////////////////////////
export const getProductosMasVendidos = async (req, res) => {
  try {
    const { limite, fechaInicio, fechaFin } = req.query;
    const maxProductos = parseInt(limite) || 5;

    // Construir el filtro de fechas
    let filtroFechas = {};
    if (fechaInicio && fechaFin) {
      filtroFechas = {
        createdAt: {
          $gte: new Date(fechaInicio),
          $lte: new Date(new Date(fechaFin).setHours(23, 59, 59, 999))
        }
      };
    }

    const productos = await Order.aggregate([
      { $match: filtroFechas },
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

    res.json({
      productos: resultado,
      rangoFechas: fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null
    });
  } catch (error) {
    console.error("Error obteniendo productos más vendidos:", error);
    res.status(500).json({ error: "Error al obtener productos más vendidos" });
  }
};

////////////////////////////////////////////////////////////// ANÁLISIS FINANCIERO CON RANGO DE FECHAS //////////////////////////////////////////////////////////////
export const getAnalisisFinanciero = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Se requieren fechaInicio y fechaFin" });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(new Date(fechaFin).setHours(23, 59, 59, 999));

    // Ingresos por día en el rango seleccionado
    const ingresosDiarios = await Order.aggregate([
      { $match: { createdAt: { $gte: inicio, $lte: fin } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          ingresos: { $sum: "$totalPrice" },
          pedidos: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // Total del período seleccionado
    const totalPeriodo = await Order.aggregate([
      { $match: { createdAt: { $gte: inicio, $lte: fin } } },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$totalPrice" },
          pedidos: { $sum: 1 }
        } 
      }
    ]);

    // Calcular período anterior del mismo tamaño para comparación
    const diasDiferencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    const inicioPeriodoAnterior = new Date(inicio);
    inicioPeriodoAnterior.setDate(inicio.getDate() - diasDiferencia);
    const finPeriodoAnterior = new Date(inicio);
    finPeriodoAnterior.setDate(inicio.getDate() - 1);

    const totalPeriodoAnterior = await Order.aggregate([
      { $match: { createdAt: { $gte: inicioPeriodoAnterior, $lte: finPeriodoAnterior } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalActual = totalPeriodo[0]?.total || 0;
    const totalAnterior = totalPeriodoAnterior[0]?.total || 0;
    const porcentajeCambio = totalAnterior > 0 
      ? ((totalActual - totalAnterior) / totalAnterior * 100).toFixed(2)
      : 0;

    res.json({
      ingresosDiarios: ingresosDiarios.map(d => ({
        fecha: `${d._id.day}/${d._id.month}/${d._id.year}`,
        ingresos: d.ingresos,
        pedidos: d.pedidos
      })),
      comparativa: {
        periodoActual: totalActual,
        periodoAnterior: totalAnterior,
        pedidosPeriodoActual: totalPeriodo[0]?.pedidos || 0,
        porcentajeCambio: parseFloat(porcentajeCambio),
        tendencia: porcentajeCambio >= 0 ? 'positiva' : 'negativa'
      },
      rangoFechas: { fechaInicio, fechaFin }
    });
  } catch (error) {
    console.error("Error obteniendo análisis financiero:", error);
    res.status(500).json({ error: "Error al obtener análisis financiero" });
  }
};

////////////////////////////////////////////////////////////// REPORTE COMPLETO CON RANGO DE FECHAS //////////////////////////////////////////////////////////////
export const getReporteCompleto = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Construir el filtro de fechas
    let filtroFechas = {};
    if (fechaInicio && fechaFin) {
      filtroFechas = {
        createdAt: {
          $gte: new Date(fechaInicio),
          $lte: new Date(new Date(fechaFin).setHours(23, 59, 59, 999))
        }
      };
    }

    // Obtener todas las estadísticas necesarias
    const [statsGenerales, ventasMensuales, topProductos, analisisPeriodo] = await Promise.all([
      // Stats generales del período
      Order.aggregate([
        { $match: filtroFechas },
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
      
      // Ventas agrupadas por mes en el rango
      Order.aggregate([
        { $match: filtroFechas },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            total: { $sum: "$totalPrice" },
            cantidad: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      
      // Top 5 productos del período
      Order.aggregate([
        { $match: filtroFechas },
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
      
      // Análisis del período seleccionado
      Order.aggregate([
        { $match: filtroFechas },
        {
          $group: {
            _id: null,
            totalPeriodo: { $sum: "$totalPrice" },
            pedidosPeriodo: { $sum: 1 },
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
      periodoSeleccionado: analisisPeriodo[0] || {
        totalPeriodo: 0,
        pedidosPeriodo: 0,
        promedioTicket: 0
      },
      rangoFechas: fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null
    });
  } catch (error) {
    console.error("Error obteniendo reporte completo:", error);
    res.status(500).json({ error: "Error al obtener reporte completo" });
  }
};

////////////////////////////////////////////////////////////// GENERAR REPORTE PDF CON RANGO DE FECHAS //////////////////////////////////////////////////////////////
export const generarReportePDF = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Construir el filtro de fechas
    let filtroFechas = {};
    let textoRango = 'Histórico Completo';
    
    if (fechaInicio && fechaFin) {
      filtroFechas = {
        createdAt: {
          $gte: new Date(fechaInicio),
          $lte: new Date(new Date(fechaFin).setHours(23, 59, 59, 999))
        }
      };
      
      const inicio = new Date(fechaInicio).toLocaleDateString('es-CO');
      const fin = new Date(fechaFin).toLocaleDateString('es-CO');
      textoRango = `Del ${inicio} al ${fin}`;
    }

    // Obtener datos del reporte con el filtro de fechas
    const statsGenerales = await Order.aggregate([
      { $match: filtroFechas },
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

    // Top productos con filtro de fechas
    const topProductos = await Order.aggregate([
      { $match: filtroFechas },
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

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Disposition', 'attachment; filename=reporte-vandalo-grill.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Logo (con más espacio)
    const logoPath = path.join(process.cwd(), 'img', 'LOGOO.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 250, 40, { width: 100 });
      doc.moveDown(6);
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

    // NUEVO: Rango de fechas del reporte
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#f59e0b')
      .text(`Período: ${textoRango}`, { align: 'center' })
      .moveDown(0.5);

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

    // ===== SECCIÓN 2: PRODUCTOS MÁS VENDIDOS =====
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('TOP 5 PRODUCTOS MAS VENDIDOS', { underline: true })
      .moveDown(1);

    if (topProductos.length > 0) {
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
    } else {
      doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#666666')
        .text('No hay datos de productos en el período seleccionado', 70);
    }

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