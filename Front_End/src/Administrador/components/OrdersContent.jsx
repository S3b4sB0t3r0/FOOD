import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const OrdersContent = ({ orders, openViewModal, openEditModal, openDeleteModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        {/* === HEADER === */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Gestión de Pedidos</h3>

          <div className="flex space-x-3">
            <select className="bg-black border border-gray-700 text-white px-3 py-2 rounded-lg">
              <option>Todos los estados</option>
              <option>Pendiente</option>
              <option>Preparando</option>
              <option>Entregado</option>
              <option>Cancelado</option>
            </select>
          </div>
        </div>

        {/* === TABLA === */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Productos</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Hora</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 font-medium text-white">#{order.id}</td>
                  <td className="py-3 px-4 text-gray-300">{order.customer}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{order.items}</td>
                  <td className="py-3 px-4 font-medium text-yellow-400">
                    ${order.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{order.status}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{order.time}</td>

                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {/* Ver Pedido */}
                      <button
                        onClick={() => openViewModal(order)}
                        className="text-yellow-400 hover:text-yellow-300"
                        title="Ver pedido"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Editar Pedido */}
                      <button
                        onClick={() => openEditModal(order)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Editar pedido"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Eliminar Pedido */}
                      <button
                        onClick={() => openDeleteModal(order)}
                        className="text-red-400 hover:text-red-300"
                        title="Eliminar pedido"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* === MENSAJE SI NO HAY PEDIDOS === */}
          {orders.length === 0 && (
            <p className="text-center text-gray-400 py-6">No hay pedidos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersContent;
