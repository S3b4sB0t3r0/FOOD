import Order from '../models/Order.js';
import Producto from '../models/Producto.js';
import Movimiento from '../models/Movimiento.js';
import { enviarCorreoPedido } from '../services/emailService.js';
import mongoose from 'mongoose';

//////////////////////////////////////////////////////////////// CREACIÓN DE ORDEN //////////////////////////////////////////////////////////////
export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, orderDescription, status, customerEmail } = req.body;
    const userId = req.userId;

    if (!items?.length || !totalPrice || !orderDescription || !customerEmail || !userId) {
      return res.status(400).json({ message: 'Faltan datos del pedido.' });
    }

    const newOrder = new Order({
      user: userId,
      items,
      totalPrice,
      orderDescription,
      status: status || 'pendiente',
      customerEmail,
    });

    await newOrder.save();

    // Enviar correo de confirmación
    await enviarCorreoPedido(customerEmail, orderDescription, totalPrice);

    res.status(201).json({
      message: 'Pedido creado correctamente.',
      order: newOrder,
    });
  } catch (error) {
    console.error('❌ Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido.' });
  }
};

////////////////////////////////////////////////////////////// VER ORDENES USUARIO //////////////////////////////////////////////////////////////
export const getOrderUser = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'El correo electrónico es requerido.' });
    }

   //console.log(`Buscando órdenes para el correo: ${email}`);

    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No se encontraron órdenes para este correo.' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error al obtener las órdenes del usuario por email:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

////////////////////////////////////////////////////////////// VER ORDENES ADMIN  //////////////////////////////////////////////////////////////
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    const formattedOrders = orders.map(order => ({
      id: order._id,
      customer: order.customerEmail,
      items: order.items.map(item => `${item.title} x${item.quantity}`).join(', '),
      rawItems: order.items, // 🔥 ESTA LÍNEA ES CRÍTICA
      total: order.totalPrice,
      status: order.status,
      time: new Date(order.createdAt).toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      orderDescription: order.orderDescription, // 🔥 Y ESTA
    }));

    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error al obtener todas las órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

////////////////////////////////////////////////////////////// ACTUALIZAR ORDEN //////////////////////////////////////////////////////////////
export const updateOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status, orderDescription } = req.body;

    console.log("🔥 Entrando a updateOrder controlador");
    console.log("📦 ID recibido:", id);
    console.log("📩 Body recibido:", req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido." });
    }

    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    const prevStatus = order.status;
    console.log("🔁 Estado anterior:", prevStatus);

    if (status) order.status = status.toLowerCase();
    if (orderDescription) order.orderDescription = orderDescription;

    await order.save({ session });

    // 🟢 PASO CLAVE: Si pasa a ENTREGADO y antes no lo estaba
    if (status && status.toLowerCase() === "entregado" && prevStatus !== "entregado") {
      console.log("✅ Pedido marcado como ENTREGADO. Procesando movimientos de salida...");

      const movimientos = [];

      for (const item of order.items) {
        console.log("🔹 Procesando item:", item.title, "Cantidad:", item.quantity);

        const producto = await Producto.findById(item.id).session(session);
        if (!producto) {
          console.error("❌ Producto no encontrado:", item.id);
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Producto no encontrado: ${item.title}`,
          });
        }

        console.log("📦 Stock actual de", producto.title, ":", producto.stock);

        if (producto.stock < item.quantity) {
          console.warn(`⚠️ Stock insuficiente para ${producto.title}. Disponible: ${producto.stock}`);
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Stock insuficiente para el producto: ${item.title}.`,
          });
        }

        // Descontar stock
        const nuevoStock = producto.stock - item.quantity;
        await Producto.findByIdAndUpdate(
          item.id,
          { $set: { stock: nuevoStock } },
          { new: true, session }
        );

        console.log(`📉 Stock actualizado para ${producto.title}: ${nuevoStock}`);

        // Crear registro de movimiento
        movimientos.push({
          productoId: item.id,
          nombre: item.title,
          cantidad: item.quantity,
          tipo: "SALIDA",
          fecha: new Date(),
          referencia: order._id.toString(),
        });
      }

      console.log("🧾 Movimientos generados:", movimientos.length);
      if (movimientos.length > 0) {
        await Movimiento.insertMany(movimientos, { session });
        console.log("✅ Movimientos de salida registrados correctamente.");
      }
    }

    // 🔴 Si el pedido cambia a CANCELADO desde ENTREGADO → revertir stock
    if (status && status.toLowerCase() === "cancelado" && prevStatus === "entregado") {
      console.log("♻️ Pedido cancelado, reponiendo stock...");

      const movimientosEntrada = [];

      for (const item of order.items) {
        const producto = await Producto.findById(item.id).session(session);
        if (producto) {
          const nuevoStock = producto.stock + item.quantity;
          await Producto.findByIdAndUpdate(
            item.id,
            { $set: { stock: nuevoStock } },
            { new: true, session }
          );

          movimientosEntrada.push({
            productoId: item.id,
            nombre: item.title,
            cantidad: item.quantity,
            tipo: "ENTRADA",
            fecha: new Date(),
            referencia: order._id.toString(),
          });

          console.log(`📈 Stock restaurado para ${producto.title}: ${nuevoStock}`);
        }
      }

      if (movimientosEntrada.length > 0) {
        await Movimiento.insertMany(movimientosEntrada, { session });
        console.log("✅ Movimientos de entrada (cancelación) registrados.");
      }
    }

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Transacción completada correctamente.");

    res.status(200).json({
      message: "Pedido actualizado correctamente.",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error al actualizar pedido:", error);
    res.status(500).json({ message: "Error al actualizar el pedido." });
  }
};

////////////////////////////////////////////////////////////// ELIMINAR ORDEN //////////////////////////////////////////////////////////////
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado.' });
    }

    res.status(200).json({ message: 'Pedido eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el pedido.' });
  }
};

///////////////////////////////////////////////////////////////////// OBTENER CLIENTES FRECUENTES (POR PROMEDIO MENSUAL) /////////////////////////////////////////////////////////////////
export const getFrequentCustomers = async (req, res) => {
  try {
    const limit = 3;

    // Rango del mes actual
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const currentDay = now.getDate(); // Día actual del mes

    const frequentCustomers = await Order.aggregate([
      {
        // Filtrar solo pedidos del mes actual
        $match: {
          createdAt: { $gte: monthStart, $lt: monthEnd }
        }
      },
      {
        // Agrupar por cliente
        $group: {
          _id: "$customerEmail",
          monthlyOrders: { $sum: 1 },
          monthlySpent: { $sum: "$totalPrice" },
          lastOrder: { $max: "$createdAt" }
        }
      },
      {
        // Filtrar clientes que sí han comprado este mes
        $match: {
          monthlyOrders: { $gt: 0 }
        }
      },
      {
        // Calcular promedios
        $addFields: {
          averageDailyOrders: {
            $divide: ["$monthlyOrders", currentDay]
          },
          averageOrderValue: {
            $cond: [
              { $eq: ["$monthlyOrders", 0] },
              0,
              { $divide: ["$monthlySpent", "$monthlyOrders"] }
            ]
          }
        }
      },
      {
        // Ordenar por mayor promedio diario
        $sort: { averageDailyOrders: -1 }
      },
      {
        // Limitar a los primeros
        $limit: limit
      },
      {
        // Formatear salida
        $project: {
          _id: 0,
          customerEmail: "$_id",
          monthlyOrders: 1,
          monthlySpent: { $round: ["$monthlySpent", 2] },
          averageDailyOrders: { $round: ["$averageDailyOrders", 3] },
          averageOrderValue: { $round: ["$averageOrderValue", 2] },
          lastOrder: {
            $dateToString: {
              format: "%d/%m/%Y %H:%M",
              date: "$lastOrder",
              timezone: "America/Bogota"
            }
          }
        }
      }
    ]);

    if (frequentCustomers.length === 0) {
      return res.status(404).json({
        message: "No se encontraron pedidos este mes."
      });
    }

    res.status(200).json({
      message: "Top 3 clientes frecuentes del mes obtenidos correctamente.",
      total: frequentCustomers.length,
      customers: frequentCustomers
    });

  } catch (error) {
    console.error("❌ Error al obtener clientes frecuentes:", error);
    res.status(500).json({
      message: "Error al obtener los clientes frecuentes."
    });
  }
};

//////////////////////////////////////////////////////////////// OBTENER ESTADÍSTICAS DETALLADAS DE UN CLIENTE //////////////////////////////////////////////////////////////
export const getCustomerStats = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ 
        message: 'El correo electrónico es requerido.' 
      });
    }

    // Obtener todas las órdenes del cliente
    const orders = await Order.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron órdenes para este cliente.' 
      });
    }

    // Calcular estadísticas
    const stats = {
      customerEmail: email,
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      averageOrderValue: 0,
      firstOrder: orders[orders.length - 1].createdAt,
      lastOrder: orders[0].createdAt,
      ordersByStatus: {
        pendiente: 0,
        preparando: 0,
        entregado: 0,
        cancelado: 0
      },
      mostOrderedProducts: {}
    };

    // Calcular promedio
    stats.averageOrderValue = stats.totalSpent / stats.totalOrders;

    // Contar órdenes por estado
    orders.forEach(order => {
      if (stats.ordersByStatus.hasOwnProperty(order.status)) {
        stats.ordersByStatus[order.status]++;
      }

      // Contar productos más pedidos
      order.items.forEach(item => {
        if (stats.mostOrderedProducts[item.title]) {
          stats.mostOrderedProducts[item.title] += item.quantity;
        } else {
          stats.mostOrderedProducts[item.title] = item.quantity;
        }
      });
    });

    // Convertir productos más pedidos a array y ordenar
    const productArray = Object.entries(stats.mostOrderedProducts)
      .map(([product, quantity]) => ({ product, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5); // Top 5 productos

    stats.topProducts = productArray;
    delete stats.mostOrderedProducts;

    // Redondear valores
    stats.totalSpent = Math.round(stats.totalSpent * 100) / 100;
    stats.averageOrderValue = Math.round(stats.averageOrderValue * 100) / 100;

    res.status(200).json({
      message: 'Estadísticas del cliente obtenidas correctamente.',
      stats
    });

  } catch (error) {
    console.error('❌ Error al obtener estadísticas del cliente:', error);
    res.status(500).json({ 
      message: 'Error al obtener las estadísticas del cliente.' 
    });
  }
};

//////////////////////////////////////////////////////////////// EDITAR ORDEN COMPLETA (ADMIN / EMPLEADO) //////////////////////////////////////////////////////////////
export const editOrder = async (req, res) => {
  const { id } = req.params;
  const {
    items, // [{ id, title, quantity, price }]
    totalPrice,
    orderDescription,
    status,
    customerEmail,
    sendEmail = false, // opcional
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de pedido no válido." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    // Guardar copia del pedido anterior (para calcular diferencias)
    const previousItems = order.items.map(item => ({
      id: item.id || item._id,
      title: item.title,
      quantity: item.quantity,
    }));

    // Validar productos actuales (stock)
    for (const item of items) {
      const producto = await Producto.findById(item.id).session(session);
      if (!producto) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Producto no encontrado: ${item.title}` });
      }

      // Calcular diferencia de cantidad
      const oldItem = previousItems.find(i => i.id.toString() === item.id.toString());
      const cantidadAnterior = oldItem ? oldItem.quantity : 0;
      const diferencia = item.quantity - cantidadAnterior;

      // Si aumenta cantidad → verificar stock disponible
      if (diferencia > 0 && producto.stock < diferencia) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Stock insuficiente para ${item.title}. Disponible: ${producto.stock}`,
        });
      }
    }

    // === Actualizar stock según diferencias ===
    const movimientos = [];
    for (const item of items) {
      const producto = await Producto.findById(item.id).session(session);
      const oldItem = previousItems.find(i => i.id.toString() === item.id.toString());
      const cantidadAnterior = oldItem ? oldItem.quantity : 0;
      const diferencia = item.quantity - cantidadAnterior;

      // Aumenta cantidad -> SALIDA
      if (diferencia > 0) {
        await Producto.findByIdAndUpdate(
          item.id,
          { $inc: { stock: -diferencia } },
          { new: true, session }
        );

        movimientos.push({
          productoId: item.id,
          nombre: item.title,
          cantidad: diferencia,
          tipo: "SALIDA",
          fecha: new Date(),
          referencia: id,
        });
      }

      // Disminuye cantidad -> ENTRADA
      if (diferencia < 0) {
        await Producto.findByIdAndUpdate(
          item.id,
          { $inc: { stock: Math.abs(diferencia) } },
          { new: true, session }
        );

        movimientos.push({
          productoId: item.id,
          nombre: item.title,
          cantidad: Math.abs(diferencia),
          tipo: "ENTRADA",
          fecha: new Date(),
          referencia: id,
        });
      }
    }

    // Detectar productos eliminados del pedido
    const productosEliminados = previousItems.filter(
      prev => !items.some(curr => curr.id.toString() === prev.id.toString())
    );

    // Reponer stock de productos eliminados
    for (const eliminado of productosEliminados) {
      await Producto.findByIdAndUpdate(
        eliminado.id,
        { $inc: { stock: eliminado.quantity } },
        { session }
      );

      movimientos.push({
        productoId: eliminado.id,
        nombre: eliminado.title,
        cantidad: eliminado.quantity,
        tipo: "ENTRADA",
        fecha: new Date(),
        referencia: id,
      });
    }

    // === Actualizar pedido ===
    order.items = items;
    if (totalPrice !== undefined) order.totalPrice = totalPrice;
    if (orderDescription) order.orderDescription = orderDescription;
    if (status) order.status = status.toLowerCase();
    if (customerEmail) order.customerEmail = customerEmail;
    order.updatedAt = new Date();

    await order.save({ session });

    // === Registrar movimientos ===
    if (movimientos.length > 0) {
      await Movimiento.insertMany(movimientos, { session });
    }

    // === Confirmar transacción ===
    await session.commitTransaction();
    session.endSession();

    // === Enviar correo si se requiere ===
    if (sendEmail && customerEmail) {
      try {
        await enviarCorreoPedido(customerEmail, orderDescription || "Tu pedido fue actualizado", totalPrice);
      } catch (err) {
        console.warn("⚠️ No se pudo enviar el correo de actualización:", err.message);
      }
    }

    res.status(200).json({
      message: "Pedido actualizado correctamente.",
      order,
      movimientos: movimientos.length,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error al editar pedido:", error);
    res.status(500).json({ message: "Error al editar el pedido." });
  }
};

//////////////////////////////////////////////////////////////// CONFIRMAR ORDEN (CLIENTE) //////////////////////////////////////////////////////////////
export const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;

  //  console.log("✅ Cliente confirmando recepción de orden:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido." });
    }

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    // Solo se puede confirmar si el domiciliario lo marcó como "entregado"
    if (order.status !== 'entregado') {
      return res.status(400).json({ 
        message: `No se puede confirmar. El pedido está en estado: ${order.status}. Debe estar "entregado" primero.` 
      });
    }

    order.status = 'confirmado';
    await order.save();

    //console.log(`✅ Cliente confirmó recepción del pedido ${id}.`);

    res.status(200).json({
      message: "Has confirmado la recepción del pedido correctamente.",
      order
    });

  } catch (error) {
  //  console.error("❌ Error al confirmar pedido:", error);
    res.status(500).json({ message: "Error al confirmar el pedido." });
  }
};

//////////////////////////////////////////////////////////////// REPORTAR ORDEN (CLIENTE) //////////////////////////////////////////////////////////////
export const reportOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body; // Opcional: razón del reporte

    //console.log("⚠️ Cliente reportando problema con orden:", id);
    if (motivo) console.log("📝 Motivo del reporte:", motivo);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido." });
    }

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    // Solo se puede reportar si el domiciliario lo marcó como "entregado"
    if (order.status !== 'entregado') {
      return res.status(400).json({ 
        message: `No se puede reportar. El pedido está en estado: ${order.status}. Debe estar "entregado" primero.` 
      });
    }

    const previousStatus = order.status;
    order.status = 'reportado';
    
    // Guardar el motivo del reporte
    if (motivo) {
      order.orderDescription += `\n⚠️ [REPORTADO POR CLIENTE: ${motivo}]`;
    }

    await order.save();

    //console.log(`⚠️ Pedido ${id} reportado por el cliente. Estado anterior: ${previousStatus}`);

    res.status(200).json({
      message: "Has reportado un problema con el pedido. Nos pondremos en contacto contigo pronto.",
      order,
      previousStatus
    });

  } catch (error) {
   // console.error("❌ Error al reportar pedido:", error);
    res.status(500).json({ message: "Error al reportar el pedido." });
  }
};