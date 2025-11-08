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

  const categories = ['Entradas', 'Platos Principales', 'Bebidas', 'Postres'];
  const unidades = ['Unidades', 'ml'];

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
      } else {
        // Formulario limpio si es nuevo
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
      }
  
      setErrors({});
    }
  }, [product, isOpen]);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';

    const numericPrice = parseFloat(String(formData.price).replace(/[$.]/g, ''));
    if (!numericPrice || numericPrice === 0) {
      newErrors.price = 'El precio no puede ser 0';
    }

    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    if (formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (formData.minimo < 0) newErrors.minimo = 'El stock mínimo no puede ser negativo';
    if (!formData.unidad) newErrors.unidad = 'Selecciona una unidad';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const url = product
      ? `http://localhost:5000/api/menu/${product._id}`
      : 'http://localhost:5000/api/menu';
    
    const method = product ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

      const data = await response.json();

      if (response.ok) {
        onUpdate(data);
        onClose();
      } else {
        console.error('Error en la respuesta:', data);
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Campos del formulario */}
          <div>
            <label className="text-sm font-medium text-white">Nombre del producto</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-white">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
            ></textarea>
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-white">Precio</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-white">Imagen (URL)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-white">Unidad</label>
              <select
                name="unidad"
                value={formData.unidad}
                onChange={handleInputChange}
                className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
              >
                <option value="">Selecciona unidad</option>
                {unidades.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              {errors.unidad && <p className="text-red-400 text-sm mt-1">{errors.unidad}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-white">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
              />
              {errors.stock && <p className="text-red-400 text-sm mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-white">Mínimo</label>
              <input
                type="number"
                name="minimo"
                value={formData.minimo}
                onChange={handleInputChange}
                className="w-full mt-1 p-3 bg-black border border-gray-700 rounded-xl text-white"
              />
              {errors.minimo && <p className="text-red-400 text-sm mt-1">{errors.minimo}</p>}
            </div>

            <div className="flex items-center gap-4 mt-6">
              <label className="text-white flex items-center gap-2">
                <input
                  type="checkbox"
                  name="especial"
                  checked={formData.especial}
                  onChange={handleInputChange}
                />
                Especial del dia 
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

        {/* Botones */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-700 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg'
            }`}
          >
            <Save className="w-5 h-5" />
            <span>
              {loading
                ? 'Guardando...'
                : product
                ? 'Guardar Cambios'
                : 'Crear Producto'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdateModal;
