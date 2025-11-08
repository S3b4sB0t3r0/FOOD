import Movimiento from "../models/Movimiento.js";

export const getMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.find().sort({ fecha: -1 });
    res.json(movimientos);
  } catch (error) {
    console.error("Error obteniendo movimientos:", error);
    res.status(500).json({ error: "Error al obtener historial de inventario" });
  }
};
