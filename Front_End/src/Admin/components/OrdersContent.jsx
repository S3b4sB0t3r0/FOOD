import React, { useState, useMemo } from "react";
import { Eye, Edit, Trash2, Search, Users } from "lucide-react";
import FrequentCustomersModal from "../components/modals/FrequentCustomersModal";

const OrdersContent = ({ orders, openViewModal, openEditModal, openDeleteModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [dateFilter, setDateFilter] = useState("Todas las fechas");
  const [sortBy, setSortBy] = useState("Más recientes");
  
  // Estado para modal de clientes frecuentes
  const [showFrequentCustomers, setShowFrequentCustomers] = useState(false);

  // Función para filtrar y ordenar pedidos
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filtro de búsqueda
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((order) => {
        const id = order.id?.toString().toLowerCase() || "";
        const customer = order.customer?.toLowerCase() || "";
        const items = order.items?.toLowerCase() || "";
        
        return id.includes(search) || 
               customer.includes(search) || 
               items.includes(search);
      });
    }

    // Filtro por estado
    if (statusFilter !== "Todos los estados") {
      filtered = filtered.filter((order) => 
        order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filtro por fecha
    if (dateFilter !== "Todas las fechas") {
      const now = new Date();
      filtered = filtered.filter((order) => {
        if (!order.time) return false;
        
        // Parsear la fecha del pedido (formato: DD/MM/YYYY, HH:MM)
        const [datePart] = order.time.split(", ");
        const [day, month, year] = datePart.split("/");
        const orderDate = new Date(year, month - 1, day);
        
        const diffTime = now - orderDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "Hoy":
            return diffDays === 0;
          case "Ayer":
            return diffDays === 1;
          case "Últimos 7 días":
            return diffDays <= 7;
          case "Últimos 30 días":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Más recientes":
          // Ordenar por fecha descendente
          if (!a.time || !b.time) return 0;
          return b.time.localeCompare(a.time);
        
        case "Más antiguos":
          // Ordenar por fecha ascendente
          if (!a.time || !b.time) return 0;
          return a.time.localeCompare(b.time);
        
        case "Mayor precio":
          return (b.total || 0) - (a.total || 0);
        
        case "Menor precio":
          return (a.total || 0) - (b.total || 0);
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy]);

  return (
    <>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          {/* === HEADER CON BOTÓN DE CLIENTES FRECUENTES === */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Gestión de Pedidos</h3>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {filteredOrders.length} de {orders.length} pedidos
              </div>
              <button
                onClick={() => setShowFrequentCustomers(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-yellow-400/50"
              >
                <Users className="w-4 h-4" />
                Clientes Frecuentes
              </button>
            </div>
          </div>

          {/* === BARRA DE BÚSQUEDA Y FILTROS === */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Barra de búsqueda */}
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

            {/* Filtro por estado */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option>Todos los estados</option>
              <option>Pendiente</option>
              <option>Preparando</option>
              <option>Entregado</option>
              <option>Cancelado</option>
            </select>

            {/* Filtro por fecha */}
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option>Todas las fechas</option>
              <option>Hoy</option>
              <option>Ayer</option>
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>

            {/* Ordenar por */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option>Más recientes</option>
              <option>Más antiguos</option>
              <option>Mayor precio</option>
              <option>Menor precio</option>
            </select>
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
                {filteredOrders.map((order) => (
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
            {filteredOrders.length === 0 && orders.length > 0 && (
              <p className="text-center text-gray-400 py-6">
                No se encontraron pedidos con los filtros aplicados.
              </p>
            )}

            {orders.length === 0 && (
              <p className="text-center text-gray-400 py-6">No hay pedidos registrados.</p>
            )}
          </div>
        </div>
      </div>

      {/* === MODAL DE CLIENTES FRECUENTES === */}
      <FrequentCustomersModal 
        isOpen={showFrequentCustomers}
        onClose={() => setShowFrequentCustomers(false)}
      />
    </>
  );
};

export default OrdersContent;