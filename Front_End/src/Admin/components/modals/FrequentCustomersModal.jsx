import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Users, TrendingUp, ShoppingBag, DollarSign, Award } from "lucide-react";

const FrequentCustomersModal = ({ isOpen, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  const [view, setView] = useState("list"); // "list" o "stats"

  useEffect(() => {
    if (isOpen) {
      fetchFrequentCustomers();
    }
  }, [isOpen]);

  const fetchFrequentCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/frequent-customers?limit=10", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error("Error al obtener clientes frecuentes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerStats = async (email) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/customer-stats/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCustomerStats(data.stats);
        setView("stats");
      }
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    fetchCustomerStats(customer.customerEmail);
  };

  const handleBack = () => {
    setView("list");
    setSelectedCustomer(null);
    setCustomerStats(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* === HEADER === */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {view === "list" ? (
              <>
                <Users className="w-6 h-6 text-yellow-400" />
                Clientes Frecuentes
              </>
            ) : (
              <>
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                Estadísticas del Cliente
              </>
            )}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white transition" />
          </button>
        </div>

        {/* === CONTENIDO === */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          ) : view === "list" ? (
            /* VISTA DE LISTA */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map((customer, index) => (
                <motion.div
                  key={customer.customerEmail}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCustomerClick(customer)}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-yellow-400 cursor-pointer transition-all hover:shadow-lg hover:shadow-yellow-400/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold truncate max-w-[200px]">
                          {customer.customerEmail}
                        </p>
                        <p className="text-gray-400 text-sm">{customer.lastOrder}</p>
                      </div>
                    </div>
                    {index === 0 && <Award className="w-5 h-5 text-yellow-400" />}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-900 p-2 rounded-lg">
                      <ShoppingBag className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                      <p className="text-xl font-bold text-white">{customer.totalOrders}</p>
                      <p className="text-xs text-gray-400">Pedidos</p>
                    </div>
                    <div className="bg-gray-900 p-2 rounded-lg">
                      <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <p className="text-xl font-bold text-white">
                        ${customer.totalSpent.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                    <div className="bg-gray-900 p-2 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-xl font-bold text-white">
                        ${customer.averageOrderValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">Promedio</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* VISTA DE ESTADÍSTICAS */
            customerStats && (
              <div className="space-y-6">
                {/* Info del cliente */}
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-3">
                    {customerStats.customerEmail}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-400">
                        {customerStats.totalOrders}
                      </p>
                      <p className="text-sm text-gray-400">Total Pedidos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-400">
                        ${customerStats.totalSpent.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">Total Gastado</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-400">
                        ${customerStats.averageOrderValue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">Promedio/Pedido</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-400">
                        {customerStats.ordersByStatus.entregado}
                      </p>
                      <p className="text-sm text-gray-400">Entregados</p>
                    </div>
                  </div>
                </div>

                {/* Estados de pedidos */}
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Pedidos por Estado
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(customerStats.ordersByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                status === "entregado"
                                  ? "bg-green-500"
                                  : status === "preparando"
                                  ? "bg-blue-500"
                                  : status === "pendiente"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${(count / customerStats.totalOrders) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-white font-semibold w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Productos más pedidos */}
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Top 5 Productos Más Pedidos
                  </h4>
                  <div className="space-y-3">
                    {customerStats.topProducts.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-900 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400 font-bold">#{index + 1}</span>
                          <span className="text-white">{item.product}</span>
                        </div>
                        <span className="text-gray-300 font-semibold">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fechas */}
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Primer Pedido</p>
                      <p className="text-white font-semibold">
                        {new Date(customerStats.firstOrder).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Último Pedido</p>
                      <p className="text-white font-semibold">
                        {new Date(customerStats.lastOrder).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* === FOOTER === */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
          {view === "stats" && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold shadow-md transition"
            >
              Volver
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold shadow-md transition"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FrequentCustomersModal;