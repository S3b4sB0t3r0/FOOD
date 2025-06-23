import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String, // Puedes cambiar a Number si vas a hacer cálculos
  image: String,
  category: String,
  popular: Boolean,
  new: Boolean,
});

const Producto = mongoose.model('Producto', productoSchema, 'Productos');
export default Producto;
