const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// GET /api/menu
router.get('/menu', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
