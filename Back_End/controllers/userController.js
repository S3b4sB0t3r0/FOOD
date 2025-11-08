import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { enviarCorreoRegistro, enviarCorreoRecuperacion } from '../services/emailService.js';

////////////////////////////////////////////////////////////// REGISTER //////////////////////////////////////////////////////////////
export const register = async (req, res) => {
  try {
    const { name, correo, contraseña } = req.body;

    // Validaciones básicas
    if (!name || !correo || !contraseña) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: 'El nombre solo puede contener letras y espacios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ message: 'El correo electrónico no es válido' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(contraseña)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
      });
    }

    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // 🔹 Asignación de roles según dominio
    const domain = correo.split('@')[1];
    let rol;

    if (domain === 'vandalo.com') {
      rol = 'administrador';
    } else if (domain === 'elvandalo.com') {
      rol = 'empleado';
    } else {
      rol = 'cliente';
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const newUser = new User({
      name,
      correo,
      contraseña: hashedPassword,
      estado: true,
      direccion: null,
      telefono: null,
      rol,
      token: null
    });

    await newUser.save();

    // Enviar correo de bienvenida
    await enviarCorreoRegistro(correo, name);

    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


////////////////////////////////////////////////////////////// LOGIN //////////////////////////////////////////////////////////////
export const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).json({ message: 'Correo o contraseña inválidos' });
    }

    // 🔹 Si está bloqueado
    if (!user.estado) {
      return res.status(403).json({
        message: 'La cuenta está bloqueada. Debe restablecer su contraseña para desbloquearla.'
      });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      user.intentosFallidos = (user.intentosFallidos || 0) + 1;

      if (user.intentosFallidos >= 3) {
        user.estado = false; // Bloqueamos la cuenta
      }

      await user.save();
      return res.status(401).json({ message: 'Correo o contraseña inválidos' });
    }

    // ✅ Si contraseña correcta → resetear intentos
    user.intentosFallidos = 0;
    await user.save();

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET || 'secreto',
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

////////////////////////////////////////////////////////////// PERIL DEL LA PERSONA //////////////////////////////////////////////////////////////
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado. Token no válido o inexistente.' });
    }

    const user = await User.findById(userId).select('-contraseña -__v');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

////////////////////////////////////////////////////////////// ACTUALIZAR PERFIL //////////////////////////////////////////////////////////////
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, correo, direccion, telefono } = req.body;

    if (!name || !correo) {
      return res.status(400).json({ message: 'Nombre y correo son obligatorios' });
    }

    const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: 'El nombre solo puede contener letras y espacios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ message: 'El correo electrónico no es válido' });
    }

    // Verifica si el correo ya existe en otro usuario
    const existingUser = await User.findOne({ correo, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este correo ya está en uso por otro usuario' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, correo, direccion, telefono },
      { new: true, runValidators: true, context: 'query' }
    ).select('-contraseña -__v');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Perfil actualizado correctamente', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

////////////////////////////////////////////////////////////// ACTUALIZAR CONTRASEÑA PERFIL //////////////////////////////////////////////////////////////
export const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { contraseñaActual, nuevaContraseña } = req.body;

    if (!contraseñaActual || !nuevaContraseña) {
      return res.status(400).json({ message: 'Ambas contraseñas son requeridas' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contraseñaActual, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(nuevaContraseña)) {
      return res.status(400).json({
        message:
          'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaContraseña, salt);

    user.contraseña = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

////////////////////////////////////////////////////////////// SOLICITAR RECUPERACION //////////////////////////////////////////////////////////////
export const solicitarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ message: 'El correo es obligatorio' });
    }

    const user = await User.findOne({ correo });

    if (!user) {
      return res.status(404).json({ message: 'El correo no está registrado' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.token = token;
    await user.save();

    await enviarCorreoRecuperacion(correo, user.name, token);

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
  }
};

////////////////////////////////////////////////////////////// CAMBIAR CONTRASEÑA TOKEN //////////////////////////////////////////////////////////////
export const cambiarPasswordToken = async (req, res) => {
  try {
    const { token, nuevaContraseña } = req.body;

    if (!token || !nuevaContraseña) {
      return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios' });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(nuevaContraseña)) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaContraseña, salt);

    //  Guardar nueva contraseña y desbloquear cuenta
    user.contraseña = hashedPassword;
    user.token = null;
    user.intentosFallidos = 0; 
    user.estado = true; 
    await user.save();

    res.status(200).json({
      message: 'Contraseña actualizada correctamente. La cuenta ha sido desbloqueada.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar la contraseña', error: error.message });
  }
};

////////////////////////////////////////////////////////////// VER TODOS LOS USUARIOS ADMIN //////////////////////////////////////////////////////////////
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-contraseña -__v -token');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

////////////////////////////////////////////////////////////// CAMBIO DE ESTADO DE PERFIL //////////////////////////////////////////////////////////////
export const toggleEstado = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.estado = !user.estado;
    await user.save();

    res.json({
      message: `Estado cambiado a ${user.estado ? 'Activo' : 'Inactivo'}`,
      user: {
        id: user._id,
        name: user.name,
        estado: user.estado
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado' });
  }
};

////////////////////////////////////////////////////////////// ELMINAR USUARIO //////////////////////////////////////////////////////////////
export const eliminarUsuario = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};


////////////////////////////////////////////////////////////// CARGA MASIVA DE USUARIOS //////////////////////////////////////////////////////////////
export const cargaMasivaUsuarios = async (req, res) => {
  try {
    const { usuarios } = req.body;

    // Validar que se envíe un array
    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      return res.status(400).json({ 
        message: 'Debe enviar un array de usuarios con al menos un elemento' 
      });
    }

    const resultados = {
      exitosos: [],
      fallidos: []
    };

    const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    for (let i = 0; i < usuarios.length; i++) {
      const userData = usuarios[i];
      const { name, correo, contraseña, direccion, telefono, rol } = userData;

      try {
        // Validaciones básicas
        if (!name || !correo || !contraseña) {
          resultados.fallidos.push({
            linea: i + 1,
            correo: correo || 'Sin correo',
            error: 'Nombre, correo y contraseña son obligatorios'
          });
          continue;
        }

        // Validar formato del nombre
        if (!nameRegex.test(name)) {
          resultados.fallidos.push({
            linea: i + 1,
            correo,
            error: 'El nombre solo puede contener letras y espacios'
          });
          continue;
        }

        // Validar formato del correo
        if (!emailRegex.test(correo)) {
          resultados.fallidos.push({
            linea: i + 1,
            correo,
            error: 'El correo electrónico no es válido'
          });
          continue;
        }

        // Validar formato de la contraseña
        if (!passwordRegex.test(contraseña)) {
          resultados.fallidos.push({
            linea: i + 1,
            correo,
            error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
          });
          continue;
        }

        // Verificar si el correo ya existe
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
          resultados.fallidos.push({
            linea: i + 1,
            correo,
            error: 'El correo ya está registrado'
          });
          continue;
        }

        // Determinar el rol
        const domain = correo.split('@')[1];
        const rolFinal = rol || (domain === 'vandalo.com' ? 'administrador' : 'cliente');

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Crear nuevo usuario
        const newUser = new User({
          name,
          correo,
          contraseña: hashedPassword,
          estado: true,
          direccion: direccion || null,
          telefono: telefono || null,
          rol: rolFinal,
          token: null,
          intentosFallidos: 0
        });

        await newUser.save();

        // Enviar correo de bienvenida
        await enviarCorreoRegistro(correo, name);

        resultados.exitosos.push({
          linea: i + 1,
          correo,
          nombre: name
        });

      } catch (error) {
        resultados.fallidos.push({
          linea: i + 1,
          correo: correo || 'Sin correo',
          error: error.message || 'Error al procesar el usuario'
        });
      }
    }

    // Respuesta final
    res.status(200).json({
      message: 'Carga masiva procesada',
      total: usuarios.length,
      exitosos: resultados.exitosos.length,
      fallidos: resultados.fallidos.length,
      detalles: resultados
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al procesar carga masiva' });
  }
};