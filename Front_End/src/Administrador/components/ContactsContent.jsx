import React from "react";
import { Eye, CheckCircle } from "lucide-react";

const ContactsContent = ({ contacts, openViewContactModal, formatFecha }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        {/* === HEADER === */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Mensajes de Contacto</h3>

          <select className="bg-black border border-gray-700 text-white px-3 py-2 rounded-lg">
            <option>Todos</option>
            <option>Pendientes</option>
            <option>Resueltos</option>
          </select>
        </div>

        {/* === TABLA DE CONTACTOS === */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Teléfono</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Asunto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 font-medium text-white">{contact.name}</td>
                  <td className="py-3 px-4 text-gray-300">{contact.correo}</td>
                  <td className="py-3 px-4 text-gray-300">{contact.telefono}</td>
                  <td className="py-3 px-4 text-gray-300">{contact.asunto}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">
                    {formatFecha(contact.fecha)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.estado === "Resuelto"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {contact.estado}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {/* Ver Detalles */}
                      <button
                        onClick={() => openViewContactModal(contact)}
                        className="text-yellow-400 hover:text-yellow-300"
                        title="Ver contacto"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Marcar como Resuelto */}
                      <button
                        className="text-green-400 hover:text-green-300"
                        title="Marcar como resuelto"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* === SIN CONTACTOS === */}
          {contacts.length === 0 && (
            <p className="text-center text-gray-400 py-6">
              No hay mensajes de contacto.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsContent;
