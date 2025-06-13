import React, { useState } from 'react';
import Footer from '../components/Footer';
import { Plus, Minus, Trash2, ShoppingBag, CreditCard, ArrowLeft } from 'lucide-react';

const initialCart = [
  {
    id: 1,
    title: 'Lasaña de carne',
    description: 'Lasaña clásica con salsa casera y queso gratinado.',
    price: 13700,
    image: 'https://cdn.colombia.com/gastronomia/2015/06/09/lasana-de-carne-y-queso-2977.jpg',
    quantity: 1,
  },
  {
    id: 2,
    title: 'Limonada fresca',
    description: 'Hecho en casa con limones reales y hielo artesanal.',
    price: 3200,
    image: 'https://peopleenespanol.com/thmb/em83Twz8Upw0ktCiE09nKqnu-SY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8714519b-06f8-4298-b9b0-d4137486666e-489367376f8f49f28aaf0d7e67a8f90c.jpg',
    quantity: 2,
  },
];

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);
  const [isProcessing, setIsProcessing] = useState(false);

  const increment = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrement = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = cart.length > 0 ? 3500 : 0;
  const total = subtotal + delivery;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('¡Pedido procesado exitosamente!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6" style={{ color: '#f8b400' }} />
                <h1 className="text-xl font-bold">Mi Carrito</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">{itemCount} artículos</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega algunos productos deliciosos para comenzar</p>
            <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Explorar Menú
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Artículos del pedido</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.map((item, index) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-xl shadow-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                              <div className="flex items-center space-x-4">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatCurrency(item.price)}
                                </span>
                                <div className="flex items-center bg-gray-100 rounded-lg">
                                  <button
                                    onClick={() => decrement(item.id)}
                                    className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-4 py-2 font-medium bg-white border-x border-gray-200">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => increment(item.id)}
                                    className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2 ml-4">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar artículo"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <span className="text-lg font-bold" style={{ color: '#f8b400' }}>
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Resumen del pedido</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Subtotal ({itemCount} artículos)</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Envío</span>
                      <span className="font-medium">{formatCurrency(delivery)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold" style={{ color: '#f8b400' }}>
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          <span>Proceder al pago</span>
                        </>
                      )}
                    </button>
                    <button className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                      Continuar comprando
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f8b400' }}></div>
                      <span className="text-sm font-medium text-gray-900">Envío gratis</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      En pedidos superiores a $25.000. Tu pedido califica para envío gratuito.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
  < Footer />
    </div>
  );
};

export default CartPage;