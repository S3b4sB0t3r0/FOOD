import Order from '../models/Order.js';
import Producto from '../models/Producto.js';
import { enviarCorreoPedido } from '../services/emailService.js';
import mongoose from 'mongoose';

////////////////////////////////////////////////////////////// CREACION DE ORDEN //////////////////////////////////////////////////////////////
export const createOrder = async (req, res) => {
  const { items, totalPrice, orderDescription, status, customerEmail } = req.body;
  const userId = req.userId; 

  if (!items?.length || !totalPrice || !orderDescription || !customerEmail || !userId) {
    return res.status(400).json({ message: 'Faltan datos del pedido.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of items) {
      const producto = await Producto.findById(item.id).session(session);

      if (!producto || producto.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Stock insuficiente para el producto: ${item.title}.`,
        });
      }
    }

    for (const item of items) {
      await Producto.findByIdAndUpdate(
        item.id,
        {
          $inc: { stock: -item.quantity },
        },
        { new: true, session: session }
      );
    }

    const newOrder = new Order({
      user: userId, 
      items,
      totalPrice,
      orderDescription,
      status: status || 'pendiente',
      customerEmail,
    });

    await newOrder.save({ session: session });

    await session.commitTransaction();
    session.endSession();

    await enviarCorreoPedido(customerEmail, orderDescription, totalPrice);

    res.status(201).json({ message: 'Pedido creado correctamente y correo enviado.', order: newOrder });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
};

////////////////////////////////////////////////////////////// VER ORDENES USUARIO //////////////////////////////////////////////////////////////
export const getOrderUser = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'El correo electrónico es requerido.' });
    }

   console.log(`Buscando órdenes para el correo: ${email}`);

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
      total: order.totalPrice,
      status: order.status,
      time: new Date(order.createdAt).toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    }));

    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error al obtener todas las órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

////////////////////////////////////////////////////////////// ACTUALIZAR ORDEN //////////////////////////////////////////////////////////////
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, orderDescription } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de pedido no válido." });
    }

    // Validar campos obligatorios
    if (!status && !orderDescription) {
      return res.status(400).json({
        message: "Debes enviar al menos un campo para actualizar.",
      });
    }

    // Validar estado permitido
    const estadosPermitidos = ["pendiente", "preparando", "entregado", "cancelado"];
    if (status && !estadosPermitidos.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: `Estado inválido. Los permitidos son: ${estadosPermitidos.join(", ")}`,
      });
    }

    // Actualizar pedido
    const order = await Order.findByIdAndUpdate(
      id,
      {
        ...(status && { status: status.toLowerCase() }),
        ...(orderDescription && { orderDescription }),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    res.status(200).json({
      message: "Pedido actualizado correctamente.",
      order,
    });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
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
