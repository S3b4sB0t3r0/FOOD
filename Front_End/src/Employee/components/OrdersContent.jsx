import React, { useState, useEffect, useMemo } from "react";
import { Eye, Edit, Search, Trash2 } from "lucide-react";
import EditOrderModal from "../components/modals/EditOrderModal";
import ViewOrderModal from "../components/modals/ViewOrderModal";

export default function OrdersContentEmpleado() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [dateFilter, setDateFilter] = useState("Todas las fechas");
  const [sortBy, setSortBy] = useState("Más recientes");
  const [loading, setLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  // Pedido seleccionado completo para modales
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Cargar todos los pedidos al inicio usando la nueva ruta de empleado
  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      // Nueva ruta: GET /api/employee/orders
      const res = await fetch("http://localhost:5000/api/employee/orders");
      const result = await res.json();
      
      if (result.success && result.orders && Array.isArray(result.orders)) {
        setOrders(result.orders);
      } else if (Array.isArray(result)) {
        setOrders(result);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error al cargar los pedidos:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar pedido individual por id usando nueva ruta
  const fetchOrderById = async (id) => {
    try {
      // Nueva ruta: GET /api/employee/orders/:id
      const res = await fetch(`http://localhost:5000/api/employee/orders/${id}`);
      
      if (!res.ok) throw new Error("Pedido no encontrado");
      
      const result = await res.json();
      
      if (result.success && result.order) {
        return result.order;
      }
      
      return result;
    } catch (error) {
      console.error("Error al cargar pedido individual:", error);
      return null;
    }
  };

  // Abrir modal editar, cargando pedido por id
  const openEditModalHandler = async (order) => {
    const orderId = order._id || order.id;
    const fullOrder = await fetchOrderById(orderId);
    if (fullOrder) {
      setSelectedOrder(fullOrder);
      setEditModalOpen(true);
    }
  };

  // Abrir modal ver, cargando pedido por id
  const openViewModalHandler = async (order) => {
    const orderId = order._id || order.id;
    const fullOrder = await fetchOrderById(orderId);
    if (fullOrder) {
      setSelectedOrder(fullOrder);
      setViewModalOpen(true);
    }
  };

  // Eliminar pedido usando la nueva ruta
  const handleDeleteOrder = async (order) => {
    const orderId = order._id || order.id;
    
    if (!window.confirm("¿Estás seguro de eliminar este pedido? El stock será repuesto automáticamente.")) {
      return;
    }

    try {
      // Nueva ruta: DELETE /api/employee/orders/:id
      const res = await fetch(`http://localhost:5000/api/employee/orders/${orderId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success || res.ok) {
        // Remover de la lista
        setOrders(prev => prev.filter(o => (o._id || o.id) !== orderId));
        alert(result.message || "Pedido eliminado correctamente. Stock repuesto.");
      } else {
        alert(result.message || "Error al eliminar el pedido.");
      }
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      alert("Error al eliminar el pedido.");
    }
  };

  // Actualizar pedido en la lista luego de editar
  const handleOrderUpdated = (updatedOrder) => {
    setOrders(prev => prev.map(o => {
      const oId = o._id || o.id;
      const updatedId = updatedOrder._id || updatedOrder.id;
      return oId === updatedId ? updatedOrder : o;
    }));
    setSelectedOrder(updatedOrder);
  };

  // Función para formatear fechas
  const formatOrderDate = (createdAt, time) => {
    if (!createdAt && !time) return "—";
    const created = new Date(createdAt);
    if (!isNaN(created.getTime())) return created.toLocaleString();
    if (time && typeof time === "string") {
      try {
        const [datePart, hourPart] = time.split(", ");
        const [day, month, year] = datePart.split("/").map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (!isNaN(parsedDate.getTime())) return `${day}/${month}/${year}${hourPart ? ", " + hourPart : ""}`;
      } catch (e) { console.warn(e); }
    }
    return "—";
  };

  // Filtrado y ordenado
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((order) => {
        const id = order._id?.toString().toLowerCase() || order.id?.toString().toLowerCase() || "";
        const customer = order.customer?.toLowerCase() || order.customerEmail?.toLowerCase() || order.user?.name?.toLowerCase() || "";
        const items = Array.isArray(order.items) 
          ? order.items.map(i => i.name?.toLowerCase() || i.title?.toLowerCase()).join(", ") 
          : order.itemsSummary?.toLowerCase() || order.items?.toLowerCase() || "";
        return id.includes(search) || customer.includes(search) || items.includes(search);
      });
    }

    if (statusFilter !== "Todos los estados") {
      filtered = filtered.filter(order =>
        order.status?.toLowerCase() === statusFilter.toLowerCase() ||
        order.estado?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (dateFilter !== "Todas las fechas") {
      const now = new Date();
      filtered = filtered.filter(order => {
        const dateStr = order.createdAt || order.time;
        if (!dateStr) return false;
        let orderDate = new Date(dateStr);
        if (isNaN(orderDate.getTime()) && typeof dateStr === "string") {
          const [datePart] = dateStr.split(", ");
          const [day, month, year] = datePart.split("/").map(Number);
          orderDate = new Date(year, month - 1, day);
        }
        if (isNaN(orderDate.getTime())) return false;
        const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        switch (dateFilter) {
          case "Hoy": return diffDays === 0;
          case "Ayer": return diffDays === 1;
          case "Últimos 7 días": return diffDays <= 7;
          case "Últimos 30 días": return diffDays <= 30;
          default: return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Más recientes": return new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time);
        case "Más antiguos": return new Date(a.createdAt || a.time) - new Date(b.createdAt || b.time);
        case "Mayor precio": return (b.total || 0) - (a.total || 0);
        case "Menor precio": return (a.total || 0) - (b.total || 0);
        default: return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Gestión de Pedidos (Empleado)</h3>
          <div className="text-sm text-gray-400">
            {loading ? "Cargando..." : `${filteredOrders.length} de ${orders.length} pedidos`}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors">
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>Preparando</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors">
            <option>Todas las fechas</option>
            <option>Hoy</option>
            <option>Ayer</option>
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors">
            <option>Más recientes</option>
            <option>Más antiguos</option>
            <option>Mayor precio</option>
            <option>Menor precio</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Productos</th>
                <th className="text-left py-3 px-4 font-medium text-yellow-400">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const orderId = order._id || order.id;
                const customerName = order.customer || order.customerEmail || order.user?.name || "Sin cliente";
                const itemsDisplay = Array.isArray(order.items) 
                  ? order.items.map(i => i.name || i.title).join(", ") 
                  : order.itemsSummary || order.items || "—";
                
                return (
                  <tr key={orderId} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium text-white">#{orderId?.slice(-6) || orderId}</td>
                    <td className="py-3 px-4 text-gray-300">{customerName}</td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{itemsDisplay}</td>
                    <td className="py-3 px-4 font-medium text-yellow-400">${order.total?.toLocaleString() || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        (order.status || order.estado)?.toLowerCase() === 'entregado' ? 'bg-green-500/20 text-green-400' :
                        (order.status || order.estado)?.toLowerCase() === 'preparando' ? 'bg-blue-500/20 text-blue-400' :
                        (order.status || order.estado)?.toLowerCase() === 'cancelado' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status || order.estado || "Pendiente"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">{formatOrderDate(order.createdAt, order.time)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => openViewModalHandler(order)} 
                          className="text-yellow-400 hover:text-yellow-300 transition-colors" 
                          title="Ver pedido"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModalHandler(order)} 
                          className="text-blue-400 hover:text-blue-300 transition-colors" 
                          title="Editar pedido"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order)} 
                          className="text-red-400 hover:text-red-300 transition-colors" 
                          title="Eliminar pedido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && <p className="text-center text-gray-400 py-6">Cargando pedidos...</p>}
          {!loading && filteredOrders.length === 0 && <p className="text-center text-gray-400 py-6">No se encontraron pedidos.</p>}
        </div>
      </div>

      {/* Modales */}
      <EditOrderModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        order={selectedOrder}
        onOrderUpdated={handleOrderUpdated}
      />
      <ViewOrderModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}