import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  estado: { type: Boolean, default: true },
  rol: { type: String, default: null },
  token: { type: String, default: null },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
