import React from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Users } from "lucide-react";
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

const DashboardContent = ({
  ventasHoy,
  pedidosHoy,
  usuariosActivos,
  ingresosMes,
  salesData = [],
  productData = [],
  pedidosPorDia = [],
  horasPico = [],
}) => {
  // 🔒 Protecciones ante datos nulos o indefinidos
  const safeVentasHoy = ventasHoy ?? 0;
  const safePedidosHoy = pedidosHoy ?? 0;
  const safeUsuariosActivos = usuariosActivos ?? 0;
  const safeIngresosMes = ingresosMes ?? 0;

  return (
    <div className="space-y-6">
      {/* === TARJETAS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas Hoy */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ventas Hoy</p>
              <p className="text-2xl font-bold text-white">
                ${safeVentasHoy.toLocaleString()}
              </p>
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
              <p className="text-2xl font-bold text-white">{safePedidosHoy}</p>
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
              <p className="text-2xl font-bold text-white">
                ${safeIngresosMes.toLocaleString()}
              </p>
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
              <p className="text-2xl font-bold text-white">{safeUsuariosActivos}</p>
              <p className="text-yellow-400 text-sm font-medium">
                +15.3% vs mes anterior
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
              <Users className="w-6 h-6 text-black" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* === GRÁFICAS === */}
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
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
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
        </motion.div>

        {/* Productos más vendidos */}
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
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#ffffff"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  color: "#000",
                }}
                itemStyle={{
                  color: "#000",
                }}
                labelStyle={{
                  color: "#111",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pedidos por Día - HORIZONTAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-6">📊 Pedidos por Día</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={pedidosPorDia} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                stroke="#9ca3af" 
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                dataKey="dia"
                type="category" 
                stroke="#9ca3af" 
                fontSize={12}
                width={70}
                tick={{ fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
              />
              <Bar 
                dataKey="cantidad" 
                fill="#f59e0b"
                radius={[0, 6, 6, 0]}
                maxBarSize={40}
              >
                {pedidosPorDia.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#f59e0b" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Horas Pico - HORIZONTAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-6">🕒 Horas Pico</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={horasPico} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                stroke="#9ca3af" 
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                dataKey="hora"
                type="category" 
                stroke="#9ca3af" 
                fontSize={12}
                width={70}
                tick={{ fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar 
                dataKey="cantidad" 
                fill="#3b82f6"
                radius={[0, 6, 6, 0]}
                maxBarSize={40}
              >
                {horasPico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#3b82f6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardContent;