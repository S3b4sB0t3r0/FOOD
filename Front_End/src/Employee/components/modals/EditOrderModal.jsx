import React, { useState, useEffect } from "react";
import { X, Package, Plus, Trash2, Save, Search } from "lucide-react";

// Convierte "$5.000", "5000" o 5000 a número 5000 de forma segura
const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (typeof priceStr === 'string') {
    return Number(priceStr.replace(/[$.]/g, ''));
  }
  return 0;
};

// Formatea número a precio con separador de miles
const formatPrice = (price) => {
  const num = parseFloat(price) || 0;
  return num.toLocaleString('es-CO');
};

export default function EditOrderModal({ isOpen, onClose, order: initialOrder, onOrderUpdated }) {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("pendiente");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [sendEmail, setSendEmail] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Productos disponibles (puedes cargarlos desde el API)
  const [availableProducts, setAvailableProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");

  // Cargar productos disponibles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchAvailableProducts();
    }
  }, [isOpen]);

  // Cargar orden completa cuando se abre el modal
  useEffect(() => {
    if (!isOpen || !initialOrder) {
      // Reset al cerrar
      setOrder(null);
      setItems([]);
      setError("");
      setSuccessMessage("");
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderId = initialOrder._id || initialOrder.id;
        
        // Nueva ruta: GET /api/employee/orders/:id
        const res = await fetch(`http://localhost:5000/api/employee/orders/${orderId}`);
        
        if (!res.ok) throw new Error("No se pudo cargar el pedido");
        
        const result = await res.json();
        const orderData = result.success ? result.order : result;
        
        setOrder(orderData);
        setStatus(orderData.status || "pendiente");
        setCustomerEmail(orderData.customer || orderData.customerEmail || "");
        setOrderDescription(orderData.orderDescription || orderData.description || "");
        
        // Cargar items con la estructura correcta
        const loadedItems = (orderData.items || []).map(item => ({
          id: item.id || item._id,
          title: item.title || item.name,
          quantity: parseInt(item.quantity) || 1,
          price: parsePrice(item.price)
        }));
        
        setItems(loadedItems);
        calculateTotal(loadedItems);
        
      } catch (err) {
        console.error("Error al cargar el pedido:", err);
        setError("No se pudo cargar el pedido");
      }
    };

    fetchOrder();
  }, [isOpen, initialOrder]);

  // Cargar productos disponibles del inventario
  const fetchAvailableProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menu-cliente");
      const data = await res.json();
      
      console.log("Productos cargados:", data); // Para debug
      
      if (Array.isArray(data)) {
        setAvailableProducts(data);
      } else if (data.productos && Array.isArray(data.productos)) {
        setAvailableProducts(data.productos);
      } else if (data.menu && Array.isArray(data.menu)) {
        setAvailableProducts(data.menu);
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
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
      // Aumentar cantidad si ya existe
      const updatedItems = items.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setItems(updatedItems);
      calculateTotal(updatedItems);
    } else {
      // Agregar nuevo producto
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
    
    setSearchProduct(""); // Limpiar búsqueda
  };

  // Actualizar cantidad de un producto
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

  // Guardar cambios
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Validaciones
    if (!customerEmail.trim()) {
      setError("El correo del cliente es requerido");
      setLoading(false);
      return;
    }

    if (items.length === 0) {
      setError("Debes agregar al menos un producto");
      setLoading(false);
      return;
    }

    if (!orderDescription.trim()) {
      setError("La descripción del pedido es requerida");
      setLoading(false);
      return;
    }

    try {
      const orderId = order._id || order.id;
      
      // Nueva ruta: PUT /api/employee/orders/:id
      const res = await fetch(`http://localhost:5000/api/employee/orders/${orderId}`, {
        method: "PUT",
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

      if (!result.success && !res.ok) {
        throw new Error(result.message || "Error al actualizar el pedido");
      }

      setSuccessMessage("Pedido actualizado correctamente");
      
      // Notificar al componente padre
      if (onOrderUpdated) {
        onOrderUpdated(result.order || result);
      }

      // Cerrar modal después de 1 segundo
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo actualizar el pedido");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos disponibles por búsqueda
  const filteredProducts = availableProducts.filter(product => {
    const nombre = (product.nombre || product.name || product.title || "").toLowerCase();
    const categoria = (product.categoria || product.category || "").toLowerCase();
    const search = searchProduct.toLowerCase();
    return nombre.includes(search) || categoria.includes(search);
  }).slice(0, 5); // Limitar a 5 resultados

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl w-full max-w-4xl text-white shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Editar Pedido</h2>
            <p className="text-sm text-gray-400 mt-1">
              {order ? `ID: #${(order._id || order.id)?.slice(-6)}` : "Cargando..."}
            </p>
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
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {order ? (
            <>
              {/* Información del Cliente */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Información del Cliente</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="cliente@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Estado del Pedido */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Estado del Pedido</h3>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="preparando">Preparando</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              {/* Descripción */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Descripción del Pedido</h3>
                <textarea
                  value={orderDescription}
                  onChange={(e) => setOrderDescription(e.target.value)}
                  className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                  rows="3"
                  placeholder="Detalles del pedido..."
                />
              </div>

              {/* Productos del Pedido */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Productos ({items.length})</h3>
                  <span className="text-2xl font-bold text-yellow-400">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Lista de productos actuales */}
                <div className="space-y-2 mb-4">
                  {items.map((item, index) => {
                    const quantity = parseInt(item.quantity) || 0;
                    const price = parseFloat(item.price) || 0;
                    const subtotal = quantity * price;
                    
                    return (
                      <div 
                        key={index}
                        className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-sm text-gray-400">${price.toLocaleString()} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => handleUpdateQuantity(index, e.target.value)}
                            className="w-20 bg-black border border-gray-700 text-white px-3 py-1 rounded-lg text-center focus:outline-none focus:border-yellow-400"
                          />
                          <span className="text-yellow-400 font-bold w-24 text-right">
                            ${subtotal.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleRemoveProduct(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Agregar nuevo producto */}
                <div className="border-t border-gray-700 pt-4">
                  <label className="block text-sm text-gray-400 mb-2">
                    Agregar Producto
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      className="w-full bg-black border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Buscar producto por nombre o categoría..."
                    />
                  </div>

                  {/* Resultados de búsqueda */}
                  {searchProduct && filteredProducts.length > 0 && (
                    <div className="mt-2 bg-black border border-gray-700 rounded-lg max-h-48 overflow-y-auto">
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
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-800 transition-colors text-left border-b border-gray-800 last:border-b-0"
                          >
                            <div className="flex-1">
                              <p className="text-white font-medium">{productName}</p>
                              <p className="text-sm text-gray-400">
                                {productCategory} • Stock: {productStock}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-yellow-400 font-bold">${productPrice.toLocaleString()}</p>
                              <Plus className="w-4 h-4 text-green-400 ml-auto" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {searchProduct && filteredProducts.length === 0 && (
                    <p className="text-gray-400 text-sm mt-2">No se encontraron productos</p>
                  )}
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-4 h-4 text-yellow-400 bg-black border-gray-700 rounded focus:ring-yellow-400"
                  />
                  <span className="text-white">
                    Enviar correo de notificación al cliente
                  </span>
                </label>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Cargando pedido...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-medium flex items-center gap-2"
            disabled={loading || !order}
          >
            {loading ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}