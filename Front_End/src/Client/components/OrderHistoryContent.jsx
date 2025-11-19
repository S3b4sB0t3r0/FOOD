import React, { useState } from 'react';
import { MapPin, Package, Calendar, CreditCard, X, ChevronRight, Clock, CheckCircle, XCircle, Truck, Filter, ThumbsUp, ThumbsDown, Ban } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const OrderDetailsModal = ({ order, isOpen, onClose, onConfirmOrder, onReportOrder, onCancelOrder, confirmedOrders }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'entregado': return <CheckCircle className="w-5 h-5" />;
      case 'confirmado': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'reportado': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'enviado': 
      case 'preparando': return <Truck className="w-5 h-5" />;
      case 'pendiente': return <Clock className="w-5 h-5" />;
      case 'cancelado': return <Ban className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'entregado': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'confirmado': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'reportado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'enviado': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'preparando': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pendiente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelado': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const isDelivered = order.status?.toLowerCase() === 'entregado';
  const isPending = order.status?.toLowerCase() === 'pendiente';
  const isConfirmed = order.status?.toLowerCase() === 'confirmado';
  const isReported = order.status?.toLowerCase() === 'reportado';

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      alert('Por favor describe el problema con tu pedido');
      return;
    }

    setIsSubmitting(true);
    await onReportOrder(order._id, reportReason);
    setIsSubmitting(false);
    setShowReportForm(false);
    setReportReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black hover:bg-black/10 rounded-full p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Detalles del Pedido</h2>
              <p className="text-black/70 font-medium">#{order._id.substring(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)} mb-6`}>
            {getStatusIcon(order.status)}
            <span className="font-semibold capitalize">{order.status}</span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Fecha del Pedido</span>
              </div>
              <p className="text-white font-semibold">
                {new Date(order.createdAt).toLocaleDateString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Total Pagado</span>
              </div>
              <p className="text-yellow-400 font-bold text-2xl">
                ${order.totalPrice.toLocaleString('es-CO')}
              </p>
            </div>
          </div>

          {/* Order Description */}
          {order.orderDescription && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-4 border border-yellow-500/30 mb-6">
              <div className="flex items-center gap-2 text-yellow-400 mb-3">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Descripción del Pedido</span>
              </div>
              <p className="text-white text-lg">
                {order.orderDescription}
              </p>
            </div>
          )}

          {/* Products List */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-yellow-400" />
              Productos ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center text-black font-bold text-lg">
                        {item.quantity}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        {item.description && (
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ${item.price.toLocaleString('es-CO')} c/u
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 mb-6">
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-400 font-medium">Total del Pedido:</span>
              <span className="text-yellow-400 font-bold text-2xl">
                ${order.totalPrice.toLocaleString('es-CO')}
              </span>
            </div>
          </div>

          {/* Botones de acción para pedidos ENTREGADOS */}
          {isDelivered && !showReportForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={async () => {
                  await onConfirmOrder(order._id);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50"
              >
                <ThumbsUp className="w-5 h-5" />
                Confirmar Recepción
              </button>
              <button
                onClick={() => setShowReportForm(true)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/50"
              >
                <ThumbsDown className="w-5 h-5" />
                Reportar Problema
              </button>
            </div>
          )}

          {/* Formulario de reporte */}
          {showReportForm && isDelivered && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-red-500/30">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <ThumbsDown className="w-5 h-5 text-red-400" />
                ¿Qué problema hubo con tu pedido?
              </h4>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe el problema (ej: faltó un producto, llegó dañado, etc.)"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-red-500 resize-none"
                rows="4"
                disabled={isSubmitting}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReport}
                  disabled={isSubmitting || !reportReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                </button>
                <button
                  onClick={() => {
                    setShowReportForm(false);
                    setReportReason('');
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Botón de cancelar para pedidos PENDIENTES */}
          {isPending && (
            <button
              onClick={async () => {
                await onCancelOrder(order._id);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/50"
            >
              <Ban className="w-5 h-5" />
              Cancelar Pedido
            </button>
          )}

          {/* Mensajes de estado confirmado/reportado */}
          {isConfirmed && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">✅ Recepción confirmada</span>
            </div>
          )}

          {isReported && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">⚠️ Problema reportado - Nos contactaremos pronto</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderHistoryContent = ({ purchaseHistory, onOrderUpdate, showAlert }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  // 🟢 Confirmar pedido
  const handleConfirmOrder = async (orderId) => {
    if (!window.confirm('¿Confirmas que recibiste tu pedido correctamente?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/confirm`);
      showAlert('success', '¡Pedido confirmado! Gracias por tu compra.');
      if (onOrderUpdate) onOrderUpdate();
    } catch (error) {
      console.error('Error al confirmar pedido:', error);
      const msg = error?.response?.data?.message || 'No se pudo confirmar el pedido';
      showAlert('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔴 Reportar pedido
  const handleReportOrder = async (orderId, motivo) => {
    setIsSubmitting(true);
    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/report`, { motivo });
      showAlert('success', 'Reporte enviado. Nos pondremos en contacto pronto.');
      if (onOrderUpdate) onOrderUpdate();
    } catch (error) {
      console.error('Error al reportar pedido:', error);
      const msg = error?.response?.data?.message || 'No se pudo reportar el pedido';
      showAlert('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⚫ Cancelar pedido
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`${API_BASE}/orders/${orderId}`, { status: 'cancelado' });
      showAlert('success', 'Pedido cancelado correctamente.');
      if (onOrderUpdate) onOrderUpdate();
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      const msg = error?.response?.data?.message || 'No se pudo cancelar el pedido';
      showAlert('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterOrdersByDate = (orders) => {
    if (!orders) return [];
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      
      switch(dateFilter) {
        case 'today':
          return orderDate.getTime() === now.getTime();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return orderDate >= yearAgo;
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrdersByDate(purchaseHistory);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'entregado': return 'text-green-400';
      case 'confirmado': return 'text-emerald-400';
      case 'reportado': return 'text-red-400';
      case 'enviado': return 'text-purple-400';
      case 'preparando': return 'text-blue-400';
      case 'pendiente': return 'text-yellow-400';
      case 'cancelado': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'entregado': return <CheckCircle className="w-4 h-4" />;
      case 'confirmado': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'reportado': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'enviado':
      case 'preparando': return <Truck className="w-4 h-4" />;
      case 'pendiente': return <Clock className="w-4 h-4" />;
      case 'cancelado': return <Ban className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Historial de <span className="text-yellow-400">Compras</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Revisa todos tus pedidos anteriores
        </p>
      </div>

      {/* Filtros de Fecha */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-semibold">Filtrar por fecha</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'today', label: 'Hoy' },
            { value: 'week', label: 'Última semana' },
            { value: 'month', label: 'Último mes' },
            { value: 'year', label: 'Último año' }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setDateFilter(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                dateFilter === filter.value
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders && filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/10"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black font-bold shadow-lg">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          Pedido #{order._id.substring(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)} bg-gray-800/50 border border-current/20`}>
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-semibold capitalize">{order.status}</span>
                      </div>
                    </div>

                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                      <p className="text-gray-400 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span className="font-medium">Productos</span>
                      </p>
                      <div className="text-white space-y-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="block">
                            • {item.quantity}x {item.title}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-yellow-400 font-medium">
                            +{order.items.length - 2} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[160px]">
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">Total</p>
                      <p className="text-3xl font-bold text-yellow-400">
                        ${order.totalPrice.toLocaleString('es-CO')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenModal(order)}
                      className="group w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 flex items-center justify-center gap-2"
                    >
                      Ver Detalles
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-center border border-gray-700">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg">
              {dateFilter === 'all' 
                ? 'Aún no has realizado ningún pedido.' 
                : 'No hay pedidos en este período.'}
            </p>
          </div>
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirmOrder={handleConfirmOrder}
        onReportOrder={handleReportOrder}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
};

export default OrderHistoryContent;