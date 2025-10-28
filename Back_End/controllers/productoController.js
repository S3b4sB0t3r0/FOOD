import Producto from '../models/Producto.js';

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

////////////////////////////////////////////////////////////// ACTUALIZACION AUTOMATICA DE ESTADOS DE PRODUCTOS //////////////////////////////////////////////////////////////
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizamos los campos recibidos
    Object.assign(producto, data);

    // Si el stock es 0, forzamos estado a false
    if (producto.stock === 0) {
      producto.estado = false;
    }

    await producto.save();

    res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

////////////////////////////////////////////////////////////// CREAR UN NUEVO PRODUCTO //////////////////////////////////////////////////////////////
export const createProducto = async (req, res) => {
  try {
    const data = req.body;

    // Validación básica (puedes mejorarla si gustas)
    if (!data.title || !data.description || !data.price || !data.category || !data.unidad) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Si no se proporciona el campo `estado`, lo activamos por defecto
    if (data.stock === 0) {
      data.estado = false;
    } else {
      data.estado = true;
    }

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
    const updates = req.body; // Se espera un array de productos [{ _id, title, price, ... }]

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Debe enviar un arreglo de productos para actualizar.' });
    }

    // Creamos las operaciones en bloque
    const bulkOps = updates.map((prod) => {
      if (!prod._id) {
        // Si no tiene _id, se puede crear nuevo producto
        return {
          insertOne: { document: { ...prod, estado: prod.stock === 0 ? false : true } }
        };
      } else {
        // Si tiene _id, se actualiza
        return {
          updateOne: {
            filter: { _id: prod._id },
            update: {
              $set: {
                ...prod,
                estado: prod.stock === 0 ? false : true // regla automática
              }
            }
          }
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

