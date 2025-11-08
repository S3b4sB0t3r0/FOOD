import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/Order.js";  // ajusta el path según tu estructura
import Movimiento from "../models/Movimiento.js";

dotenv.config();

// 🔧 Conéctate a la base de datos
const MONGO_URI = process.env.MONGO_URI ;

async function generarHistorial() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const orders = await Order.find({}, { items: 1, createdAt: 1 });

    if (!orders.length) {
      console.log("⚠️ No se encontraron órdenes.");
      return;
    }

    const movimientos = [];

    for (const order of orders) {
      for (const item of order.items) {
        movimientos.push({
          productoId: item.id, // ID del producto en el modelo
          nombre: item.title,
          cantidad: item.quantity,
          tipo: "SALIDA",
          fecha: order.createdAt,
          referencia: order._id.toString(),
        });
      }
    }

    // Insertar en bloque
    await Movimiento.insertMany(movimientos);
    console.log(`✅ ${movimientos.length} movimientos creados desde las órdenes existentes.`);

  } catch (err) {
    console.error("❌ Error generando historial:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
}

generarHistorial();
