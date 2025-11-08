import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Search, ShoppingCart, User, Package } from "lucide-react";

// Convierte "$5.000", "5000" o 5000 a número 5000
const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (typeof priceStr === 'string') {
    return Number(priceStr.replace(/[$.]/g, ''));
  }
  return 0;
};

// ========================================
// MODAL DE CREACIÓN DE ORDEN
// ========================================
function CreateOrderModal({ isOpen, onClose, onOrderCreated }) {
  // Estados del formulario
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [sendEmail, setSendEmail] = useState(true);
  
  // Estados de productos
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState(1);

  // Cargar productos disponibles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchAvailableProducts();
      resetForm();
    }
  }, [isOpen]);

  // Resetear formulario
  const resetForm = () => {
    setCustomerEmail("");
    setOrderDescription("");
    setStatus("pendiente");
    setSendEmail(true);
    setItems([]);
    setTotalPrice(0);
    setSearchProduct("");
    setError("");
    setSuccessMessage("");
    setStep(1);
  };

  // Cargar productos del inventario
  const fetchAvailableProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menu-cliente");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setAvailableProducts(data);
      } else if (data.productos && Array.isArray(data.productos)) {
        setAvailableProducts(data.productos);
      } else if (data.menu && Array.isArray(data.menu)) {
        setAvailableProducts(data.menu);
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos disponibles");
    }
  };

  // Calcular total
  const calculateTotal = (itemsList) => {
    const total = itemsList.reduce((sum, item) => {
      const quantity = parseInt(item.quantity) || 0;
      const price = parsePrice(item.price);
      return sum + (quantity * price);
    }, 0);
    setTotalPrice(total);
  };

  // Agregar producto
  const handleAddProduct = (product) => {
    const productId = product._id || product.id;
    const productPrice = parsePrice(product.precio || product.price || 0);
    const existingItem = items.find(item => item.id === productId);
    
    if (existingItem) {
      const updatedItems = items.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setItems(updatedItems);
      calculateTotal(updatedItems);
    } else {
      const newItem = {
        id: productId,
        title: product.nombre || product.name || product.title || "Producto sin nombre",
        quantity: 1,
        price: productPrice
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      calculateTotal(updatedItems);
    }
    
    setSearchProduct("");
  };

  // Actualizar cantidad
  const handleUpdateQuantity = (index, newQuantity) => {
    const qty = parseInt(newQuantity);
    if (isNaN(qty) || qty < 1) return;
    
    const updatedItems = [...items];
    updatedItems[index].quantity = qty;
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Eliminar producto
  const handleRemoveProduct = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Validar paso 1
  const handleNextStep = () => {
    setError("");
    
    if (!customerEmail.trim()) {
      setError("El correo del cliente es requerido");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setError("Por favor ingresa un correo válido");
      return;
    }
    
    if (!orderDescription.trim()) {
      setError("La descripción del pedido es requerida");
      return;
    }
    
    setStep(2);
  };

  // Crear orden
  const handleCreateOrder = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (items.length === 0) {
      setError("Debes agregar al menos un producto");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/employee/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          totalPrice,
          orderDescription,
          status,
          customerEmail,
          sendEmail
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Error al crear el pedido");
      }

      setSuccessMessage("¡Pedido creado exitosamente!");
      
      if (onOrderCreated) {
        onOrderCreated(result.order || result);
      }

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const filteredProducts = availableProducts.filter(product => {
    const nombre = (product.nombre || product.name || product.title || "").toLowerCase();
    const categoria = (product.categoria || product.category || "").toLowerCase();
    const search = searchProduct.toLowerCase();
    return nombre.includes(search) || categoria.includes(search);
  }).slice(0, 5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-4xl text-white shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Crear Nueva Orden</h2>
              <p className="text-sm text-gray-400 mt-1">
                {step === 1 ? "Paso 1: Información del Cliente" : "Paso 2: Seleccionar Productos"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Mensajes */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="font-bold">✓</span>
              {successMessage}
            </div>
          )}

          {/* PASO 1 */}
          {step === 1 && (
            <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-lg">Datos del Cliente</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="cliente@ejemplo.com"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Descripción del Pedido *
                  </label>
                  <textarea
                    value={orderDescription}
                    onChange={(e) => setOrderDescription(e.target.value)}
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                    rows="4"
                    placeholder="Describe los detalles del pedido..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Estado Inicial
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="preparando">Preparando</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 text-yellow-400 bg-black border-gray-800 rounded focus:ring-yellow-400"
                    />
                    <span className="text-white">
                      Enviar correo de confirmación al cliente
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold text-lg">Productos ({items.length})</h3>
                </div>
                <span className="text-3xl font-bold text-yellow-400">
                  ${totalPrice.toLocaleString('es-CO')}
                </span>
              </div>

              {/* Lista de productos agregados */}
              {items.length > 0 && (
                <div className="space-y-2 mb-6">
                  {items.map((item, index) => {
                    const quantity = parseInt(item.quantity) || 0;
                    const price = parseFloat(item.price) || 0;
                    const subtotal = quantity * price;
                    
                    return (
                      <div 
                        key={index}
                        className="flex items-center gap-3 bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-yellow-400/30 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-sm text-gray-400">${price.toLocaleString('es-CO')} c/u</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => handleUpdateQuantity(index, e.target.value)}
                            className="w-20 bg-black border border-gray-800 text-white px-3 py-2 rounded-lg text-center focus:outline-none focus:border-yellow-400"
                          />
                          <span className="text-yellow-400 font-bold w-28 text-right">
                            ${subtotal.toLocaleString('es-CO')}
                          </span>
                          <button
                            onClick={() => handleRemoveProduct(index)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Buscar productos */}
              <div className="border-t border-gray-800 pt-6">
                <label className="block text-sm text-gray-400 mb-3">
                  <Search className="inline w-4 h-4 mr-2" />
                  Buscar y Agregar Productos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="w-full bg-black border border-gray-800 text-white pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Buscar por nombre o categoría..."
                  />
                </div>

                {/* Resultados */}
                {searchProduct && filteredProducts.length > 0 && (
                  <div className="mt-3 bg-black border border-gray-800 rounded-lg max-h-64 overflow-y-auto">
                    {filteredProducts.map(product => {
                      const productId = product._id || product.id;
                      const productName = product.nombre || product.name || product.title || "Sin nombre";
                      const productCategory = product.categoria || product.category || "Sin categoría";
                      const productStock = product.stock || 0;
                      const productPrice = product.precio || product.price || 0;
                      
                      return (
                        <button
                          key={productId}
                          onClick={() => handleAddProduct(product)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-900 transition-colors text-left border-b border-gray-800 last:border-b-0"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">{productName}</p>
                            <p className="text-sm text-gray-400">
                              {productCategory} • Stock: <span className={productStock > 0 ? "text-green-400" : "text-red-400"}>{productStock}</span>
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <p className="text-yellow-400 font-bold text-lg">${productPrice.toLocaleString('es-CO')}</p>
                            <Plus className="w-6 h-6 text-green-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {searchProduct && filteredProducts.length === 0 && (
                  <p className="text-gray-400 text-sm mt-3 text-center py-4">
                    No se encontraron productos
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 p-6 border-t border-gray-800">
          <div>
            {step === 2 && (
              <button 
                onClick={() => setStep(1)} 
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors font-medium"
                disabled={loading}
              >
                ← Volver
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            
            {step === 1 ? (
              <button 
                onClick={handleNextStep} 
                className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium shadow-lg hover:shadow-yellow-400/50"
              >
                Siguiente →
              </button>
            ) : (
              <button 
                onClick={handleCreateOrder} 
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors font-medium flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
                disabled={loading || items.length === 0}
              >
                {loading ? (
                  <>Creando...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Crear Orden
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL - CreateOrderContent
// ========================================
export default function CreateOrderContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderCreated = (newOrder) => {
    console.log("✅ Nueva orden creada:", newOrder);
    // Aquí puedes: actualizar lista, mostrar notificación, etc.
  };

  return (
    <div className="space-y-6">
      {/* Card principal */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-4">Nueva Orden</h2>
            <p className="text-gray-400 mb-6 text-lg leading-relaxed">
              Crea órdenes personalizadas para los clientes. Puedes seleccionar productos del inventario,
              ajustar cantidades y calcular totales automáticamente.
            </p>
            
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-yellow-400/50"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-6 h-6" />
              Crear Nueva Orden
            </button>
          </div>
          
          <ShoppingCart className="w-32 h-32 text-yellow-400/10" />
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white text-lg">Paso 1</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ingresa los datos del cliente y descripción del pedido
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white text-lg">Paso 2</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Selecciona productos y ajusta cantidades según necesidad
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Save className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="font-semibold text-white text-lg">Confirmar</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Revisa el total y crea la orden con notificación automática
          </p>
        </div>
      </div>

      {/* Modal */}
      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}