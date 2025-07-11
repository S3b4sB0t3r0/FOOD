import mongoose from 'mongoose';

const contactoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  asunto: {
    type: String,
    required: true,
    enum: ["Pedido Especial", "Sugerencia", "Queja o Reclamo", "Felicitaciones", "Otro"],
  },
  mensaje: { type: String, required: true },
});

const Contacto = mongoose.model('Contacto', contactoSchema);
export default Contacto;
