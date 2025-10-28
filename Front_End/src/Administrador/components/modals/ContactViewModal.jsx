import React from "react";
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";

const ContactViewModal = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl w-[30rem]"
      >
        {/* === HEADER === */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-yellow-400" />
            Detalles del Mensaje
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* === DETALLES === */}
        <div className="space-y-2 text-gray-300">
          <p>
            <span className="font-semibold">Nombre:</span> {contact.name}
          </p>
          <p>
            <span className="font-semibold">Correo:</span> {contact.correo}
          </p>
          <p>
            <span className="font-semibold">Teléfono:</span> {contact.telefono}
          </p>
          <p>
            <span className="font-semibold">Asunto:</span> {contact.asunto}
          </p>
          <p>
            <span className="font-semibold">Fecha:</span>{" "}
            {new Date(contact.fecha).toLocaleString()}
          </p>

          {contact.mensaje && (
            <p>
              <span className="font-semibold">Mensaje:</span> {contact.mensaje}
            </p>
          )}
        </div>

        {/* === FOOTER === */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold shadow-md"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactViewModal;
