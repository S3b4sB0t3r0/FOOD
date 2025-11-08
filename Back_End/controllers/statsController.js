import Order from '../models/Order.js';
import User from '../models/User.js';
import Producto from '../models/Producto.js';

////////////////////////////////////////////////////////////// TENDENCIAS DE VENTAS //////////////////////////////////////////////////////////////
export const getTendenciaVentas = async (req, res) => {
  try {
    const ventas = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const resultado = ventas.map(v => ({
      mes: v._id.month,
      total: v.total
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error obteniendo tendencia de ventas:", error);
    res.status(500).json({ error: "Error al obtener la tendencia de ventas" });
  }
};

////////////////////////////////////////////////////////////// VENTAS DEL DIA //////////////////////////////////////////////////////////////
export const getVentasHoy = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ventasHoy = await Order.aggregate([
      { $match: { createdAt: { $gte: hoy } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({ total: ventasHoy[0]?.total || 0 });
  } catch (error) {
    console.error("Error obteniendo ventas de hoy:", error);
    res.status(500).json({ error: "Error al obtener ventas de hoy" });
  }
};

////////////////////////////////////////////////////////////// PEDIDOS DE HOY //////////////////////////////////////////////////////////////
export const getPedidosHoy = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const pedidos = await Order.countDocuments({ createdAt: { $gte: hoy } });

    res.json({ cantidad: pedidos });
  } catch (error) {
    console.error("Error obteniendo pedidos de hoy:", error);
    res.status(500).json({ error: "Error al obtener pedidos de hoy" });
  }
};

////////////////////////////////////////////////////////////// USUARIOS ACTIVOS //////////////////////////////////////////////////////////////
export const getUsuariosActivos = async (req, res) => {
    try {
      const mesAtras = new Date();
      mesAtras.setMonth(mesAtras.getMonth() - 1);
  
      // Obtener IDs únicos de usuarios que hicieron pedidos en el último mes
      const usuariosIds = await Order.distinct("user", {
        createdAt: { $gte: mesAtras }
      });
  
      // Buscar los datos de esos usuarios
      const usuarios = await User.find({ _id: { $in: usuariosIds } })
        .select("name correo estado rol");
  
      res.json({
        activos: usuarios.length,
        usuarios
      });
    } catch (error) {
      console.error("Error obteniendo usuarios activos:", error);
      res.status(500).json({ error: "Error al obtener usuarios activos" });
    }
  };

////////////////////////////////////////////////////////////// PRODUCTOS MAS VENDIDOS //////////////////////////////////////////////////////////////
export const getProductosMasVendidos = async (req, res) => {
  try {
    const productos = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.title",
          cantidad: { $sum: "$items.quantity" }
        }
      },
      { $sort: { cantidad: -1 } },
      { $limit: 5 }
    ]);

    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos más vendidos:", error);
    res.status(500).json({ error: "Error al obtener productos más vendidos" });
  }
};

////////////////////////////////////////////////////////////// INGRESOS POR MES //////////////////////////////////////////////////////////////
export const getIngresosMes = async (req, res) => {
    try {
      const ahora = new Date();
      const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
  
      const resultado = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: primerDia, $lte: ultimoDia }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" }
          }
        }
      ]);
  
      const total = resultado.length > 0 ? resultado[0].total : 0;
  
      res.json({ total });
    } catch (error) {
      console.error("Error obteniendo ingresos del mes:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

////////////////////////////////////////////////////////////// PEDIDOS POR DIA //////////////////////////////////////////////////////////////
  export const getPedidosPorDia = async (req, res) => {
    try {
      const pedidos = await Order.aggregate([
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            cantidad: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
  
      const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  
      const resultado = pedidos.map(p => ({
        dia: diasSemana[p._id - 1],
        cantidad: p.cantidad
      }));
  
      res.json(resultado);
    } catch (error) {
      console.error("Error obteniendo pedidos por día:", error);
      res.status(500).json({ error: "Error al obtener pedidos por día" });
    }
  };

////////////////////////////////////////////////////////////// HORAS PICO MAYOR VENTAS //////////////////////////////////////////////////////////////
export const getHorasPico = async (req, res) => {
    try {
      const horas = await Order.aggregate([
        {
          $group: {
            _id: { $hour: "$createdAt" }, 
            cantidad: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]);
  
      const resultado = horas.map(h => ({
        hora: `${h._id.toString().padStart(2, "0")}:00`,
        cantidad: h.cantidad
      }));
  
      res.json(resultado);
    } catch (error) {
      console.error("Error obteniendo horas pico:", error);
      res.status(500).json({ error: "Error al obtener horas pico" });
    }
};

////////////////////////////////////////////////////////////// PRODUCTOS CON BAJO STOCK  //////////////////////////////////////////////////////////////

export const getBajoStock = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 10; 
    const productos = await Producto.find({ stock: { $lt: limite } });
    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos con bajo stock:", error);
    res.status(500).json({ error: "Error al obtener productos con bajo stock" });
  }
};