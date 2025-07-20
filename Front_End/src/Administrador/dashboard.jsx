import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  AlertCircle,
  Star,
  Clock,
  Search,
  Bell,
  Settings,
  User,
  Home,
  FileText,
  MessageCircle,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import ProductUpdateModal from '../components/ProductUpdateModal';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications, setNotifications] = useState(5);

  // Datos para gráficas
  const salesData = [
    { name: 'Ene', ventas: 45000, ordenes: 320, clientes: 180 },
    { name: 'Feb', ventas: 52000, ordenes: 380, clientes: 210 },
    { name: 'Mar', ventas: 48000, ordenes: 350, clientes: 195 },
    { name: 'Apr', ventas: 58000, ordenes: 420, clientes: 235 },
    { name: 'May', ventas: 61000, ordenes: 450, clientes: 260 },
    { name: 'Jun', ventas: 65000, ordenes: 480, clientes: 280 },
    { name: 'Jul', ventas: 72000, ordenes: 520, clientes: 310 }
  ];

  const productData = [
    { name: 'Hamburguesas', value: 35, color: '#f59e0b' },
    { name: 'Pizza', value: 25, color: '#111827' },
    { name: 'Bebidas', value: 20, color: '#374151' },
    { name: 'Postres', value: 12, color: '#fbbf24' },
    { name: 'Otros', value: 8, color: '#6b7280' }
  ];

  const revenueData = [
    { name: 'L', ingresos: 8500, gastos: 6200 },
    { name: 'M', ingresos: 9200, gastos: 6800 },
    { name: 'Mi', ingresos: 8800, gastos: 6500 },
    { name: 'J', ingresos: 12500, gastos: 8200 },
    { name: 'V', ingresos: 15800, gastos: 9500 },
    { name: 'S', ingresos: 18200, gastos: 10800 },
    { name: 'D', ingresos: 16500, gastos: 9800 }
  ];

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
  


  // Datos de pedidos/yapis
  const orders = [
    { id: 1001, customer: 'Juan Pérez', items: 'Hamburguesa Clásica x2, Coca-Cola x2', total: 45000, status: 'delivered', time: '12:30 PM', address: 'Calle 26 #15-30' },
    { id: 1002, customer: 'María González', items: 'Pizza Margherita, Agua x1', total: 32000, status: 'preparing', time: '12:45 PM', address: 'Carrera 7 #45-12' },
    { id: 1003, customer: 'Carlos Silva', items: 'Hamburguesa BBQ, Papas x1, Gaseosa x1', total: 38000, status: 'pending', time: '1:00 PM', address: 'Avenida 19 #8-25' },
    { id: 1004, customer: 'Laura Torres', items: 'Pizza Pepperoni x1, Coca-Cola x2', total: 42000, status: 'cancelled', time: '1:15 PM', address: 'Calle 85 #22-45' },
    { id: 1005, customer: 'Andrés Ruiz', items: 'Hamburguesa Doble, Papas Grandes', total: 55000, status: 'delivered', time: '1:30 PM', address: 'Carrera 15 #67-89' }
  ];

  // Datos de contactos
  const contacts = [
    { id: 1, name: 'Sofia Ramírez', email: 'sofia@gmail.com', phone: '+57 310 123 4567', subject: 'Pedido Especial', message: 'Quisiera hacer un pedido para 20 personas...', date: '2024-07-19 10:30', status: 'pending' },
    { id: 2, name: 'Miguel Castro', email: 'miguel@gmail.com', phone: '+57 311 234 5678', subject: 'Sugerencia', message: 'Me encanta el servicio, pero sugiero...', date: '2024-07-19 09:15', status: 'resolved' },
    { id: 3, name: 'Andrea Morales', email: 'andrea@gmail.com', phone: '+57 312 345 6789', subject: 'Queja', message: 'El pedido llegó frío y tarde...', date: '2024-07-18 20:45', status: 'pending' },
    { id: 4, name: 'Roberto Jiménez', email: 'roberto@gmail.com', phone: '+57 313 456 7890', subject: 'Felicitaciones', message: 'Excelente servicio y comida deliciosa', date: '2024-07-18 18:30', status: 'resolved' }
  ];

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
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ventas Hoy</p>
              <p className="text-2xl font-bold text-white">$342,500</p>
              <p className="text-yellow-400 text-sm font-medium">+12.5% vs ayer</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pedidos</p>
              <p className="text-2xl font-bold text-white">87</p>
              <p className="text-yellow-400 text-sm font-medium">+8.2% vs ayer</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ticket Promedio</p>
              <p className="text-2xl font-bold text-white">$39,425</p>
              <p className="text-red-400 text-sm font-medium">-2.1% vs ayer</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usuarios Activos</p>
              <p className="text-2xl font-bold text-white">1,248</p>
              <p className="text-yellow-400 text-sm font-medium">+15.3% vs mes anterior</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <Users className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Tendencia de Ventas</h3>
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
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Productos Más Vendidos</h3>
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
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {productData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-400">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-6">Ingresos vs Gastos (Semana)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData}>
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
            <Line type="monotone" dataKey="ingresos" stroke="#f59e0b" strokeWidth={3} name="Ingresos" />
            <Line type="monotone" dataKey="gastos" stroke="#6b7280" strokeWidth={3} name="Gastos" />
          </LineChart>
        </ResponsiveContainer>
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
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
              Nuevo Pedido
            </button>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'delivered' ? 'Entregado' :
                       order.status === 'preparing' ? 'Preparando' :
                       order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </span>
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
                <tr key={contact.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-medium text-white">{contact.name}</td>
                  <td className="py-3 px-4 text-gray-300">{contact.email}</td>
                  <td className="py-3 px-4 text-gray-300">{contact.phone}</td>
                  <td className="py-3 px-4 text-gray-300">{contact.subject}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{contact.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
contact.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
}`}>
  {contact.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
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
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
<div className="flex items-center justify-between mb-4">
<h4 className="text-lg font-semibold text-white">Reporte Diario</h4>
<FileText className="w-6 h-6 text-yellow-400" />
</div>
<p className="text-gray-400 text-sm mb-4">Resumen de ventas y operaciones del día</p>
<button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
Generar Reporte
</button>
</div>

<div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
<div className="flex items-center justify-between mb-4">
<h4 className="text-lg font-semibold text-white">Reporte Semanal</h4>
<BarChart3 className="w-6 h-6 text-yellow-400" />
</div>
<p className="text-gray-400 text-sm mb-4">Análisis semanal de rendimiento</p>
<button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
Generar Reporte
</button>
</div>

<div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
<div className="flex items-center justify-between mb-4">
<h4 className="text-lg font-semibold text-white">Reporte Mensual</h4>
<TrendingUp className="w-6 h-6 text-yellow-400" />
</div>
<p className="text-gray-400 text-sm mb-4">Estadísticas mensuales completas</p>
<button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
Generar Reporte
</button>
</div>
</div>

<div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
<h3 className="text-lg font-semibold text-white mb-6">Métricas de Rendimiento</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-gray-400">Satisfacción del Cliente</span>
<span className="text-yellow-400 font-semibold">4.7/5.0</span>
</div>
<div className="w-full bg-gray-700 rounded-full h-2">
<div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" style={{width: '94%'}}></div>
</div>
</div>

<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-gray-400">Tiempo Promedio de Entrega</span>
<span className="text-yellow-400 font-semibold">28 min</span>
</div>
<div className="w-full bg-gray-700 rounded-full h-2">
<div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
</div>
</div>

<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-gray-400">Eficiencia Operativa</span>
<span className="text-yellow-400 font-semibold">91%</span>
</div>
<div className="w-full bg-gray-700 rounded-full h-2">
<div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{width: '91%'}}></div>
</div>
</div>

<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-gray-400">Rotación de Inventario</span>
<span className="text-yellow-400 font-semibold">78%</span>
</div>
<div className="w-full bg-gray-700 rounded-full h-2">
<div className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full" style={{width: '78%'}}></div>
</div>
</div>
</div>
</div>
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

{activeSection === 'inventory' && (
    <>
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
        }}
      />
    </>
  )}
  

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
</div>
</div>
);
};

export default Dashboard;