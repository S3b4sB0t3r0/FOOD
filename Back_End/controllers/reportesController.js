import Order from '../models/Order.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

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


// Generar PDF
export const generarReportePDF = async (req, res) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
  
      res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);
  
      const logoPath = path.join(process.cwd(), 'img', 'LOGOO.png');

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, {
          fit: [100, 100],
          align: 'center',
          valign: 'center'
        });
      }
  
      // Espacio debajo del logo
      doc.moveDown(1);
  
      // Título
      doc
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('Reporte de Estadísticas - El Vándalo Grill', { align: 'center' })
        .moveDown(1);
  
      // Info empresa
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Cra 4 Este #39-02sur, San Cristóbal, Bogotá', { align: 'center' })
        .text('Tel: 57 314 577 3241', { align: 'center' })
        .text('elvandalogrillcolombia@gmail.com', { align: 'center' })
        .moveDown(2);
  
      // Línea separadora
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(2);
  
      // Ejemplo de datos (aquí usas los reales)
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Ventas Totales:', { continued: true })
        .font('Helvetica')
        .text(' $136,600');
  
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Total Pedidos:', { continued: true })
        .font('Helvetica')
        .text(' 2');
  
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Usuarios Registrados:', { continued: true })
        .font('Helvetica')
        .text(' 6');
  
      doc.moveDown(2);
  
      // Fecha de generación
      const fecha = new Date().toLocaleString();
      doc
        .fontSize(10)
        .text(`Generado el: ${fecha}`, { align: 'right' });
  
      doc.end();
    } catch (err) {
      console.error('Error generando PDF:', err);
      res.status(500).json({ message: 'Error generando PDF' });
    }
  };
  