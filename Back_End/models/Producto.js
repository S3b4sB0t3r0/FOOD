import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String, // Puedes cambiar a Number si haces cálculos
  image: String,
  category: String,
  popular: Boolean,
  new: Boolean,
  stock: Number,
  minimo: Number,
  unidad: String,
  estado: {
    type: Boolean,
    default: true
  }
});

// Middleware que actualiza el estado automáticamente antes de guardar
productoSchema.pre('save', function (next) {
  if (this.stock <= 1) {
    this.estado = false;
  } else {
    this.estado = true;
  }
  next();
});

const Producto = mongoose.model('Producto', productoSchema, 'Productos');
export default Producto;
