import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  estado: { type: Boolean, default: true },
  rol: { type: String, default: null }, // 'cliente' o 'administrador'
  token: { type: String, default: null },
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
