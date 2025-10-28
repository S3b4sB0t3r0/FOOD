import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const OrderDeleteModal = ({ isOpen, onClose, order, handleConfirmDelete }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl w-[24rem] text-center"
      >
        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Eliminar Pedido</h2>
        <p className="text-gray-300 mb-6">
          ¿Seguro que quieres eliminar el pedido{" "}
          <span className="text-yellow-400 font-semibold">#{order.id}</span>?
        </p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white shadow-md"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold shadow-md"
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDeleteModal;
