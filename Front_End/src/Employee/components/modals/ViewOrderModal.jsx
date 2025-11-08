import React from "react";
import { X, Package, User, Calendar, DollarSign, FileText, Clock } from "lucide-react";

export default function ViewOrderModal({ isOpen, onClose, order }) {
  if (!isOpen) return null;
  
  if (!order) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 p-6 rounded-lg text-white border border-gray-700">
        <p>Cargando pedido...</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition">
          Cerrar
        </button>
      </div>
    </div>
  );

  // Obtener datos del pedido con compatibilidad para diferentes estructuras
  const orderId = order._id || order.id;
  const customerEmail = order.customer || order.customerEmail || order.user?.email || "Sin correo";
  const customerName = order.user?.name || customerEmail.split('@')[0];
  const total = order.total || order.totalPrice || 0;
  const status = order.status || order.estado || "Pendiente";
  const description = order.description || order.orderDescription || "Sin descripción";
  const createdAt = order.createdAt || order.time;
  const updatedAt = order.updatedAt;
  const items = order.items || [];
  const movimientos = order.movimientos || [];

  // Función para formatear fecha
  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener color del estado
  const getStatusColor = (status) => {
    const st = status?.toLowerCase();
    switch (st) {
      case 'entregado': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'preparando': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  // Función para obtener color del tipo de movimiento
  const getMovimientoColor = (tipo) => {
    return tipo?.toUpperCase() === 'ENTRADA' 
      ? 'text-green-400' 
      : 'text-red-400';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl max-w-3xl w-full text-white shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Pedido #{orderId?.slice(-6)}</h2>
            <p className="text-sm text-gray-400 mt-1">Detalles completos del pedido</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Información del Cliente */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-lg">Información del Cliente</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Nombre:</span>
                <p className="text-white font-medium">{customerName}</p>
              </div>
              <div>
                <span className="text-gray-400">Correo:</span>
                <p className="text-white font-medium">{customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Estado y Montos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Estado</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">${total.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Productos</span>
              </div>
              <p className="text-2xl font-bold text-white">{items.length}</p>
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-lg">Fechas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Creado:</span>
                <p className="text-white font-medium">{formatDate(createdAt)}</p>
              </div>
              {updatedAt && (
                <div>
                  <span className="text-gray-400">Actualizado:</span>
                  <p className="text-white font-medium">{formatDate(updatedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          {description && description !== "Sin descripción" && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-lg">Descripción del Pedido</h3>
              </div>
              <p className="text-gray-300 text-sm">{description}</p>
            </div>
          )}

          {/* Productos */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-lg">Productos ({items.length})</h3>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const itemName = item.name || item.title || "Producto sin nombre";
                  const itemQuantity = item.quantity || 1;
                  const itemPrice = item.price || 0;
                  const subtotal = itemQuantity * itemPrice;

                  return (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-700"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{itemName}</p>
                        <p className="text-sm text-gray-400">
                          {itemQuantity} x ${itemPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold">${subtotal.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center py-4">No hay productos en este pedido</p>
              )}
            </div>
          </div>

          {/* Historial de Movimientos (si existen) */}
          {movimientos && movimientos.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-lg">Historial de Movimientos ({movimientos.length})</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {movimientos.map((mov, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-700 text-sm"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{mov.producto || mov.nombre}</p>
                      <p className="text-gray-400 text-xs">{mov.fecha}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getMovimientoColor(mov.tipo)}`}>
                        {mov.tipo?.toUpperCase() === 'ENTRADA' ? '+' : '-'}{mov.cantidad}
                      </p>
                      <p className="text-xs text-gray-400">{mov.tipo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}