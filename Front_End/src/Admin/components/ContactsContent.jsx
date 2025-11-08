import React, { useState, useMemo } from "react";
import { Eye, CheckCircle, Search, Filter, X } from "lucide-react";

const ContactsContent = ({ contacts, openViewContactModal, formatFecha }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateOrder, setDateOrder] = useState("desc"); // desc = más recientes primero

  // Filtrar y ordenar contactos
  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      // Filtro de búsqueda (nombre, email, teléfono, asunto)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.correo.toLowerCase().includes(searchLower) ||
        contact.telefono.toLowerCase().includes(searchLower) ||
        contact.asunto.toLowerCase().includes(searchLower);

      // Filtro de estado
      const matchesStatus = 
        statusFilter === "todos" ||
        (statusFilter === "pendiente" && contact.estado !== "Resuelto") ||
        (statusFilter === "resuelto" && contact.estado === "Resuelto");

      return matchesSearch && matchesStatus;
    });

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return dateOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [contacts, searchTerm, statusFilter, dateOrder]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setDateOrder("desc");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "todos" || dateOrder !== "desc";

  // Estadísticas
  const stats = useMemo(() => {
    const total = contacts.length;
    const resueltos = contacts.filter(c => c.estado === "Resuelto").length;
    const pendientes = total - resueltos;
    return { total, resueltos, pendientes };
  }, [contacts]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        {/* === HEADER CON ESTADÍSTICAS === */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Mensajes de Contacto</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-400">
                Total: <span className="text-white font-medium">{stats.total}</span>
              </span>
              <span className="text-gray-400">
                Pendientes: <span className="text-yellow-400 font-medium">{stats.pendientes}</span>
              </span>
              <span className="text-gray-400">
                Resueltos: <span className="text-green-400 font-medium">{stats.resueltos}</span>
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            {filteredContacts.length} de {contacts.length} mensajes
          </div>
        </div>

        {/* === FILTROS === */}
        <div className="mb-6 space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono o asunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtros de estado y orden */}
          <div className="flex flex-wrap gap-3">
            {/* Filtro de Estado */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="resuelto">Resueltos</option>
              </select>
            </div>

            {/* Ordenar por Fecha */}
            <div>
              <select
                value={dateOrder}
                onChange={(e) => setDateOrder(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="desc">Más recientes primero</option>
                <option value="asc">Más antiguos primero</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>
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
              {filteredContacts.map((contact) => (
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

          {/* === SIN RESULTADOS === */}
          {filteredContacts.length === 0 && contacts.length > 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                No se encontraron mensajes con los filtros aplicados
              </p>
              <button
                onClick={clearFilters}
                className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}

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