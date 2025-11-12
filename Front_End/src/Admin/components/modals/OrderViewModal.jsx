import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  X, 
  Package, 
  User, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  MessageSquare,
  Clock,
  Hash,
  AlertCircle
} from "lucide-react";

const OrderViewModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  // 🔥 DEBUG: Ver qué llega EXACTAMENTE
 //  console.log('📦 ORDEN COMPLETA:', order);
 // console.log('📦 RAW ITEMS:', order.rawItems);
  
  // Ver si las observaciones están dentro de rawItems
  if (order.rawItems && order.rawItems.length > 0) {
    order.rawItems.forEach((item, idx) => {
     // console.log(`🔍 Item ${idx}:`, item);
     // console.log(`💬 Observación ${idx}:`, item.observation);
    });
  }

  const statusConfig = {
    pendiente: { 
      color: "bg-yellow-500", 
      bgGradient: "from-yellow-500/20 to-yellow-600/10",
      textColor: "text-yellow-400", 
      label: "Pendiente",
      icon: Clock
    },
    preparando: { 
      color: "bg-blue-500", 
      bgGradient: "from-blue-500/20 to-blue-600/10",
      textColor: "text-blue-400", 
      label: "Preparando",
      icon: Package
    },
    enviado: { 
      color: "bg-purple-500", 
      bgGradient: "from-purple-500/20 to-purple-600/10",
      textColor: "text-purple-400", 
      label: "Enviado",
      icon: Package
    },
    entregado: { 
      color: "bg-green-500", 
      bgGradient: "from-green-500/20 to-green-600/10",
      textColor: "text-green-400", 
      label: "Entregado",
      icon: Package
    },
    cancelado: { 
      color: "bg-red-500", 
      bgGradient: "from-red-500/20 to-red-600/10",
      textColor: "text-red-400", 
      label: "Cancelado",
      icon: X
    }
  };

  const currentStatus = statusConfig[order.status?.toLowerCase()] || statusConfig.pendiente;
  const StatusIcon = currentStatus.icon;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
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
          className="bg-gradient-to-br from-gray-900 via-gray-850 to-black rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-700/50 relative"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>

          {/* === HEADER === */}
          <div className="relative bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm px-8 py-6 border-b border-gray-700/50">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-2xl shadow-lg">
                  <Eye className="w-7 h-7 text-gray-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Detalles del Pedido
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
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
            <div className="p-8 space-y-6">
              
              {/* === STATUS & DATE === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br ${currentStatus.bgGradient} backdrop-blur-sm p-5 rounded-2xl border border-gray-700/30`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon className={`w-5 h-5 ${currentStatus.textColor}`} />
                    <p className="text-gray-400 text-sm font-medium">Estado del Pedido</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-semibold ${currentStatus.color} shadow-lg uppercase`}>
                      {order.status || 'Sin estado'}
                    </span>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/30"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <p className="text-gray-400 text-sm font-medium">Fecha y Hora</p>
                  </div>
                  <p className="text-white text-lg font-semibold">
                    {order.time || 'No disponible'}
                  </p>
                </motion.div>
              </div>

              {/* === CUSTOMER INFO === */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  Información del Cliente
                </h3>
                <div className="bg-gray-800/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-gray-400 text-xs mb-1">Nombre del Cliente</p>
                      <p className="text-white font-medium text-lg">
                        {order.customer || 'Sin nombre'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* === PRODUCTS === */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-yellow-400" />
                  </div>
                  Productos del Pedido
                </h3>
                <div className="bg-gray-800/30 p-5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-2">Detalle de productos:</p>
                      <p className="text-white text-base leading-relaxed">
                        {order.items || 'Sin productos'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* === ITEMS DETAILS (if exists as array) === */}
              {order.rawItems && Array.isArray(order.rawItems) && order.rawItems.length > 0 && (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-purple-400" />
                    </div>
                    Detalle de Items
                  </h3>
                  <div className="space-y-3">
                    {order.rawItems.map((item, index) => {
                      const itemId = (typeof item._id === 'object' && item._id.$oid) ? item._id.$oid : (item._id || item.id || index);
                      
                      return (
                        <div key={itemId} className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-base mb-1">
                              {item.title || 'Sin título'}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>Cantidad: <span className="text-white font-semibold">{item.quantity || 0}</span></span>
                              <span>Precio: <span className="text-yellow-400 font-semibold">${(item.price || 0).toLocaleString()}</span></span>
                            </div>
                          </div>
                          <span className="text-yellow-400 font-bold text-lg ml-2 flex-shrink-0">
                            ${((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                          </span>
                        </div>
                        
                        {item.observation && (
                          <div className="mt-3 pt-3 border-t border-gray-700/50">
                            <p className="text-gray-400 text-xs mb-1 font-medium flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              Observación del cliente:
                            </p>
                            <p className="text-yellow-300 text-sm font-medium bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                              💬 "{item.observation}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                </motion.div>
              )}

              {/* === ORDER DESCRIPTION === */}
              {order.orderDescription && (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30"
                >
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                    </div>
                    Descripción del Pedido
                  </h3>
                  <div className="bg-gray-800/30 p-4 rounded-xl">
                    <p className="text-gray-300 leading-relaxed">
                      {order.orderDescription}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* === TOTAL === */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 p-3 rounded-xl shadow-lg">
                      <CreditCard className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total del Pedido</p>
                      <p className="text-3xl font-bold text-white">
                        ${(order.total || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* === FOOTER === */}
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm px-8 py-5 border-t border-gray-700/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-xl text-gray-900 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Cerrar
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

export default OrderViewModal;