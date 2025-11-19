import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";

const IngredientModal = ({ isOpen, onClose, ingredient, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "Ingrediente",
    cantidad: 0,
    unidadMedida: "kg",
    stockMinimo: 0,
    fechaVencimiento: "",
    proveedor: "",
    precioUnitario: 0,
    notas: ""
  });

  useEffect(() => {
    if (ingredient) {
      setFormData({
        nombre: ingredient.nombre || "",
        categoria: ingredient.categoria || "Ingrediente",
        cantidad: ingredient.cantidad || 0,
        unidadMedida: ingredient.unidadMedida || "kg",
        stockMinimo: ingredient.stockMinimo || 0,
        fechaVencimiento: ingredient.fechaVencimiento 
          ? new Date(ingredient.fechaVencimiento).toISOString().split('T')[0] 
          : "",
        proveedor: ingredient.proveedor || "",
        precioUnitario: ingredient.precioUnitario || 0,
        notas: ingredient.notas || ""
      });
    } else {
      // Reset para nuevo ingrediente
      setFormData({
        nombre: "",
        categoria: "Ingrediente",
        cantidad: 0,
        unidadMedida: "kg",
        stockMinimo: 0,
        fechaVencimiento: "",
        proveedor: "",
        precioUnitario: 0,
        notas: ""
      });
    }
  }, [ingredient, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = ingredient 
        ? `http://localhost:5000/api/ingredientes/${ingredient._id}`
        : "http://localhost:5000/api/ingredientes";
      
      const method = ingredient ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        onUpdate(data.data || data);
        onClose();
      } else {
        alert(data.message || "Error al guardar ingrediente");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión con el servidor");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              {ingredient ? "Editar Ingrediente" : "Nuevo Ingrediente"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="Ingrediente">Ingrediente</option>
                  <option value="Bebida">Bebida</option>
                  <option value="Insumo">Insumo</option>
                </select>
              </div>

              {/* Unidad de Medida */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Unidad de Medida *
                </label>
                <select
                  value={formData.unidadMedida}
                  onChange={(e) => setFormData({...formData, unidadMedida: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="unidad">unidad</option>
                  <option value="paquete">paquete</option>
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cantidad *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({...formData, cantidad: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Stock Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock Mínimo *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stockMinimo}
                  onChange={(e) => setFormData({...formData, stockMinimo: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Fecha de Vencimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Precio Unitario */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio Unitario
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precioUnitario}
                  onChange={(e) => setFormData({...formData, precioUnitario: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Proveedor */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proveedor
                </label>
                <input
                  type="text"
                  value={formData.proveedor}
                  onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Notas */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                {ingredient ? "Actualizar" : "Crear"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IngredientModal;