// controllers/orderController.js
import Order from '../models/Order.js';
import { enviarCorreoPedido } from '../services/emailService.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, orderDescription, status, customerEmail } = req.body;

    if (!items?.length || !totalPrice || !orderDescription || !customerEmail) {
      return res.status(400).json({ message: 'Faltan datos del pedido.' });
    }

    const newOrder = new Order({
      items,
      totalPrice,
      orderDescription,
      status: status || 'pendiente',
    });

    await newOrder.save();

    // Enviar correo de confirmación
    await enviarCorreoPedido(customerEmail, orderDescription, totalPrice);

    res.status(201).json({ message: 'Pedido creado correctamente y correo enviado.', order: newOrder });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
};
