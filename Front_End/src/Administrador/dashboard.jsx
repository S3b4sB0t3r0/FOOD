import React, { useState, useEffect } from 'react';
import { Users, Package,DollarSign, ShoppingCart,Search, Bell,Settings,User,Home,FileText,MessageCircle,Eye,Edit,Trash2,CheckCircle,Plus} from 'lucide-react';
import {XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,PieChart, Pie, Cell, AreaChart, Area,  BarChart, Bar} from 'recharts';
import { motion } from "framer-motion";
import ProductUpdateModal from '../components/ProductUpdateModal';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications, setNotifications] = useState(5);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [pedidosHoy, setPedidosHoy] = useState(0);
  const [usuariosActivos, setUsuariosActivos] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [ingresosMes, setIngresosMes] = useState(0);
  const [pedidosPorDia, setPedidosPorDia] = useState([]);
  const [horasPico, setHorasPico] = useState([]);

  // Datos para gráficas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Tarjetas
        const [ventasRes, pedidosRes, usuariosRes, ingresosRes ] = await Promise.all([
          fetch('http://localhost:5000/api/stats/ventas-hoy').then(r => r.json()),
          fetch('http://localhost:5000/api/stats/pedidos-hoy').then(r => r.json()),
          fetch('http://localhost:5000/api/stats/usuarios-activos').then(r => r.json()),
          fetch('http://localhost:5000/api/stats/ingresos-mes').then(r => r.json())
        ]);
  
        setVentasHoy(ventasRes.total || 0);
        setPedidosHoy(pedidosRes.cantidad || 0);
        setUsuariosActivos(usuariosRes.activos || 0);
        setIngresosMes(ingresosRes.total || 0);

        // Tendencia de ventas (gráfico)
        const tendenciaRes = await fetch('http://localhost:5000/api/stats/tendencia-ventas').then(r => r.json());
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        setSalesData(tendenciaRes.map(item => ({
          name: meses[item.mes - 1],
          ventas: item.total
        })));
  
        // Productos más vendidos
        const productosRes = await fetch('http://localhost:5000/api/stats/productos-mas-vendidos').then(r => r.json());
        setProductData(productosRes.map((p, index) => ({
          name: p._id,
          value: p.cantidad,
          color: ['#f59e0b', '#111827', '#374151', '#fbbf24', '#6b7280'][index % 5]
        })));
          } catch (err) {
            console.error('Error cargando estadísticas:', err);
          }

      // Pedidos por día
        const pedidosDiaRes = await fetch("http://localhost:5000/api/stats/pedidos-por-dia").then(r => r.json());
        setPedidosPorDia(pedidosDiaRes);

        // Horas pico
        const horasRes = await fetch("http://localhost:5000/api/stats/horas-pico").then(r => r.json());
        setHorasPico(horasRes);

    };
  
    fetchStats();
  }, []);


const [reportStats, setReportStats] = useState(null);

useEffect(() => {
  if (activeSection === 'reports') {
    const fetchReportStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reportes/estadisticas');
        const data = await res.json();
        setReportStats(data);
      } catch (err) {
        console.error('Error cargando reportes:', err);
      }
    };
    fetchReportStats();
  }
}, [activeSection]);

// Botón para descargar PDF
const handleDownloadPDF = () => {
  fetch('http://localhost:5000/api/reportes/pdf', {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) throw new Error('Error descargando PDF');
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reportes.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch((error) => {
      console.error(error);
      alert('Error al generar el PDF');
    });
};

 // Datos de inventario
const [productos, setProductos] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

useEffect(() => {
  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/menu');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  fetchProductos();
}, []);

const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  return Number(priceStr.replace(/[$.]/g, ''));
};




  // Usuarios
  // Busqueda general de usuarios
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  // ELiminar ususario
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
  
    try {
      const res = await fetch(`http://localhost:5000/api/user/${id}`, {
        method: 'DELETE'
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setUsers(prev => prev.filter(user => user._id !== id));
      } else {
        alert(data.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al conectar con el servidor');
    }
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
     const fetchOrders = async () => {
      try {
       const res = await fetch('http://localhost:5000/api/orders/admin/all');
       const result = await res.json();
       
       
       if (result.orders && Array.isArray(result.orders)) {
        setOrders(result.orders);
       } else {
       setOrders([]); 
       console.error('La API no devolvió un array de pedidos en la propiedad "orders".');
       }
      } catch (error) {
       console.error('Error al cargar los pedidos:', error);
       setOrders([]); 
      }
     };
     
     fetchOrders();
      }, []);


      const [contacts, setContacts] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const fetchContacts = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/contacto/dashboard');
            
            if (!response.ok) {
              throw new Error('Error al obtener los datos. Código de estado: ' + response.status);
            }
            
            const data = await response.json();
            
            // Asumiendo que el backend siempre devuelve un array directamente
            if (Array.isArray(data)) {
              setContacts(data);
            } else {
              setContacts([]);
              console.error('La API no devolvió un array de contactos.');
            }
          } catch (err) {
            console.error('Error al cargar los contactos:', err);
            setError(err.message);
            setContacts([]);
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchContacts();
      }, []);
      
      const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      };
    
      if (isLoading) {
        return <div className="text-center text-white py-10">Cargando contactos...</div>;
      }
    
      if (error) {
        return <div className="text-center text-red-500 py-10">Error: {error}</div>;
      }
      
      if (contacts.length === 0) {
        return <div className="text-center text-gray-400 py-10">No hay mensajes de contacto.</div>;
      }

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'orders', icon: ShoppingCart, label: 'Pedidos' },
    { id: 'inventory', icon: Package, label: 'Inventario' },
    { id: 'users', icon: Users, label: 'Usuarios' },
    { id: 'contacts', icon: MessageCircle, label: 'Contactos' },
    { id: 'reports', icon: FileText, label: 'Reportes' }
  ];

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas Hoy */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ventas Hoy</p>
              <p className="text-2xl font-bold text-white">${ventasHoy.toLocaleString()}</p>
              <p className="text-yellow-400 text-sm font-medium">+12.5% vs ayer</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
          </div>
        </motion.div>
  
        {/* Pedidos Hoy */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pedidos</p>
              <p className="text-2xl font-bold text-white">{pedidosHoy}</p>
              <p className="text-yellow-400 text-sm font-medium">+8.2% vs ayer</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-black" />
            </div>
          </div>
        </motion.div>
  
        {/* Ingresos del Mes */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-white">${ingresosMes.toLocaleString()}</p>
              <p className="text-yellow-400 text-sm font-medium">Mes actual</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
          </div>
        </motion.div>
  
        {/* Usuarios Activos */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usuarios Activos</p>
              <p className="text-2xl font-bold text-white">{usuariosActivos}</p>
              <p className="text-yellow-400 text-sm font-medium">+15.3% vs mes anterior</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <Users className="w-6 h-6 text-black" />
            </div>
          </div>
        </motion.div>
      </div>
  
      {/* Charts Section (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de Ventas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-6">📈 Tendencia de Ventas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.2}
                strokeWidth={3}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
  
        {/* Productos Más Vendidos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-6">🥇 Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive={true}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
  
        {/* Pedidos por Día */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-6">📊 Pedidos por Día</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pedidosPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="dia" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
              <Bar 
                dataKey="cantidad" 
                fill="url(#colorPedidos)" 
                radius={[6, 6, 0, 0]} 
                isAnimationActive={true}
              />
              <defs>
                <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
  
        {/* Horas Pico */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-6">🕒 Horas Pico</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={horasPico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hora" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
              <Bar 
                dataKey="cantidad" 
                fill="url(#colorHoras)" 
                radius={[6, 6, 0, 0]} 
                isAnimationActive={true}
              />
              <defs>
                <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  const OrdersContent = () => (
    <div className="space-y-6">
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Gestión de Pedidos</h3>
        <div className="flex space-x-3">
          <select className="bg-black border border-gray-700 text-white px-3 py-2 rounded-lg">
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>Preparando</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>
        </div>
      </div>
      
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
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4 font-medium text-white">#{order.id}</td>
                <td className="py-3 px-4 text-gray-300">{order.customer}</td>
                <td className="py-3 px-4 text-gray-300 text-sm">{order.items}</td>
                <td className="py-3 px-4 font-medium text-yellow-400">${order.total.toLocaleString()}</td>
                <td className="py-3 px-4">
                <td className="py-3 px-4 text-gray-300">
                  {order.status}
                </td>
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm">{order.time}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-yellow-400 hover:text-yellow-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-blue-400 hover:text-blue-300">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

  const InventoryContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
       <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Inventario General</h3>
          <button
            onClick={() => {
              setSelectedProduct(null); // modo creación
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-xl font-medium shadow hover:shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            Agregar Producto
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Producto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Mínimo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Unidad</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Precio</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-medium text-white">{producto.title}</td>
                  <td className="py-3 px-4 text-gray-300">{producto.stock}</td>
                  <td className="py-3 px-4 text-gray-300">{producto.minimo}</td>
                  <td className="py-3 px-4 text-gray-300">{producto.unidad}</td>
                  <td className="py-3 px-4 text-yellow-400">
                    ${parsePrice(producto.price).toLocaleString()}
                  </td>

                  {/* Estado del producto: Activo/Inactivo */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      producto.estado
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}>
                      {producto.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        console.log('abriendo modal', producto);
                        setSelectedProduct(producto);
                        setIsModalOpen(true);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                    >
                      Reabastecer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const UsersContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Gestión de Usuarios</h3>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Rol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Teléfono</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Último Login</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-medium text-white">{user.name}</td>
                  <td className="py-3 px-4 text-gray-300">{user.rol}</td>
                  <td className="py-3 px-4 text-gray-300">{user.correo}</td>
                  <td className="py-3 px-4 text-gray-300">{user.telefono || '—'}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`http://localhost:5000/api/user/${user._id}/estado`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' }
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setUsers(prev =>
                              prev.map(u =>
                                u._id === user._id ? { ...u, estado: !u.estado } : u
                              )
                            );
                          } else {
                            alert(data.message || 'Error al cambiar estado');
                          }
                        } catch (err) {
                          alert('Error de conexión con el servidor');
                          console.error(err);
                        }
                      }}
                      className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        user.estado ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                          user.estado ? 'translate-x-7' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">
                    {new Date(user.updatedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  

  const ContactsContent = () => (
    <div className="space-y-6">
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Mensajes de Contacto</h3>
        <select className="bg-black border border-gray-700 text-white px-3 py-2 rounded-lg">
          <option>Todos</option>
          <option>Pendientes</option>
          <option>Resueltos</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-300">Nombre</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Teléfono</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Asunto</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Fecha</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4 font-medium text-white">{contact.name}</td>
                <td className="py-3 px-4 text-gray-300">{contact.correo}</td>
                <td className="py-3 px-4 text-gray-300">{contact.telefono}</td>
                <td className="py-3 px-4 text-gray-300">{contact.asunto}</td>
                <td className="py-3 px-4 text-gray-300 text-sm">{formatFecha(contact.fecha)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contact.estado === 'Resuelto' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contact.estado}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-yellow-400 hover:text-yellow-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-400 hover:text-green-300">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);


const ReportsContent = () => (
<div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
    <h3 className="text-lg font-semibold text-white mb-6">Reporte General</h3>
    {reportStats ? (
      <div className="space-y-4 text-white">
        <p>Total Ventas: ${reportStats.totalVentas.toLocaleString()}</p>
        <p>Total Pedidos: {reportStats.totalPedidos}</p>
        <p>Total Usuarios: {reportStats.totalUsuarios}</p>
        <button
          onClick={handleDownloadPDF}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold"
        >
          Descargar Reporte PDF
        </button>
      </div>
    ) : (
      <p className="text-gray-400">Cargando datos...</p>
    )}
  </div>
);

const renderContent = () => {
switch(activeSection) {
case 'dashboard': return <DashboardContent />;
case 'orders': return <OrdersContent />;
case 'inventory': return <InventoryContent />;
case 'users': return <UsersContent />;
case 'contacts': return <ContactsContent />;
case 'reports': return <ReportsContent />;
default: return <DashboardContent />;
}
};

return (
<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
{/* Header */}
<header className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-2xl">
<div className="flex items-center justify-between px-6 py-4">
<div className="flex items-center space-x-4">
<div className="flex items-center space-x-3">
<div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
<span className="text-black font-bold text-xl">V</span>
</div>
<div>
<h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
VANDALO
</h1>
<p className="text-gray-400 text-sm">Sistema Administrativo</p>
</div>
</div>
</div>

<div className="flex items-center space-x-4">
<div className="relative">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
<input 
type="text" 
placeholder="Buscar..." 
className="bg-black border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white focus:border-yellow-400 focus:outline-none transition-colors"
/>
</div>

<button className="relative p-2 text-gray-400 hover:text-yellow-400 transition-colors">
<Bell className="w-5 h-5" />
{notifications > 0 && (
<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
{notifications}
</span>
)}
</button>

<button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
<Settings className="w-5 h-5" />
</button>

<div className="flex items-center space-x-2">
<div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
<User className="w-4 h-4 text-black" />
</div>
<span className="text-white font-medium">Admin</span>
</div>
</div>
</div>
</header>

<div className="flex">
{/* Sidebar */}
<aside className="w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 min-h-screen">
<nav className="p-4">
<ul className="space-y-2">
{menuItems.map((item) => (
<li key={item.id}>
<button
onClick={() => setActiveSection(item.id)}
className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
  activeSection === item.id
    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium shadow-lg'
    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
}`}
>
<item.icon className="w-5 h-5" />
<span>{item.label}</span>
</button>
</li>
))}
</ul>
</nav>
</aside>
{/* Main Content */}
<main className="flex-1 p-6">
  <div className="mb-6">
    <h2 className="text-3xl font-bold text-white mb-2">
      {menuItems.find(item => item.id === activeSection)?.label}
    </h2>
    <p className="text-gray-400">
      {activeSection === 'dashboard' && 'Resumen general del sistema'}
      {activeSection === 'orders' && 'Gestiona todos los pedidos del restaurante'}
      {activeSection === 'inventory' && 'Control de inventario y stock'}
      {activeSection === 'users' && 'Administra usuarios del sistema'}
      {activeSection === 'contacts' && 'Mensajes y consultas de clientes'}
      {activeSection === 'reports' && 'Reportes y análisis de datos'}
    </p>
  </div>

  {renderContent()}
</main>

{/* Modal de edición/agregado de productos */}
<ProductUpdateModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  product={selectedProduct}
  onUpdate={(updated) => {
    setProductos((prev) => {
      const index = prev.findIndex((p) => p._id === updated._id);
      if (index !== -1) {
        const copia = [...prev];
        copia[index] = updated;
        return copia;
      } else {
        return [...prev, updated];
      }
    });
    setSelectedProduct(null);
  }}
/>

</div>
</div>
);
};

export default Dashboard;