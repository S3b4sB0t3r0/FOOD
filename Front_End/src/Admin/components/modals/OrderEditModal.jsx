import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit, 
  X, 
  User, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  FileText,
  Save,
  Hash,
  RefreshCw
} from "lucide-react";

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

  const statusConfig = {
    pendiente: { 
      color: "bg-yellow-500", 
      bgGradient: "from-yellow-500/20 to-yellow-600/10",
      textColor: "text-yellow-400", 
      label: "Pendiente"
    },
    preparando: { 
      color: "bg-blue-500", 
      bgGradient: "from-blue-500/20 to-blue-600/10",
      textColor: "text-blue-400", 
      label: "Preparando"
    },
    enviado: { 
      color: "bg-purple-500", 
      bgGradient: "from-purple-500/20 to-purple-600/10",
      textColor: "text-purple-400", 
      label: "Enviado"
    },
    entregado: { 
      color: "bg-green-500", 
      bgGradient: "from-green-500/20 to-green-600/10",
      textColor: "text-green-400", 
      label: "Entregado"
    },
    cancelado: { 
      color: "bg-red-500", 
      bgGradient: "from-red-500/20 to-red-600/10",
      textColor: "text-red-400", 
      label: "Cancelado"
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-gray-900 via-gray-850 to-black rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700/50 relative"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>

          {/* === HEADER === */}
          <div className="relative bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm px-8 py-6 border-b border-gray-700/50">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-2xl shadow-lg">
                  <Edit className="w-7 h-7 text-gray-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Editar Pedido
                  </h2>
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    {order.id || 'Sin ID'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="bg-gray-800/50 hover:bg-gray-700/70 p-2.5 rounded-xl transition-all duration-200 group border border-gray-700/30"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* === CONTENT === */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
            <div className="p-8 space-y-6">
              
              {/* === ORDER INFO (Read Only) === */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                  </div>
                  Información del Pedido
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/30 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs mb-1">Cliente</p>
                        <p className="text-white font-medium">
                          {order.customer || 'Sin nombre'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs mb-1">Fecha</p>
                        <p className="text-white font-medium">
                          {order.time || 'No disponible'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gray-800/30 p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <ShoppingBag className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-2">Productos</p>
                      <p className="text-white text-base leading-relaxed">
                        {order.items || 'Sin productos'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 p-4 rounded-xl border border-yellow-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-yellow-400" />
                      <p className="text-gray-400 text-sm">Total del Pedido</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ${(order.total || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* === EDIT STATUS === */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-yellow-400" />
                  </div>
                  Actualizar Estado
                </h3>
                
                <div className="bg-gray-800/30 p-5 rounded-xl">
                  <label className="block text-gray-400 text-sm font-medium mb-3">
                    Selecciona el nuevo estado del pedido
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border-2 border-gray-700 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 cursor-pointer hover:border-gray-600 font-medium"
                  >
                    <option value="pendiente">🟡 Pendiente</option>
                    <option value="preparando">🔵 Preparando</option>
                    <option value="enviado">🟣 Enviado</option>
                    <option value="entregado">🟢 Entregado</option>
                    <option value="cancelado">🔴 Cancelado</option>
                  </select>
                  
                  {/* Status Preview */}
                  {statusConfig[newStatus] && (
                    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-2">Vista previa:</p>
                      <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${statusConfig[newStatus].color} shadow-lg uppercase`}>
                        {statusConfig[newStatus].label}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* === EDIT DESCRIPTION === */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-green-400" />
                  </div>
                  Descripción del Pedido
                </h3>
                
                <div className="bg-gray-800/30 p-5 rounded-xl">
                  <label className="block text-gray-400 text-sm font-medium mb-3">
                    Actualiza o agrega notas adicionales
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Escribe aquí cualquier observación o detalle adicional del pedido..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border-2 border-gray-700 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 resize-none placeholder-gray-500"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    {newDescription?.length || 0} caracteres
                  </p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* === FOOTER === */}
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm px-8 py-5 border-t border-gray-700/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 border border-gray-600"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            
            <button
              onClick={handleUpdateOrder}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-xl text-gray-900 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar Cambios
            </button>
          </div>

          {/* Custom Scrollbar Styles */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(31, 41, 55, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(234, 179, 8, 0.5);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(234, 179, 8, 0.7);
            }
          `}</style>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderEditModal;