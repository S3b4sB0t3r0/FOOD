import Contacto from "../models/Contacto.js";
import { enviarCorreoContacto } from '../services/emailService.js'; 

////////////////////////////////////////////////////////////// ENVIO DE CONTACTO //////////////////////////////////////////////////////////////
export const postContacto = async (req, res) => {
  try {
    const { name, correo, telefono, asunto, mensaje } = req.body;

    if (!name || !correo || !telefono || !asunto || !mensaje) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const newContacto = new Contacto({ name, correo, telefono, asunto, mensaje });
    await newContacto.save();

    await enviarCorreoContacto(correo, name, asunto, mensaje);

    res.status(200).json({ message: "Mensaje enviado correctamente", contacto: newContacto });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar el mensaje", error: error.message });
  }
};

////////////////////////////////////////////////////////////// MOSTRAR CONTACTOS //////////////////////////////////////////////////////////////
export const getContactos = async (req, res) => {
  try {
    const contactos = await Contacto.find();
    res.status(200).json(contactos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los contactos", error: error.message });
  }
};