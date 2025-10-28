import React, { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import BulkProductUpload from "./BulkProductUpload"; // ✅ Import del componente de carga masiva

const InventoryContent = ({
  productos,
  setSelectedProduct,
  setIsModalOpen,
  parsePrice,
}) => {
  // Estado interno para el modal de carga masiva
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl shadow-lg">
        {/* === HEADER === */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Inventario General</h3>

          <div className="flex gap-3">
            {/* === BOTÓN CARGA MASIVA === */}
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-medium shadow hover:shadow-lg transition"
            >
              <Upload className="w-4 h-4" />
              Carga Masiva
            </button>

            {/* === BOTÓN AGREGAR PRODUCTO === */}
            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-xl font-medium shadow hover:shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              Agregar Producto
            </button>
          </div>
        </div>

        {/* === TABLA DE PRODUCTOS === */}
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
              {productos.map((producto) => (
                <tr
                  key={producto._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="py-3 px-4 font-medium text-white">{producto.title}</td>
                  <td className="py-3 px-4 text-gray-300">{producto.stock}</td>
                  <td className="py-3 px-4 text-gray-300">{producto.minimo}</td>
                  <td className="py-3 px-4 text-gray-300">{producto.unidad}</td>
                  <td className="py-3 px-4 text-yellow-400">
                    ${parsePrice(producto.price).toLocaleString()}
                  </td>

                  {/* Estado (activo/inactivo) */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.estado
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {producto.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Botón de acción */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
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

          {/* === SIN PRODUCTOS === */}
          {productos.length === 0 && (
            <p className="text-center text-gray-400 py-6">
              No hay productos registrados.
            </p>
          )}
        </div>
      </div>

      {/* === MODAL DE CARGA MASIVA === */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-[450px] text-center relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsBulkModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">
              Carga Masiva de Productos
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Sube un archivo <strong>.CSV</strong> o <strong>.XLSX</strong> con tus productos.
            </p>

            {/* ✅ Aquí se integra el componente funcional */}
            <div className="bg-gray-800 rounded-xl p-4">
              <BulkProductUpload
                onBulkUpdate={() => {
                  setIsBulkModalOpen(false);
                  window.location.reload(); // Refresca la lista después de la carga
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryContent;
