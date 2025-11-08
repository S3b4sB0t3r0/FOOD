import mongoose from "mongoose";

const movimientoSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ["ENTRADA", "SALIDA", "AJUSTE"], default: "SALIDA" },
  cantidad: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  referencia: { type: String }, // ID de la orden o motivo
});

const Movimiento = mongoose.model("Movimiento", movimientoSchema);
export default Movimiento;
