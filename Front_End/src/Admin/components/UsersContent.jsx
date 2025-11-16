import React, { useState, useMemo } from "react";
import { Trash2, Search, Filter, X, Upload } from "lucide-react";
import BulkUploadModal from "../components/modals/BulkUploadModal"; 
import UserEditModal from "./modals/UserEditModal";

const UsersContent = ({ users, setUsers, handleDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [showBulkUpload, setShowBulkUpload] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Obtener roles únicos
  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(users.map(user => user.rol))];
    return roles.filter(Boolean);
  }, [users]);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(searchLower) ||
        user.correo.toLowerCase().includes(searchLower) ||
        (user.telefono && user.telefono.toLowerCase().includes(searchLower));

      const matchesRole = roleFilter === "todos" || user.rol === roleFilter;

      const matchesStatus = 
        statusFilter === "todos" ||
        (statusFilter === "activo" && user.estado) ||
        (statusFilter === "inactivo" && !user.estado);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("todos");
    setStatusFilter("todos");
  };

  const hasActiveFilters = searchTerm || roleFilter !== "todos" || statusFilter !== "todos";

  // Función para recargar usuarios después de carga masiva
  const handleBulkUploadSuccess = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/');
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error al recargar usuarios:', error);
    }
  };

  const handleEditSuccess = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user/');
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error al recargar usuarios:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        {/* === HEADER === */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Gestión de Usuarios</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {filteredUsers.length} de {users.length} usuarios
            </div>
            {/* BOTÓN DE CARGA MASIVA */}
            <button
              onClick={() => setShowBulkUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all font-medium shadow-lg shadow-blue-500/20"
            >
              <Upload className="w-4 h-4" />
              Carga Masiva
            </button>
          </div>
        </div>

        {/* === FILTROS === */}
        <div className="mb-6 space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
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

          {/* Filtros de rol y estado */}
          <div className="flex flex-wrap gap-3">
            {/* Filtro de Rol */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="todos">Todos los roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Filtro de Estado */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
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

        {/* === TABLA DE USUARIOS === */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Rol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Teléfono</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Último Login</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 font-medium text-white">{user.name}</td>
                  <td className="py-3 px-4 text-gray-300">{user.rol}</td>
                  <td className="py-3 px-4 text-gray-300">{user.correo}</td>
                  <td className="py-3 px-4 text-gray-300">{user.telefono || "—"}</td>

                  {/* === TOGGLE DE ESTADO === */}
                  <td className="py-3 px-4">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `http://localhost:5000/api/user/${user._id}/estado`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                            }
                          );
                          const data = await res.json();
                          if (res.ok) {
                            setUsers((prev) =>
                              prev.map((u) =>
                                u._id === user._id
                                  ? { ...u, estado: !u.estado }
                                  : u
                              )
                            );
                          } else {
                            alert(data.message || "Error al cambiar estado");
                          }
                        } catch (err) {
                          alert("Error de conexión con el servidor");
                          console.error(err);
                        }
                      }}
                      className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        user.estado ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                          user.estado ? "translate-x-7" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </td>
                  
                  {/* === FECHA === */}
                  <td className="py-3 px-4 text-gray-300 text-sm">
                    {new Date(user.updatedAt).toLocaleString()}
                  </td>

                  {/* === ACCIONES === */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* === SIN USUARIOS === */}
          {filteredUsers.length === 0 && users.length > 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                No se encontraron usuarios con los filtros aplicados
              </p>
              <button
                onClick={clearFilters}
                className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {users.length === 0 && (
            <p className="text-center text-gray-400 py-6">
              No hay usuarios registrados.
            </p>
          )}
        </div>
      </div>
      
      {/* Modal de Edición */}
      <UserEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedUser}
        onSuccess={handleEditSuccess}
      />

      {/* MODAL DE CARGA MASIVA */}
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onSuccess={handleBulkUploadSuccess}
      />
    </div>
  );
};

export default UsersContent;