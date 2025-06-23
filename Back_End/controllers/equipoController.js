import Equipo from '../models/Equipo.js';

export const getEquipo = async (req, res) => {
  try {
    const equipo = await Equipo.find();
    res.status(200).json(equipo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el equipo', error });
  }
};
