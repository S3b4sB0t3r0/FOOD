import React from "react";
import { motion } from "framer-motion";
import { Edit, X } from "lucide-react";

const OrderEditModal = ({
  isOpen,
  onClose,
  order,
  newStatus,
  newDescription,
  setNewStatus,
  setNewDescription,
  handleUpdateOrder,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl w-[30rem]"
      >
        {/* === HEADER === */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-yellow-400" />
            Editar Pedido
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* === INFO DEL PEDIDO === */}
        <div className="mb-4 space-y-2 text-gray-300">
          <p>
            <span className="font-semibold">Cliente:</span> {order.customer}
          </p>
          <p>
            <span className="font-semibold">Productos:</span> {order.items}
          </p>
          <p>
            <span className="font-semibold">Total:</span>{" "}
            ${order.total.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Fecha:</span> {order.time}
          </p>
        </div>

        {/* === CAMPOS DE EDICIÓN === */}
        <label className="block text-gray-300 mb-2">Estado</label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-black border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
        >
          <option value="pendiente">Pendiente</option>
          <option value="preparando">Preparando</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <label className="block text-gray-300 mb-2">Descripción</label>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-black border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
        />

        {/* === FOOTER === */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white shadow-md"
          >
            Cancelar
          </button>

          <button
            onClick={handleUpdateOrder}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold shadow-md"
          >
            Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderEditModal;
