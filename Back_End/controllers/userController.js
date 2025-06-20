import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, correo, contraseña } = req.body;

    // Validaciones básicas
    if (!name || !correo || !contraseña) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Determinar rol basado en dominio del correo
    const domain = correo.split('@')[1];
    const rol = domain === 'vandalo.com' ? 'administrador' : 'cliente';

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const newUser = new User({
      name,
      correo,
      contraseña: hashedPassword,
      estado: true,
      rol,
      token: null
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const user = await User.findOne({ correo, estado: true });
    if (!user) {
      return res.status(404).json({ message: 'Correo o contraseña inválidos' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña inválidos' });
    }

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET || 'secreto', // define en tu .env
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        correo: user.correo,
        rol: user.rol
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
