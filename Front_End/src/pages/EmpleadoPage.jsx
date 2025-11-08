import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Plus, Clock, CheckCircle, 
  XCircle, DollarSign, Package, Eye,
  Search, Filter, Calendar, TrendingUp,
  User, Phone, MapPin, AlertCircle
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo - reemplazar con fetch de API
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        clientName: 'Juan Pérez',
        phone: '3001234567',
        address: 'Calle 123 #45-67',
        items: [
          { name: 'Hamburguesa Clásica', quantity: 2, price: 15000 },
          { name: 'Papas Fritas', quantity: 1, price: 8000 }
        ],
        total: 38000,
        status: 'Pendiente',
        date: '2025-11-07 14:30',
        notes: 'Sin cebolla'
      },
      {
        id: 2,
        clientName: 'María González',
        phone: '3109876543',
        address: 'Carrera 45 #12-34',
        items: [
          { name: 'Pizza Margarita', quantity: 1, price: 25000 }
        ],
        total: 25000,
        status: 'En Preparación',
        date: '2025-11-07 14:15',
        notes: ''
      },
      {
        id: 3,
        clientName: 'Carlos Ruiz',
        phone: '3157654321',
        address: 'Avenida 68 #98-76',
        items: [
          { name: 'Ensalada César', quantity: 2, price: 18000 },
          { name: 'Limonada', quantity: 2, price: 5000 }
        ],
        total: 46000,
        status: 'Completada',
        date: '2025-11-07 13:45',
        notes: 'Entregar antes de las 3pm'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const statusColors = {
    'Pendiente': 'bg-yellow-400 text-black',
    'En Preparación': 'bg-blue-500 text-white',
    'Completada': 'bg-green-500 text-white',
    'Cancelada': 'bg-red-500 text-white'
  };

  const statusIcons = {
    'Pendiente': <Clock className="w-4 h-4" />,
    'En Preparación': <Package className="w-4 h-4" />,
    'Completada': <CheckCircle className="w-4 h-4" />,
    'Cancelada': <XCircle className="w-4 h-4" />
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'Todos' || order.status === filterStatus;
    const matchesSearch = 
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pendiente').length,
    inProgress: orders.filter(o => o.status === 'En Preparación').length,
    completed: orders.filter(o => o.status === 'Completada').length,
    totalRevenue: orders
      .filter(o => o.status === 'Completada')
      .reduce((sum, o) => sum + o.total, 0)
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Dashboard de Empleado</h1>
              <p className="text-gray-400">Gestión de órdenes y pedidos</p>
            </div>
            <button
              onClick={() => setShowNewOrderModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Nueva Orden
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="py-8 px-4 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <ShoppingBag className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold text-white">{stats.total}</span>
              </div>
              <p className="text-gray-400 text-sm">Total Órdenes</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold text-white">{stats.pending}</span>
              </div>
              <p className="text-gray-400 text-sm">Pendientes</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-white">{stats.inProgress}</span>
              </div>
              <p className="text-gray-400 text-sm">En Preparación</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-white">{stats.completed}</span>
              </div>
              <p className="text-gray-400 text-sm">Completadas</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-white">
                  ${stats.totalRevenue.toLocaleString()}
                </span>
              </div>
              <p className="text-gray-400 text-sm">Ingresos Hoy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, teléfono o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['Todos', 'Pendiente', 'En Preparación', 'Completada', 'Cancelada'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    filterStatus === status
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/25'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-8 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Órdenes Recientes
              <span className="ml-3 text-yellow-400">({filteredOrders.length})</span>
            </h2>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-gray-400 font-mono text-sm">#{order.id}</span>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                          {statusIcons[order.status]}
                          {order.status}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.date}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <User className="w-4 h-4 text-yellow-400" />
                          <span className="font-semibold">{order.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone className="w-4 h-4 text-yellow-400" />
                          <span>{order.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4 text-yellow-400" />
                          <span className="truncate">{order.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 text-sm">Items:</span>
                        <span className="text-white text-sm">
                          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </span>
                      </div>

                      {order.notes && (
                        <div className="flex items-start gap-2 bg-gray-800/50 rounded-lg p-2 mt-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                          <span className="text-gray-300 text-sm">{order.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <div className="text-right lg:text-center">
                        <div className="text-3xl font-bold text-yellow-400">
                          ${order.total.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-sm">Total</div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-300 border border-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </button>

                        {order.status === 'Pendiente' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'En Preparación')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300"
                          >
                            Iniciar
                          </button>
                        )}

                        {order.status === 'En Preparación' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Completada')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors duration-300"
                          >
                            Completar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No se encontraron órdenes</h3>
              <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          )}
        </div>
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Detalle de Orden #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusColors[selectedOrder.status]}`}>
                  {statusIcons[selectedOrder.status]}
                  {selectedOrder.status}
                </span>
                <span className="text-gray-400">{selectedOrder.date}</span>
              </div>

              {/* Client Info */}
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <h4 className="text-white font-semibold mb-3">Información del Cliente</h4>
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-5 h-5 text-yellow-400" />
                  <span>{selectedOrder.clientName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <span>{selectedOrder.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  <span>{selectedOrder.address}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-white font-semibold mb-3">Items del Pedido</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
                      <div>
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-gray-400 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-yellow-400 font-semibold">${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Notas Especiales
                  </h4>
                  <p className="text-gray-300">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-white">Total</span>
                  <span className="text-3xl font-bold text-yellow-400">${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedOrder.status === 'Pendiente' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'En Preparación')}
                      className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
                    >
                      Iniciar Preparación
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelada')}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {selectedOrder.status === 'En Preparación' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Completada')}
                    className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors duration-300"
                  >
                    Marcar como Completada
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal Placeholder */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Nueva Orden</h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Formulario de nueva orden aquí</p>
                <p className="text-gray-500 text-sm mt-2">Conectar con tu sistema de menú</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;