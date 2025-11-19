import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, AlertTriangle, Calendar, Package } from "lucide-react";

const InventoryIngredientsContent = ({ 
  ingredientes, 
  setSelectedIngredient, 
  setIsModalOpen,
  onDelete 
}) => {
  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");

  // Filtrar ingredientes
  const ingredientesFiltrados = ingredientes.filter(ing => {
    const matchCategoria = filterCategoria === "all" || ing.categoria === filterCategoria;
    const matchEstado = filterEstado === "all" || ing.estado === filterEstado;
    return matchCategoria && matchEstado;
  });

  // Función para determinar el color según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activo":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "proximo-a-vencer":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "vencido":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case "activo":
        return "Activo";
      case "proximo-a-vencer":
        return "Próximo a vencer";
      case "vencido":
        return "Vencido";
      default:
        return estado;
    }
  };

  // Función para formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calcular días hasta vencimiento
  const calcularDiasVencimiento = (fecha) => {
    if (!fecha) return null;
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diff = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">Todas las categorías</option>
            <option value="Ingrediente">Ingredientes</option>
            <option value="Bebida">Bebidas</option>
            <option value="Insumo">Insumos</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="proximo-a-vencer">Próximo a vencer</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>

        <motion.button
          onClick={() => {
            setSelectedIngredient(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Nuevo Ingrediente
        </motion.button>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: ingredientes.length, color: "blue" },
          { 
            label: "Activos", 
            value: ingredientes.filter(i => i.estado === "activo").length, 
            color: "green" 
          },
          { 
            label: "Próximos a vencer", 
            value: ingredientes.filter(i => i.estado === "proximo-a-vencer").length, 
            color: "yellow" 
          },
          { 
            label: "Vencidos", 
            value: ingredientes.filter(i => i.estado === "vencido").length, 
            color: "red" 
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabla de ingredientes */}
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Vencimiento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Sede</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              <AnimatePresence>
                {ingredientesFiltrados.map((ing, idx) => {
                  const diasVencimiento = calcularDiasVencimiento(ing.fechaVencimiento);
                  
                  return (
                    <motion.tr
                      key={ing._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{ing.nombre}</p>
                            <p className="text-sm text-gray-400">{ing.unidad}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-full">
                          {ing.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-lg">{ing.stock || 0}</span>
                          <span className="text-sm text-gray-400">{ing.unidad}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getEstadoColor(ing.estado)}`}>
                          {getEstadoLabel(ing.estado)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{formatFecha(ing.fechaVencimiento)}</span>
                          {diasVencimiento !== null && diasVencimiento <= 7 && diasVencimiento > 0 && (
                            <span className="text-xs text-yellow-400">({diasVencimiento}d)</span>
                          )}
                          {diasVencimiento !== null && diasVencimiento <= 0 && (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-300">{ing.sede || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            onClick={() => {
                              setSelectedIngredient(ing);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => onDelete(ing._id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {ingredientesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No hay ingredientes que coincidan con los filtros</p>
        </div>
      )}
    </div>
  );
};

export default InventoryIngredientsContent;