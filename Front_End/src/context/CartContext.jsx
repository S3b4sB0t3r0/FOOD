import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Convierte "$5.000", "5000" o 5000 a número 5000 de forma segura
export const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  return Number(priceStr.replace(/[$.]/g, ''));
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const id = product._id;
    const price = parsePrice(product.price);

    // ⚡ Usamos lo que viene del backend
    const minimo = product.minimo || 1;
    const max = product.stock > minimo ? product.stock - minimo : minimo;

    setCart((currentCart) => {
      const existing = currentCart.find(item => item.id === id);

      if (existing) {
        return currentCart.map(item =>
          item.id === id
            ? { ...item, quantity: Math.min(item.quantity + 1, max) }
            : item
        );
      } else {
        return [
          ...currentCart,
          {
            id,
            title: product.title,
            description: product.description || '',
            price,
            image: product.image || '',
            quantity: minimo,    // 👈 arranca en el mínimo permitido
            maxQuantity: max,    // 👈 máximo permitido
            minimo,              // 👈 mínimo permitido
          }
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((currentCart) =>
      currentCart.map(item => {
        if (item.id === id) {
          const max = item.maxQuantity || 1;
          const minimo = item.minimo || 1;
          const newQuantity = item.quantity + delta;

          if (newQuantity < minimo) return { ...item, quantity: minimo };
          if (newQuantity > max) return { ...item, quantity: max };
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
