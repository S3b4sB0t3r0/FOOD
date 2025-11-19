import mongoose from "mongoose";

const IngredienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  categoria: {
    type: String,
    enum: ["Ingrediente", "Bebida", "Insumo"],
    default: "Ingrediente",
    required: true
  },

  stock: {
    type: Number,
    required: true,
    min: 0
  },

  unidad: {
    type: String,
    enum: ["kg", "g", "l", "ml", "unidad", "paquete"],
    required: true
  },

  fechaVencimiento: {
    type: Date,
    required: false
  },

  estado: {
    type: String,
    enum: ["activo", "proximo-a-vencer", "vencido"],
    default: "activo"
  },

  ultimaActualizacion: {
    type: Date,
    default: Date.now
  },

  sede: {
    type: String,
    required: false
  }
});

// Middleware para actualizar el estado y fecha de actualización
IngredienteSchema.pre("save", function (next) {
  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + 7); // productos próximos a vencer en 7 días

  if (this.fechaVencimiento) {
    if (this.fechaVencimiento < hoy) {
      this.estado = "vencido";
    } else if (this.fechaVencimiento <= limite) {
      this.estado = "proximo-a-vencer";
    } else {
      this.estado = "activo";
    }
  }

  this.ultimaActualizacion = Date.now();
  next();
});

const Ingrediente = mongoose.model("Ingrediente", IngredienteSchema, "Ingredientes");
export default Ingrediente;
