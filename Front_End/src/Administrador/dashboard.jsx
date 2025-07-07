import React, { useState, useEffect } from 'react';
import { 
BarChart3, 
MapPin, 
Users, 
Package, 
TrendingUp, 
Store, 
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
FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Dashboard = () => {
const [activeSection, setActiveSection] = useState('dashboard');
const [notifications, setNotifications] = useState(3);

// Datos simulados
const stores = [
  { id: 1, name: 'Sucursal Centro', lat: 4.6097, lng: -74.0817, sales: 15420, status: 'active' },
  { id: 2, name: 'Sucursal Norte', lat: 4.6500, lng: -74.0900, sales: 12300, status: 'active' },
  { id: 3, name: 'Sucursal Sur', lat: 4.5700, lng: -74.1200, sales: 9800, status: 'maintenance' },
  { id: 4, name: 'Sucursal Chapinero', lat: 4.6300, lng: -74.0650, sales: 18500, status: 'active' }
];

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

const hourlyData = [
  { hour: '8:00', pedidos: 12 },
  { hour: '9:00', pedidos: 25 },
  { hour: '10:00', pedidos: 35 },
  { hour: '11:00', pedidos: 45 },
  { hour: '12:00', pedidos: 85 },
  { hour: '13:00', pedidos: 95 },
  { hour: '14:00', pedidos: 75 },
  { hour: '15:00', pedidos: 55 },
  { hour: '16:00', pedidos: 40 },
  { hour: '17:00', pedidos: 35 },
  { hour: '18:00', pedidos: 68 },
  { hour: '19:00', pedidos: 88 },
  { hour: '20:00', pedidos: 78 },
  { hour: '21:00', pedidos: 45 }
];

const productData = [
  { name: 'Hamburguesas', value: 35, color: '#f8b400' },
  { name: 'Pizza', value: 25, color: '#1f2937' },
  { name: 'Bebidas', value: 20, color: '#6b7280' },
  { name: 'Postres', value: 12, color: '#fbbf24' },
  { name: 'Otros', value: 8, color: '#9ca3af' }
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

const inventoryItems = [
  { id: 1, name: 'Hamburguesas', stock: 45, min: 20, status: 'ok' },
  { id: 2, name: 'Papas Fritas', stock: 12, min: 15, status: 'low' },
  { id: 3, name: 'Bebidas', stock: 89, min: 30, status: 'ok' },
  { id: 4, name: 'Pollo', stock: 8, min: 10, status: 'critical' }
];

const users = [
  { id: 1, name: 'Carlos Rodríguez', role: 'Gerente', store: 'Centro', status: 'online' },
  { id: 2, name: 'Ana García', role: 'Cajera', store: 'Norte', status: 'offline' },
  { id: 3, name: 'Luis Martínez', role: 'Cocinero', store: 'Sur', status: 'online' },
  { id: 4, name: 'María López', role: 'Supervisora', store: 'Chapinero', status: 'online' }
];

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'maps', icon: MapPin, label: 'Sucursales' },
  { id: 'inventory', icon: Package, label: 'Inventario' },
  { id: 'users', icon: Users, label: 'Usuarios' },
  { id: 'reports', icon: FileText, label: 'Reportes' }
];

const DashboardContent = () => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Ventas Hoy</p>
            <p className="text-2xl font-bold text-gray-900">$56,020</p>
            <p className="text-green-600 text-sm font-medium">+12.5% vs ayer</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-full">
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Órdenes</p>
            <p className="text-2xl font-bold text-gray-900">342</p>
            <p className="text-green-600 text-sm font-medium">+8.2% vs ayer</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-full">
            <ShoppingCart className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Ticket Promedio</p>
            <p className="text-2xl font-bold text-gray-900">$164</p>
            <p className="text-red-600 text-sm font-medium">-2.1% vs ayer</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-full">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Clientes Activos</p>
            <p className="text-2xl font-bold text-gray-900">1,248</p>
            <p className="text-green-600 text-sm font-medium">+15.3% vs mes anterior</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-full">
            <Users className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Main Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfica de Ventas Mensuales */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h3>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
            <option>Últimos 7 meses</option>
            <option>Último año</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="ventas" 
              stroke="#f8b400" 
              fill="#f8b400" 
              fillOpacity={0.2}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Productos Más Vendidos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Productos Más Vendidos</h3>
        <div className="flex items-center justify-center">
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
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {productData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Second Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfica de Pedidos por Hora */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pedidos por Hora (Hoy)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar 
              dataKey="pedidos" 
              fill="#f8b400" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Ingresos vs Gastos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Ingresos vs Gastos (Semana)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="ingresos" 
              stroke="#f8b400" 
              strokeWidth={3}
              dot={{ fill: '#f8b400', strokeWidth: 2, r: 6 }}
              name="Ingresos"
            />
            <Line 
              type="monotone" 
              dataKey="gastos" 
              stroke="#1f2937" 
              strokeWidth={3}
              dot={{ fill: '#1f2937', strokeWidth: 2, r: 6 }}
              name="Gastos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Ventas por Sucursal y Actividad Reciente */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Sucursal</h3>
        <div className="space-y-4">
          {stores.map(store => (
            <div key={store.id} className="flex items-center justify-between">
              <span className="text-gray-700">{store.name}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(store.sales / 20000) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">${store.sales.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Nueva orden #1234 - Sucursal Centro</p>
              <p className="text-xs text-gray-500">Hace 5 minutos</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Inventario actualizado - Papas Fritas</p>
              <p className="text-xs text-gray-500">Hace 15 minutos</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Stock bajo - Pollo (8 unidades)</p>
              <p className="text-xs text-gray-500">Hace 1 hora</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Nuevo empleado agregado - Sucursal Norte</p>
              <p className="text-xs text-gray-500">Hace 2 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MapsContent = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapa de Sucursales</h3>
      <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Integración con Google Maps aquí</p>
          <p className="text-sm text-gray-500">Muestra ubicaciones de las 4 sucursales</p>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stores.map(store => (
        <div key={store.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{store.name}</h4>
            <span className={`w-3 h-3 rounded-full ${
              store.status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
          </div>
          <p className="text-sm text-gray-500 mb-2">Ventas: ${store.sales.toLocaleString()}</p>
          <p className="text-xs text-gray-400">
            {store.lat}, {store.lng}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const InventoryContent = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Inventario General</h3>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Actualizar Stock
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Stock Actual</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Stock Mínimo</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map(item => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                <td className="py-3 px-4 text-gray-700">{item.stock}</td>
                <td className="py-3 px-4 text-gray-700">{item.min}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'ok' ? 'bg-green-100 text-green-800' :
                    item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status === 'ok' ? 'Normal' : 
                     item.status === 'low' ? 'Bajo' : 'Crítico'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Agregar Usuario
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <span className={`w-3 h-3 rounded-full ${
                user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Sucursal: {user.store}</p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50">
                Editar
              </button>
              <button className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReportsContent = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Reportes y Análisis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
          <BarChart3 className="w-8 h-8 mb-4" />
          <h4 className="font-semibold mb-2">Reporte de Ventas</h4>
          <p className="text-sm opacity-90">Análisis detallado de ventas por período</p>
          <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm">
            Generar
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl text-white">
          <TrendingUp className="w-8 h-8 mb-4" />
          <h4 className="font-semibold mb-2">Análisis de Tendencias</h4>
          <p className="text-sm opacity-90">Patrones de consumo y preferencias</p>
          <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm">
            Ver
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 rounded-xl text-white">
          <Package className="w-8 h-8 mb-4" />
          <h4 className="font-semibold mb-2">Reporte de Inventario</h4>
          <p className="text-sm opacity-90">Estado y movimientos de stock</p>
          <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm">
            Descargar
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-xl">
        <h4 className="font-medium text-gray-900 mb-4">Métricas Principales</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">87%</p>
            <p className="text-sm text-gray-600">Satisfacción Cliente</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">24min</p>
            <p className="text-sm text-gray-600">Tiempo Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">15%</p>
            <p className="text-sm text-gray-600">Crecimiento Mensual</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">Rating Promedio</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const renderContent = () => {
  switch (activeSection) {
    case 'dashboard': return <DashboardContent />;
    case 'maps': return <MapsContent />;
    case 'inventory': return <InventoryContent />;
    case 'users': return <UsersContent />;
    case 'reports': return <ReportsContent />;
    default: return <DashboardContent />;
  }
};

return (
  <div className="min-h-screen bg-gray-50 flex">
    {/* Sidebar */}
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-yellow-400">El Vandalo Grill</h1>
        <p className="text-gray-400 text-sm mt-1">Panel Administrativo</p>
      </div>
      
      <nav className="flex-1 px-4">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-left transition-colors ${
                activeSection === item.id 
                  ? 'bg-yellow-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h2>
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      

      {/* Page Content */}
      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  </div>
);
};

export default Dashboard;