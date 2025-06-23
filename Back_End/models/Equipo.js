import mongoose from 'mongoose';

const equipoSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
  description: String,
});

const Equipo = mongoose.model('Equipo', equipoSchema, 'Equipo');
export default Equipo;
