import React, { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Users, Download, TrendingUp, FileText, Calendar, PieChart as PieChartIcon, Filter } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const ReportsContent = () => {
  const [reportStats, setReportStats] = useState(null);
  const [ventasPeriodo, setVentasPeriodo] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [agrupacion, setAgrupacion] = useState('mes');
  const [loading, setLoading] = useState(true);
  
  // Estados para el selector de fechas
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);
    
    setFechaFin(hoy.toISOString().split('T')[0]);
    setFechaInicio(haceUnMes.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarDatos();
    }
  }, [fechaInicio, fechaFin, agrupacion]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Construir parámetros de fecha
      const params = `fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      
      const [statsRes, ventasRes, productosRes] = await Promise.all([
        fetch(`http://localhost:5000/api/reportes/stats?${params}`),
        fetch(`http://localhost:5000/api/reportes/ventas-periodo?${params}&agrupacion=${agrupacion}`),
        fetch(`http://localhost:5000/api/reportes/productos-top?${params}&limite=5`)
      ]);

      const stats = await statsRes.json();
      const ventas = await ventasRes.json();
      const productos = await productosRes.json();

      setReportStats(stats);
      setVentasPeriodo(ventas.datos || ventas);
      setTopProductos(productos.productos || productos);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const params = `fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    window.open(`http://localhost:5000/api/reportes/pdf?${params}`, '_blank');
  };

  const aplicarFiltroRapido = (dias) => {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - dias);
    
    setFechaInicio(inicio.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
  };

  // Custom Tooltip con texto blanco
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-12 rounded-xl">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando datos del reporte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* === HEADER === */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Reporte General</h3>
            <p className="text-sm text-gray-400">
              Del {new Date(fechaInicio).toLocaleDateString('es-CO')} al {new Date(fechaFin).toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-semibold border border-gray-700 transition-all duration-300 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>

      {/* === PANEL DE FILTROS === */}
      {mostrarFiltros && (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            Seleccionar Rango de Fechas
          </h4>
          
          {/* Filtros Rápidos */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Filtros rápidos:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Últimos 7 días', dias: 7 },
                { label: 'Últimos 15 días', dias: 15 },
                { label: 'Último mes', dias: 30 },
                { label: 'Últimos 3 meses', dias: 90 },
                { label: 'Último año', dias: 365 }
              ].map((filtro) => (
                <button
                  key={filtro.dias}
                  onClick={() => aplicarFiltroRapido(filtro.dias)}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-yellow-500 hover:text-black text-gray-300 rounded-lg text-sm transition-all"
                >
                  {filtro.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Fechas Personalizado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Agrupar por
              </label>
              <select
                value={agrupacion}
                onChange={(e) => setAgrupacion(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* === TARJETAS DE ESTADÍSTICAS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Ventas */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl hover:border-yellow-500/50 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Total Ventas</p>
          <p className="text-3xl font-bold text-white mb-2">
            ${reportStats?.totalVentas?.toLocaleString() || 0}
          </p>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span>Ingresos en el período</span>
          </div>
        </div>

        {/* Total Pedidos */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-400">
                {reportStats?.totalPedidos || 0}
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Total Pedidos</p>
          <p className="text-3xl font-bold text-white mb-2">
            {reportStats?.totalPedidos || 0}
          </p>
          <div className="text-xs text-gray-400">
            Órdenes en el período
          </div>
        </div>

        {/* Total Usuarios */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl hover:border-purple-500/50 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-purple-400">
                {reportStats?.totalUsuarios || 0}
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Total Usuarios</p>
          <p className="text-3xl font-bold text-white mb-2">
            {reportStats?.totalUsuarios || 0}
          </p>
          <div className="text-xs text-gray-400">
            Usuarios registrados
          </div>
        </div>
      </div>

      {/* === GRÁFICAS === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de Ventas */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Tendencia de Ventas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ventasPeriodo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af" 
                fontSize={12}
                tick={{ fill: '#fff' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tick={{ fill: '#fff' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="ventas"
                name="Ventas"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.2}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Productos Más Vendidos */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-yellow-400" />
            Top Productos
          </h3>
          {topProductos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: '#fff' }}
                >
                  {topProductos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-400">No hay datos en este período</p>
            </div>
          )}
        </div>
      </div>

      {/* === MÉTRICAS ADICIONALES === */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          Métricas Calculadas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Promedio por Pedido */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Promedio por Pedido</p>
            <p className="text-2xl font-bold text-yellow-400">
              ${reportStats?.totalPedidos > 0 
                ? (reportStats.totalVentas / reportStats.totalPedidos).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                : '0.00'}
            </p>
          </div>

          {/* Pedidos por Usuario */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Pedidos por Usuario</p>
            <p className="text-2xl font-bold text-blue-400">
              {reportStats?.totalUsuarios > 0 
                ? (reportStats.totalPedidos / reportStats.totalUsuarios).toFixed(2)
                : '0.00'}
            </p>
          </div>

          {/* Ventas por Usuario */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Ventas por Usuario</p>
            <p className="text-2xl font-bold text-purple-400">
              ${reportStats?.totalUsuarios > 0 
                ? (reportStats.totalVentas / reportStats.totalUsuarios).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                : '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsContent;