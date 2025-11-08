import React from "react";
import { motion } from "framer-motion";
import { Eye, X } from "lucide-react";

const OrderViewModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl w-[28rem]"
      >
        {/* === HEADER === */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-yellow-400" />
            Detalles del Pedido
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* === INFO === */}
        <div className="space-y-2 text-gray-300">
          <p>
            <span className="font-semibold">ID:</span> #{order.id}
          </p>
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
            <span className="font-semibold">Estado:</span> {order.status}
          </p>
          <p>
            <span className="font-semibold">Fecha:</span> {order.time}
          </p>

          {order.orderDescription && (
            <p>
              <span className="font-semibold">Descripción:</span>{" "}
              {order.orderDescription}
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

export default OrderViewModal;
