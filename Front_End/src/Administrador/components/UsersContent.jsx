import React from "react";
import { Trash2 } from "lucide-react";

const UsersContent = ({ users, setUsers, handleDelete }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        {/* === HEADER === */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Gestión de Usuarios</h3>
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
              {users.map((user) => (
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
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-300"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* === SIN USUARIOS === */}
          {users.length === 0 && (
            <p className="text-center text-gray-400 py-6">
              No hay usuarios registrados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersContent;
