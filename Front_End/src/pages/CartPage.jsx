import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, CreditCard, ArrowLeft, CheckCircle, Star, Truck } from 'lucide-react';

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
  const [orderSuccess, setOrderSuccess] = useState(false);

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
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Header */}
      <header className="relative bg-gradient-to-br from-black via-gray-900 to-black border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link to="/">
              <button className="group p-3 hover:bg-gray-800 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25">
                <ArrowLeft className="h-6 w-6 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
              </button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/25">
                  <ShoppingBag className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Mi Carrito</h1>
                  <p className="text-sm text-gray-400">El Vándalo Grill</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-lg font-bold text-yellow-400">{itemCount}</span>
                <p className="text-sm text-gray-400">artículos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-16 w-16 text-gray-600" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Tu carrito está <span className="text-yellow-400">vacío</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto">
              Agrega algunos productos deliciosos para comenzar tu experiencia gastronómica
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-10 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105 inline-flex items-center gap-3">
              <Star className="w-5 h-5" />
              Explorar Menú
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Artículos del pedido</h2>
                      <p className="text-gray-400">Revisa y modifica tu selección</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-800">
                  {cart.map((item, index) => (
                    <div key={item.id} className="group p-8 hover:bg-gradient-to-r hover:from-yellow-400/5 hover:to-transparent transition-all duration-500">
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0 relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">{item.title}</h3>
                              <p className="text-gray-400 mb-4 leading-relaxed">{item.description}</p>
                              <div className="flex items-center space-x-6">
                                <span className="text-xl font-bold text-yellow-400">
                                  {formatCurrency(item.price)}
                                </span>
                                <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                                  <button
                                    onClick={() => decrement(item.id)}
                                    disabled={item.quantity <= 1}
                                    className="p-3 hover:bg-yellow-400 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-6 py-3 font-bold text-white bg-black border-x border-gray-700">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => increment(item.id)}
                                    className="p-3 hover:bg-yellow-400 hover:text-black transition-all duration-300"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-4 ml-6">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="group/delete p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                                title="Eliminar artículo"
                              >
                                <Trash2 className="h-5 w-5 group-hover/delete:scale-110 transition-transform duration-300" />
                              </button>
                              <div className="text-right">
                                <p className="text-sm text-gray-400 mb-1">Subtotal</p>
                                <span className="text-2xl font-bold text-yellow-400">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
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
            <div className="mt-12 lg:mt-0">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl shadow-2xl sticky top-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
                
                <div className="relative p-8 border-b border-gray-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Resumen del pedido</h2>
                      <p className="text-sm text-gray-400">Detalles de tu compra</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative p-8">
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/50 to-transparent rounded-xl">
                      <span className="text-gray-300">Subtotal ({itemCount} artículos)</span>
                      <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/50 to-transparent rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">Envío</span>
                      </div>
                      <span className="font-bold text-white">{formatCurrency(delivery)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-6">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-xl border border-yellow-400/20">
                        <span className="text-xl font-bold text-white">Total</span>
                        <span className="text-3xl font-bold text-yellow-400">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {orderSuccess ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-white mb-2">¡Pedido Confirmado!</h4>
                      <p className="text-gray-400">Te contactaremos pronto</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-5 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5" />
                            <span>Proceder al pago</span>
                          </>
                        )}
                      </button>
                      
                      <button className="w-full border-2 border-gray-700 text-gray-300 py-4 px-6 rounded-xl font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10">
                        Continuar comprando
                      </button>
                    </div>
                  )}

                  <div className="mt-8 p-6 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl border border-yellow-400/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg shadow-yellow-400/25"></div>
                      <span className="text-sm font-bold text-yellow-400">Envío gratis disponible</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      En pedidos superiores a $25.000. Tu pedido califica para envío gratuito. 
                      Tiempo estimado: 30-45 minutos.
                    </p>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-gray-800/50 to-transparent rounded-xl">
                      <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-400">Calidad</span>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-gray-800/50 to-transparent rounded-xl">
                      <Truck className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-400">Entrega</span>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-gray-800/50 to-transparent rounded-xl">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-400">Garantía</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;