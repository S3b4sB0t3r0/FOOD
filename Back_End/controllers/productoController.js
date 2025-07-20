import Producto from '../models/Producto.js';

// Traer todos los productos 
export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

// cambio de estado de los productos

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

// Actualizar un producto (incluye cambio automático de estado si stock llega a 0)
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
