import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, ClipboardList, Package, Users, Mail, BarChart, Settings, User, Search, Bell, LogOut, ChevronRight } from "lucide-react";
import DashboardContent from "./components/DashboardContent";
import OrdersContent from "./components/OrdersContent";
import InventoryContent from "./components/InventoryContent";
import UsersContent from "./components/UsersContent";
import ContactsContent from "./components/ContactsContent";
import ReportsContent from "./components/ReportsContent";

import OrderViewModal from "./components/modals/OrderViewModal";
import OrderEditModal from "./components/modals/OrderEditModal";
import OrderDeleteModal from "./components/modals/OrderDeleteModal";
import ContactViewModal from "./components/modals/ContactViewModal";
import ProductUpdateModal from "./components/modals/ProductUpdateModal";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarHovered, setSidebarHovered] = useState(false);
  // KPI / gráficas
  const [ventasHoy, setVentasHoy] = useState(0);
  const [pedidosHoy, setPedidosHoy] = useState(0);
  const [usuariosActivos, setUsuariosActivos] = useState(0);
  const [ingresosMes, setIngresosMes] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [pedidosPorDia, setPedidosPorDia] = useState([]);
  const [horasPico, setHorasPico] = useState([]);
  // Inventario
  const [productos, setProductos] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Usuarios
  const [users, setUsers] = useState([]);
  // Pedidos
  const [orders, setOrders] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newDescription, setNewDescription] = useState("");
  // Contactos
  const [contacts, setContacts] = useState([]);
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState(null);
  // Reportes
  const [reportStats, setReportStats] = useState(null);
  // Notificaciones (bajo stock)
  const [bajoStock, setBajoStock] = useState([]);
  const [isBajoStockOpen, setIsBajoStockOpen] = useState(false);


  // ----------------------------
  // HELPERS
  // ----------------------------
  const parsePrice = (priceStr) => {
    if (typeof priceStr === "number") return priceStr;
    if (!priceStr) return 0;
    return Number(String(priceStr).replace(/[$.]/g, "")) || 0;
  };

  const formatFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleString();
    } catch {
      return fecha;
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Llamar al endpoint de logout si existe
      if (token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }).catch(err => console.log("Error al cerrar sesión en el servidor:", err));
      }
    } catch (error) {
      console.error("Error durante el logout:", error);
    } finally {
      // Limpiar todo el localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      
      // Limpiar sessionStorage también por seguridad
      sessionStorage.clear();
      
      // Redirigir al login
      navigate("/");
    }
  };

  const fetchBajoStock = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stats/bajo-stock");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBajoStock(data);
      } else {
        setBajoStock([]);
      }
    } catch (err) {
      console.error("Error al obtener productos con bajo stock:", err);
      setBajoStock([]);
    }
  };
  

  // ----------------------------
  // FETCH: Estadísticas (usamos las mismas rutas del archivo original)
  // ----------------------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // tarjetas
        const [ventasRes, pedidosRes, usuariosRes, ingresosRes] = await Promise.all([
          fetch("http://localhost:5000/api/stats/ventas-hoy").then((r) => r.json()).catch(() => ({})),
          fetch("http://localhost:5000/api/stats/pedidos-hoy").then((r) => r.json()).catch(() => ({})),
          fetch("http://localhost:5000/api/stats/usuarios-activos").then((r) => r.json()).catch(() => ({})),
          fetch("http://localhost:5000/api/stats/ingresos-mes").then((r) => r.json()).catch(() => ({})),
        ]);

        setVentasHoy(ventasRes.total ?? ventasRes.totalVentas ?? 0);
        setPedidosHoy(pedidosRes.cantidad ?? 0);
        setUsuariosActivos(usuariosRes.activos ?? 0);
        setIngresosMes(ingresosRes.total ?? 0);

        // tendencia ventas
        const tendenciaRes = await fetch("http://localhost:5000/api/stats/tendencia-ventas")
          .then((r) => r.json())
          .catch(() => []);
        // si tu backend devuelve {mes, total} map a nombre de mes
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        setSalesData(
          Array.isArray(tendenciaRes)
            ? tendenciaRes.map((item) => ({
                name: meses[(item.mes ?? item.month) - 1] ?? String(item.mes ?? ""),
                ventas: item.total ?? item.ventas ?? 0,
              }))
            : []
        );

        // productos mas vendidos
        const productosRes = await fetch("http://localhost:5000/api/stats/productos-mas-vendidos")
          .then((r) => r.json())
          .catch(() => []);
        setProductData(
          Array.isArray(productosRes)
            ? productosRes.map((p, i) => ({
                name: p._id ?? p.name ?? `Producto ${i + 1}`,
                value: p.cantidad ?? p.value ?? 0,
                color: ["#f59e0b", "#111827", "#374151", "#fbbf24", "#6b7280"][i % 5],
              }))
            : []
        );

        // pedidos por dia
        const pedidosDiaRes = await fetch("http://localhost:5000/api/stats/pedidos-por-dia")
          .then((r) => r.json())
          .catch(() => []);
        setPedidosPorDia(Array.isArray(pedidosDiaRes) ? pedidosDiaRes : []);

        // horas pico
        const horasRes = await fetch("http://localhost:5000/api/stats/horas-pico")
          .then((r) => r.json())
          .catch(() => []);
        setHorasPico(Array.isArray(horasRes) ? horasRes : []);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      }
    };

    fetchStats();
  }, []);

  // ----------------------------
  // FETCH: Productos (menu)
  // ----------------------------
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu"); // ruta original
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setProductos([]);
      }
    };
    fetchProductos();
  }, []);

  // ----------------------------
  // FETCH: Usuarios
  // ----------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user"); // ruta original
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // ----------------------------
  // FETCH: Pedidos (admin)
  // ----------------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/admin/all"); // ruta original
        const result = await res.json();
        if (result.orders && Array.isArray(result.orders)) {
          setOrders(result.orders);
        } else if (Array.isArray(result)) {
          setOrders(result);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error al cargar los pedidos:", err);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  // ----------------------------
  // FETCH: Contactos (dashboard)
  // ----------------------------
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoadingContacts(true);
        const res = await fetch("http://localhost:5000/api/contacto/dashboard"); // ruta original
        if (!res.ok) throw new Error("Error al obtener contactos");
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar los contactos:", err);
        setContacts([]);
        setContactsError(err.message);
      } finally {
        setIsLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // ----------------------------
  // FETCH: Reportes (estadísticas)
  // ----------------------------
  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reportes/estadisticas"); // ruta original
        if (!res.ok) throw new Error("Error al cargar reportes");
        const data = await res.json();
        setReportStats(data);
      } catch (err) {
        console.error("Error cargando reportes:", err);
        setReportStats(null);
      }
    };
    // sólo cargar inicialmente o cuando se abra la sección de reportes
    if (activeSection === "reports") {
      fetchReportStats();
    }
  }, [activeSection]);

  // ----------------------------
  // HANDLERS PEDIDOS / USUARIOS / PRODUCTOS (igual que antes)
  // ----------------------------
  const openViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status ?? order.estado ?? "");
    setNewDescription(order.orderDescription ?? "");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, orderDescription: newDescription }),
      });
      const data = await res.json();
      if (res.ok) {
        // refrescar pedidos
        const resp = await fetch("http://localhost:5000/api/orders/admin/all");
        const js = await resp.json();
        setOrders(js.orders ?? js ?? []);
        setIsEditModalOpen(false);
        setSelectedOrder(null);
      } else {
        alert(data.message || "Error al actualizar pedido");
      }
    } catch (err) {
      console.error("Error al actualizar pedido:", err);
      alert("Error de conexión con el servidor");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrder.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
        setIsDeleteModalOpen(false);
        setSelectedOrder(null);
      } else {
        alert(data.message || "Error al eliminar pedido");
      }
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
      alert("Error de conexión con el servidor");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Error al eliminar usuario");
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("Error de conexión con el servidor");
    }
  };

  // Product modal update callback (mantiene comportamiento original)
  const handleProductUpdated = (updated) => {
    setProductos((prev) => {
      const index = prev.findIndex((p) => p._id === updated._id);
      if (index !== -1) {
        const copia = [...prev];
        copia[index] = updated;
        return copia;
      } else {
        return [updated, ...prev];
      }
    });
    setSelectedProduct(null);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Pedidos", icon: ClipboardList },
    { id: "inventory", label: "Menu", icon: Package },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "contacts", label: "Contactos", icon: Mail },
    { id: "reports", label: "Reportes", icon: BarChart },
  ];

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar Mejorado */}
      <motion.div 
        className="w-72 bg-gradient-to-br from-gray-950 via-gray-900 to-black border-r border-gray-800/50 flex flex-col shadow-2xl"
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800/50">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-black font-black text-xl">VG</span>
            </div>
            <div>
              <h1 className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 tracking-tight">
                EL VANDALO GRILL
              </h1>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Menú Principal
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 shadow-lg shadow-yellow-500/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-r-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-yellow-500/20" 
                    : "bg-gray-800/50 group-hover:bg-gray-700/50"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <span className="font-medium flex-1 text-left">{item.label}</span>
                
                <ChevronRight className={`w-4 h-4 transition-all ${
                  isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                }`} />
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800/50">
          <motion.div 
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">Administrador</p>
            </div>
            <motion.button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              whileHover={{ rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main 
        className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-950 via-black to-gray-900"
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-gray-800/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-gray-500">Gestiona tu negocio desde aquí</p>
            </div>
            <div className="flex items-center gap-3">
            <motion.button 
                onClick={async () => {
                  await fetchBajoStock();
                  setIsBajoStockOpen(true);
                }}
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                {bajoStock.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
                )}
              </motion.button>
              <motion.button 
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeSection === "dashboard" && (
            <DashboardContent
              ventasHoy={ventasHoy}
              pedidosHoy={pedidosHoy}
              usuariosActivos={usuariosActivos}
              ingresosMes={ingresosMes}
              salesData={salesData}
              productData={productData}
              pedidosPorDia={pedidosPorDia}
              horasPico={horasPico}
            />
          )}

          {activeSection === "orders" && (
            <OrdersContent orders={orders} openViewModal={openViewModal} openEditModal={openEditModal} openDeleteModal={openDeleteModal} />
          )}

          {activeSection === "inventory" && (
            <InventoryContent productos={productos} setSelectedProduct={setSelectedProduct} setIsModalOpen={setIsProductModalOpen} parsePrice={parsePrice} />
          )}

          {activeSection === "users" && (
            <UsersContent users={users} setUsers={setUsers} handleDelete={handleDeleteUser} />
          )}

          {activeSection === "contacts" && (
            <ContactsContent contacts={contacts} openViewContactModal={(c) => { setSelectedContact(c); setIsViewContactModalOpen(true); }} formatFecha={formatFecha} />
          )}
          {isBajoStockOpen && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                  <button 
                    onClick={() => setIsBajoStockOpen(false)} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-500" /> Productos con Bajo Stock
                  </h3>

                  {bajoStock.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay productos con bajo stock 🎉</p>
                  ) : (
                    <ul className="divide-y divide-gray-800 max-h-64 overflow-y-auto">
                      {bajoStock.map((p) => (
                        <li key={p._id} className="py-2 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{p.title}</p>
                            <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                          </div>
                          <span className="text-yellow-500 font-semibold">⚠️</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          {activeSection === "reports" && <ReportsContent reportStats={reportStats} handleDownloadPDF={async () => {
            try {
              const res = await fetch("http://localhost:5000/api/reportes/pdf");
              if (!res.ok) throw new Error("Error generando PDF");
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "Reportes.pdf");
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (err) {
              console.error(err);
              alert("Error al generar PDF");
            }
          }} />}
        </div>
      </motion.main>

      {/* Modales */}
      <ProductUpdateModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} product={selectedProduct} onUpdate={handleProductUpdated} /> 
      <OrderViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} order={selectedOrder} />
      <OrderEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} order={selectedOrder} newStatus={newStatus} newDescription={newDescription} setNewStatus={setNewStatus} setNewDescription={setNewDescription} handleUpdateOrder={handleUpdateOrder} />
      <OrderDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} order={selectedOrder} handleConfirmDelete={handleConfirmDelete} />
      <ContactViewModal isOpen={isViewContactModalOpen} onClose={() => setIsViewContactModalOpen(false)} contact={selectedContact} />
    </div>
  );
};

export default Dashboard;