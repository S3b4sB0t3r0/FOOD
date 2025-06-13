const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String, // Puedes cambiar a Number si vas a hacer cálculos
  image: String,
  category: String, // Ej: "Entradas", "Postres", etc.
  popular: Boolean,
  new: Boolean,
});

module.exports = mongoose.model('Producto', productoSchema, 'Productos');
