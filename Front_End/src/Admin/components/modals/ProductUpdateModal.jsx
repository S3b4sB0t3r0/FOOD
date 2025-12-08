import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const ProductUpdateModal = ({ isOpen, onClose, product, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    especial: false,
    new: false,
    stock: 0,
    minimo: 0,
    unidad: '',
    estado: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState("");

  const categories = ['Entradas', 'Platos Principales', 'Bebidas', 'Postres', 'otro'];
  const unidades = ['Unidades', 'ml'];

  // =======================================================
  // Cargar datos al abrir modal
  // =======================================================
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          title: product.title || '',
          description: product.description || '',
          price: product.price || '',
          image: product.image || '',
          category: product.category || '',
          especial: product.especial || false,
          new: product.new || false,
          stock: product.stock || 0,
          minimo: product.minimo || 0,
          unidad: product.unidad || '',
          estado: product.estado !== undefined ? product.estado : true
        });

        setIsCustomCategory(
          product.category &&
          !['Entradas', 'Platos Principales', 'Bebidas', 'Postres'].includes(product.category)
        );
        setCustomCategoryText(
          !['Entradas', 'Platos Principales', 'Bebidas', 'Postres'].includes(product.category)
            ? product.category
            : ""
        );

      } else {
        setFormData({
          title: '',
          description: '',
          price: '',
          image: '',
          category: '',
          especial: false,
          new: false,
          stock: 0,
          minimo: 0,
          unidad: '',
          estado: true
        });
        setIsCustomCategory(false);
        setCustomCategoryText("");
      }

      setErrors({});
    }
  }, [product, isOpen]);

  // =======================================================
  // Manejo general de inputs
  // =======================================================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "category") {
      if (value === "otro") {
        setIsCustomCategory(true);
        setFormData(prev => ({ ...prev, category: "" }));
      } else {
        setIsCustomCategory(false);
        setFormData(prev => ({ ...prev, category: value }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // =======================================================
  // Validaciones
  // =======================================================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';

    const numericPrice = parseFloat(String(formData.price).replace(/[$.]/g, ''));
    if (!numericPrice || numericPrice === 0) {
      newErrors.price = 'El precio no puede ser 0';
    }

    if (isCustomCategory) {
      if (!customCategoryText.trim()) newErrors.category = "Escribe una categoría nueva";
    } else {
      if (!formData.category.trim()) newErrors.category = 'Selecciona una categoría';
    }

    if (formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (formData.minimo < 0) newErrors.minimo = 'El stock mínimo no puede ser negativo';

    if (!formData.unidad) newErrors.unidad = 'Selecciona una unidad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =======================================================
  // Submit con soporte para nueva categoría
  // =======================================================
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const finalCategory = isCustomCategory ? customCategoryText : formData.category;

      const dataToSend = {
        ...formData,
        category: finalCategory
      };

      const url = product
        ? `http://localhost:5000/api/menu/${product._id}`
        : "http://localhost:5000/api/menu";

      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error en backend:", result);
        alert("Hubo un problema al guardar el producto.");
      } else {
        alert("Producto guardado correctamente.");
        if (onUpdate) onUpdate();
        onClose();
      }

    } catch (error) {
      console.error("Error al conectar:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // =======================================================
  // UI
  // =======================================================
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-4">

          {/* NOMBRE */}
          <div>
            <label className="text-sm text-white">Nombre del producto</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
            />
            {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="text-sm text-white">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
            />
            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
          </div>

          {/* PRECIO */}
          <div>
            <label className="text-sm text-white">Precio</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
            />
            {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}
          </div>

          {/* IMAGEN */}
          <div>
            <label className="text-sm text-white">Imagen (URL)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
            />
          </div>

          {/* CATEGORÍA + UNIDAD */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white">Categoría</label>

              <select
                value={isCustomCategory ? "otro" : formData.category}
                onChange={handleInputChange}
                name="category"
                className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "otro" ? "➕ Otra..." : cat}
                  </option>
                ))}
              </select>

              {isCustomCategory && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customCategoryText}
                    placeholder="Escribe la nueva categoría"
                    onChange={(e) => setCustomCategoryText(e.target.value)}
                    className="w-full p-3 bg-black border border-yellow-500 rounded-xl text-white"
                  />
                </div>
              )}

              {errors.category && <p className="text-red-400 text-sm">{errors.category}</p>}
            </div>

            {/* UNIDAD */}
            <div>
              <label className="text-sm text-white">Unidad</label>
              <select
                name="unidad"
                value={formData.unidad}
                onChange={handleInputChange}
                className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
              >
                <option value="">Selecciona unidad</option>
                {unidades.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              {errors.unidad && <p className="text-red-400 text-sm">{errors.unidad}</p>}
            </div>
          </div>

          {/* STOCK + MÍNIMO + CHECKBOXES */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-white">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
              />
              {errors.stock && <p className="text-red-400 text-sm">{errors.stock}</p>}
            </div>

            <div>
              <label className="text-sm text-white">Mínimo</label>
              <input
                type="number"
                name="minimo"
                value={formData.minimo}
                onChange={handleInputChange}
                className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
              />
              {errors.minimo && <p className="text-red-400 text-sm">{errors.minimo}</p>}
            </div>

            <div className="flex items-center gap-4 mt-6">
              <label className="text-white flex items-center gap-2">
                <input
                  type="checkbox"
                  name="especial"
                  checked={formData.especial}
                  onChange={handleInputChange}
                />
                Especial del día
              </label>

              <label className="text-white flex items-center gap-2">
                <input
                  type="checkbox"
                  name="new"
                  checked={formData.new}
                  onChange={handleInputChange}
                />
                Nuevo
              </label>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-700 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg"
            }`}
          >
            <Save className="w-5 h-5" />
            <span>{loading ? "Guardando..." : product ? "Guardar Cambios" : "Crear Producto"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductUpdateModal;
