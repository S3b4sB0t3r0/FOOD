import Order from '../models/Order.js';
import Producto from '../models/Producto.js';
import Movimiento from '../models/Movimiento.js';
import { enviarCorreoPedido } from '../services/emailService.js';
import mongoose from 'mongoose';

//////////////////////////////////////////////////////////////// EMPLEADOS: OBTENER TODAS LAS ÓRDENES////////////////////////////////////////////////////////////////
export const getAllOrdersEmployee = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    // Filtro opcional por estado
    const filter = status ? { status: status.toLowerCase() } : {};
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Order.countDocuments(filter);

    const formattedOrders = orders.map(order => ({
      id: order._id,
      customer: order.customerEmail,
      items: order.items,
      itemsSummary: order.items.map(item => `${item.title} x${item.quantity}`).join(', '),
      total: order.totalPrice,
      status: order.status,
      orderDescription: order.orderDescription,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      time: new Date(order.createdAt).toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    }));

    res.status(200).json({ 
      success: true,
      orders: formattedOrders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener órdenes (empleado):', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener las órdenes.' 
    });
  }
};

////////////////////////////////////////////////////////////////// EMPLEADOS: EDITAR ORDEN COMPLETA////////////////////////////////////////////////////////////////
export const editOrderEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    items, // [{ id, title, quantity, price }]
    totalPrice,
    orderDescription,
    status,
    customerEmail,
    sendEmail = false,
  } = req.body;

  //console.log("🔥 Entrando a editOrderEmployee");
  //console.log("🆔 ID pedido:", id);
  //console.log("📩 Body recibido:", req.body);

  // Validaciones básicas
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "ID de pedido no válido." });
  }

  const estadosPermitidos = ["pendiente", "preparando", "entregado", "cancelado"];
  if (status && !estadosPermitidos.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Estado inválido. Los permitidos son: ${estadosPermitidos.join(", ")}`,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Buscar la orden existente
    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Pedido no encontrado." });
    }

    const prevStatus = order.status;
    //console.log("🔁 Estado anterior:", prevStatus);

    // === EDITAR ITEMS Y STOCK SI CAMBIARON ===
    let movimientos = [];

    if (items && Array.isArray(items) && items.length > 0) {
      //console.log("🛠️ Actualizando productos...");

      const previousItems = order.items.map(item => ({
        id: item.id || item._id,
        title: item.title,
        quantity: item.quantity,
      }));

      // Validar productos y stock
      for (const item of items) {
        const producto = await Producto.findById(item.id).session(session);
        if (!producto) {
          throw new Error(`Producto no encontrado: ${item.title}`);
        }

        const oldItem = previousItems.find(i => i.id.toString() === item.id.toString());
        const cantidadAnterior = oldItem ? oldItem.quantity : 0;
        const diferencia = item.quantity - cantidadAnterior;

        // Si aumenta cantidad → verificar stock disponible
        if (diferencia > 0 && producto.stock < diferencia) {
          throw new Error(`Stock insuficiente para ${item.title}. Disponible: ${producto.stock}`);
        }

        // Aplicar diferencias
        if (diferencia !== 0) {
          await Producto.findByIdAndUpdate(
            item.id,
            { $inc: { stock: -diferencia } },
            { new: true, session }
          );

          movimientos.push({
            productoId: item.id,
            nombre: item.title,
            cantidad: Math.abs(diferencia),
            tipo: diferencia > 0 ? "SALIDA" : "ENTRADA",
            fecha: new Date(),
            referencia: id,
          });

          // //console.log(
          //   diferencia > 0
          //     ? `📉 Disminuyendo ${diferencia} unidades de ${item.title}`
          //     : `📈 Aumentando ${Math.abs(diferencia)} unidades de ${item.title}`
          // //);
        }
      }

      // Detectar productos eliminados
      const productosEliminados = previousItems.filter(
        prev => !items.some(curr => curr.id.toString() === prev.id.toString())
      );

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
      //  console.log(`♻️ Producto eliminado: ${eliminado.title} — stock devuelto`);
      }

      // Actualizar pedido
      order.items = items;
    }

    // Actualizar otros datos del pedido
    if (totalPrice) order.totalPrice = totalPrice;
    if (orderDescription) order.orderDescription = orderDescription;
    if (customerEmail) order.customerEmail = customerEmail;
    if (status) order.status = status.toLowerCase();
    order.updatedAt = new Date();

    // === 🟢 LÓGICA PARA ENTREGADO ===
    if (status && status.toLowerCase() === "entregado" && prevStatus !== "entregado") {
      //console.log("✅ Pedido marcado como ENTREGADO → registrando SALIDAS...");

      for (const item of order.items) {
        const producto = await Producto.findById(item.id).session(session);
        if (!producto) continue;

        if (producto.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.title}. Disponible: ${producto.stock}`);
        }

        await Producto.findByIdAndUpdate(
          item.id,
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );

        movimientos.push({
          productoId: item.id,
          nombre: item.title,
          cantidad: item.quantity,
          tipo: "SALIDA",
          fecha: new Date(),
          referencia: id,
        });

       // console.log(`📦 Salida registrada por entrega: ${item.title} (-${item.quantity})`);
      }
    }

    // === 🔴 LÓGICA PARA CANCELADO ===
    if (status && status.toLowerCase() === "cancelado" && prevStatus === "entregado") {
     // console.log("♻️ Pedido cancelado tras entrega → registrando ENTRADAS...");

      for (const item of order.items) {
        const producto = await Producto.findById(item.id).session(session);
        if (!producto) continue;

        await Producto.findByIdAndUpdate(
          item.id,
          { $inc: { stock: item.quantity } },
          { new: true, session }
        );

        movimientos.push({
          productoId: item.id,
          nombre: item.title,
          cantidad: item.quantity,
          tipo: "ENTRADA",
          fecha: new Date(),
          referencia: id,
        });

      //  console.log(`📈 Stock devuelto por cancelación: ${item.title} (+${item.quantity})`);
      }
    }

    // === Guardar pedido actualizado ===
    await order.save({ session });

    // === Registrar movimientos si los hay ===
    if (movimientos.length > 0) {
      await Movimiento.insertMany(movimientos, { session });
     // console.log(`🧾 ${movimientos.length} movimientos registrados.`);
    }

    await session.commitTransaction();
    session.endSession();

    // Enviar correo si se requiere
    if (sendEmail && customerEmail) {
      try {
        await enviarCorreoPedido(
          customerEmail,
          orderDescription || "Tu pedido ha sido actualizado",
          totalPrice
        );
      } catch (err) {
        console.warn("⚠️ No se pudo enviar el correo:", err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Pedido actualizado correctamente.",
      order,
      movimientosRegistrados: movimientos.length,
    });

  //  console.log("✅ Transacción finalizada correctamente.");

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error al editar pedido (empleado):", error);
    res.status(500).json({
      success: false,
      message: "Error al editar el pedido.",
      error: error.message,
    });
  }
};

////////////////////////////////////////////////////////////////// EMPLEADOS: CREAR NUEVA ORDEN////////////////////////////////////////////////////////////////
export const createOrderEmployee = async (req, res) => {
  const { 
    items, // [{ id, title, quantity, price }]
    totalPrice, 
    orderDescription, 
    status, 
    customerEmail,
    sendEmail = true
  } = req.body;

  console.log("🧾 Creando orden de empleado...");
  console.log("📩 Datos recibidos:", req.body);

  // Validaciones
  if (!items?.length || !totalPrice || !orderDescription || !customerEmail) {
    return res.status(400).json({ 
      success: false,
      message: 'Faltan datos requeridos (items, totalPrice, orderDescription, customerEmail).' 
    });
  }

  // Validar estado
  const estadosPermitidos = ["pendiente", "preparando", "entregado", "cancelado"];
  if (status && !estadosPermitidos.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Estado inválido. Los permitidos son: ${estadosPermitidos.join(", ")}`,
    });
  }

  // Validar formato de items
  for (const item of items) {
    if (!item.id || !item.title || !item.quantity || !item.price) {
      return res.status(400).json({ 
        success: false,
        message: `Producto incompleto: ${JSON.stringify(item)}` 
      });
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Verificar que los productos existan (pero NO descontar stock)
    for (const item of items) {
      const producto = await Producto.findById(item.id).session(session);
      if (!producto) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Producto no encontrado: ${item.title}.`,
        });
      }
    }

    // ✅ Crear la orden (sin tocar el stock ni registrar movimientos)
    const newOrder = new Order({
      items,
      totalPrice,
      orderDescription,
      status: status ? status.toLowerCase() : 'pendiente',
      customerEmail,
    });

    await newOrder.save({ session });

    // Confirmar transacción
    await session.commitTransaction();
    session.endSession();

    // 📧 Enviar correo si se solicita
    if (sendEmail) {
      try {
        await enviarCorreoPedido(customerEmail, orderDescription, totalPrice);
      } catch (err) {
        console.warn("⚠️ No se pudo enviar el correo:", err.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Pedido creado correctamente por empleado (sin afectar stock).',
      order: newOrder,
    });

    console.log("✅ Pedido creado correctamente sin modificar stock.");

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Error al crear pedido (empleado):', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear el pedido.' 
    });
  }
};


//////////////////////////////////////////////////////////////// // EMPLEADOS: OBTENER ORDEN POR ID ////////////////////////////////////////////////////////////////
export const getOrderByIdEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: "ID de pedido no válido." 
      });
    }

    // Buscar orden
    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Pedido no encontrado.' 
      });
    }

    // Obtener movimientos relacionados
    const movimientos = await Movimiento.find({ 
      referencia: id 
    }).sort({ fecha: -1 }).lean();

    // Formatear respuesta
    const formattedOrder = {
      id: order._id,
      customer: order.customerEmail,
      items: order.items,
      itemsSummary: order.items.map(item => `${item.title} x${item.quantity}`).join(', '),
      total: order.totalPrice,
      status: order.status,
      orderDescription: order.orderDescription,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      time: new Date(order.createdAt).toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      movimientos: movimientos.map(mov => ({
        id: mov._id,
        producto: mov.nombre,
        cantidad: mov.cantidad,
        tipo: mov.tipo,
        fecha: new Date(mov.fecha).toLocaleString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      }))
    };

    res.status(200).json({ 
      success: true,
      order: formattedOrder 
    });

  } catch (error) {
    console.error('❌ Error al obtener orden por ID (empleado):', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener el pedido.' 
    });
  }
};

//////////////////////////////////////////////////////////////// // EMPLEADOS: ELIMINAR ORDEN Y REPONER STOCK ////////////////////////////////////////////////////////////////
export const deleteOrderEmployee = async (req, res) => {
  const { id } = req.params;

  // Validar ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false,
      message: "ID de pedido no válido." 
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Buscar la orden
    const order = await Order.findById(id).session(session);
    
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        success: false,
        message: 'Pedido no encontrado.' 
      });
    }

    // Reponer stock de todos los productos
    const movimientos = [];
    for (const item of order.items) {
      const producto = await Producto.findById(item.id).session(session);
      
      if (producto) {
        // Reponer stock
        await Producto.findByIdAndUpdate(
          item.id,
          { $inc: { stock: item.quantity } },
          { new: true, session }
        );

        // Registrar movimiento de ENTRADA
        movimientos.push({
          productoId: item.id,
          nombre: item.title,
          cantidad: item.quantity,
          tipo: 'ENTRADA',
          fecha: new Date(),
          referencia: `CANCELACIÓN-${id}`,
        });
      }
    }

    // Registrar movimientos de reposición
    if (movimientos.length > 0) {
      await Movimiento.insertMany(movimientos, { session });
    }

    // Eliminar la orden
    await Order.findByIdAndDelete(id).session(session);

    // Confirmar transacción
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ 
      success: true,
      message: 'Pedido eliminado correctamente. Stock repuesto.',
      stockRepuesto: movimientos.length
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Error al eliminar pedido (empleado):', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar el pedido.' 
    });
  }
};