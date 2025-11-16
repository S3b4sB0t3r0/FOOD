import Producto from '../models/Producto.js';
import Movimiento from '../models/Movimiento.js';
import mongoose from 'mongoose';

////////////////////////////////////////////////////////////// MOSTRAR PRODUCTOS //////////////////////////////////////////////////////////////
export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

////////////////////////////////////////////////////////////// MOSTRAR PRODUCTOS CLIENTE //////////////////////////////////////////////////////////////
export const getClienteProductos = async (req, res) => {
  try {
    const productos = await Producto.find({ estado: true });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

////////////////////////////////////////////////////////////// CAMBIO DE ESTADO DE PRODUCTO //////////////////////////////////////////////////////////////
export const toggleEstadoProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    producto.estado = !producto.estado;
    await producto.save();

    res.json({
      message: `Estado cambiado a ${producto.estado ? 'Activo' : 'Inactivo'}`,
      producto: {
        id: producto._id,
        title: producto.title,
        estado: producto.estado
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado del producto' });
  }
};

////////////////////////////////////////////////////////////// ACTUALIZAR PRODUCTO (con registro de ENTRADA si aumenta stock) //////////////////////////////////////////////////////////////
export const updateProducto = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const data = req.body;

    const producto = await Producto.findById(id).session(session);
    if (!producto) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const stockAnterior = producto.stock;
    const stockNuevo = data.stock !== undefined ? Number(data.stock) : stockAnterior;

    // Actualizar campos recibidos
    Object.assign(producto, data);

    // Si el stock es 0, forzamos estado = false
    if (producto.stock === 0) {
      producto.estado = false;
    } else {
      producto.estado = true;
    }

    await producto.save({ session });

    ///////////////////////////////////////////////////////////
    // 🟢 Registrar movimiento si el stock AUMENTA
    ///////////////////////////////////////////////////////////
    const diferencia = stockNuevo - stockAnterior;
    if (diferencia > 0) {
      const movimiento = new Movimiento({
        productoId: producto._id,
        nombre: producto.title,
        cantidad: diferencia,
        tipo: 'ENTRADA',
        fecha: new Date(),
        referencia: 'AJUSTE_MANUAL', // puedes cambiar a "actualización de producto" o un ID de lote
      });

      await movimiento.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Producto actualizado correctamente',
      producto,
      movimientoRegistrado: diferencia > 0 ? true : false,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

////////////////////////////////////////////////////////////// CREAR UN NUEVO PRODUCTO //////////////////////////////////////////////////////////////
export const createProducto = async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.description || !data.price || !data.category || !data.unidad) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    data.estado = data.stock > 0;

    const nuevoProducto = new Producto(data);
    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};

////////////////////////////////////////////////////////////// CARGA MASIVA DE PRODUCTOS //////////////////////////////////////////////////////////////
export const bulkUpdateProductos = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Debe enviar un arreglo de productos para actualizar.' });
    }

    const bulkOps = updates.map((prod) => {
      if (!prod._id) {
        return {
          insertOne: { document: { ...prod, estado: prod.stock === 0 ? false : true } },
        };
      } else {
        return {
          updateOne: {
            filter: { _id: prod._id },
            update: {
              $set: {
                ...prod,
                estado: prod.stock === 0 ? false : true,
              },
            },
          },
        };
      }
    });

    await Producto.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Carga masiva completada correctamente' });
  } catch (error) {
    console.error('Error en carga masiva:', error);
    res.status(500).json({ message: 'Error en la carga masiva de productos', error });
  }
};
