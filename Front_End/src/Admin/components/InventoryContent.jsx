import React, { useState, useMemo } from "react";
import { Plus, Upload, X, Search, History } from "lucide-react";
import BulkProductUpload from "./BulkProductUpload";
import MovimientosModal from "../components/modals/MovimientosModal"; // ✅ Importamos la modal

const InventoryContent = ({
  productos,
  setSelectedProduct,
  setIsModalOpen,
  parsePrice,
}) => {
  // Estado interno para el modal de carga masiva
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // ✅ Estado para la modal de movimientos
  const [isMovimientosOpen, setIsMovimientosOpen] = useState(false);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas las categorías");
  const [stockFilter, setStockFilter] = useState("Todos los niveles");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [sortBy, setSortBy] = useState("Nombre A-Z");

  // Obtener categorías únicas de los productos
  const categories = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.category || p.categoria).filter(Boolean))];
    return cats.sort();
  }, [productos]);

  // Función para filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = [...productos];

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((producto) => {
        const title = producto.title?.toLowerCase() || "";
        const category = (producto.category || producto.categoria || "").toLowerCase();
        const unidad = producto.unidad?.toLowerCase() || "";
        return title.includes(search) || category.includes(search) || unidad.includes(search);
      });
    }

    if (categoryFilter !== "Todas las categorías") {
      filtered = filtered.filter(
        (producto) => (producto.category || producto.categoria) === categoryFilter
      );
    }

    if (stockFilter !== "Todos los niveles") {
      filtered = filtered.filter((producto) => {
        const stock = Number(producto.stock) || 0;
        const minimo = Number(producto.minimo) || 0;
        switch (stockFilter) {
          case "Stock bajo":
            return stock <= minimo && stock > 0;
          case "Sin stock":
            return stock === 0;
          case "Stock normal":
            return stock > minimo && stock <= minimo * 2;
          case "Stock alto":
            return stock > minimo * 2;
          default:
            return true;
        }
      });
    }

    if (statusFilter !== "Todos los estados") {
      filtered = filtered.filter((producto) => {
        if (statusFilter === "Activo") return producto.estado === true;
        if (statusFilter === "Inactivo") return producto.estado === false;
        return true;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Nombre A-Z":
          return (a.title || "").localeCompare(b.title || "");
        case "Nombre Z-A":
          return (b.title || "").localeCompare(a.title || "");
        case "Stock menor a mayor":
          return (Number(a.stock) || 0) - (Number(b.stock) || 0);
        case "Stock mayor a menor":
          return (Number(b.stock) || 0) - (Number(a.stock) || 0);
        case "Precio menor a mayor":
          return parsePrice(a.price) - parsePrice(b.price);
        case "Precio mayor a menor":
          return parsePrice(b.price) - parsePrice(a.price);
        default:
          return 0;
      }
    });

    return filtered;
  }, [productos, searchTerm, categoryFilter, stockFilter, statusFilter, sortBy, parsePrice]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl shadow-lg">
        {/* === HEADER === */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Inventario General</h3>
            <p className="text-sm text-gray-400 mt-1">
              {filteredProducts.length} de {productos.length} productos
            </p>
          </div>

          <div className="flex gap-3">
            {/* ✅ BOTÓN HISTORIAL DE MOVIMIENTOS */}
            <button
              onClick={() => setIsMovimientosOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 rounded-xl font-medium shadow hover:shadow-lg hover:from-gray-600 hover:to-gray-700 transition"
            >
              <History className="w-4 h-4 text-yellow-400" />
              Historial
            </button>

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

        {/* === BARRA DE BÚSQUEDA Y FILTROS === */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o unidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option>Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option>Todos los niveles</option>
              <option>Sin stock</option>
              <option>Stock bajo</option>
              <option>Stock normal</option>
              <option>Stock alto</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
            >
              <option>Nombre A-Z</option>
              <option>Nombre Z-A</option>
              <option>Stock menor a mayor</option>
              <option>Stock mayor a menor</option>
              <option>Precio menor a mayor</option>
              <option>Precio mayor a menor</option>
            </select>
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
              {filteredProducts.map((producto) => {
                const stock = Number(producto.stock) || 0;
                const minimo = Number(producto.minimo) || 0;
                const isLowStock = stock <= minimo && stock > 0;
                const isOutOfStock = stock === 0;

                return (
                  <tr key={producto._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td className="py-3 px-4 font-medium text-white">{producto.title}</td>
                    <td
                      className={`py-3 px-4 font-medium ${
                        isOutOfStock
                          ? "text-red-400"
                          : isLowStock
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      {producto.stock}
                      {isOutOfStock && " ⚠️"}
                      {isLowStock && " ⚠️"}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{producto.minimo}</td>
                    <td className="py-3 px-4 text-gray-300">{producto.unidad}</td>
                    <td className="py-3 px-4 text-yellow-400">
                      ${parsePrice(producto.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          producto.estado ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        }`}
                      >
                        {producto.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
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
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && productos.length > 0 && (
            <p className="text-center text-gray-400 py-6">
              No se encontraron productos con los filtros aplicados.
            </p>
          )}

          {productos.length === 0 && (
            <p className="text-center text-gray-400 py-6">No hay productos registrados.</p>
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

            <h2 className="text-xl font-semibold text-white mb-4">Carga Masiva de Productos</h2>
            <p className="text-gray-400 text-sm mb-6">
              Sube un archivo <strong>.CSV</strong> o <strong>.XLSX</strong> con tus productos.
            </p>

            <div className="bg-gray-800 rounded-xl p-4">
              <BulkProductUpload
                onBulkUpdate={() => {
                  setIsBulkModalOpen(false);
                  window.location.reload();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL HISTORIAL DE MOVIMIENTOS */}
      <MovimientosModal
        isOpen={isMovimientosOpen}
        onClose={() => setIsMovimientosOpen(false)}
      />
    </div>
  );
};

export default InventoryContent;
