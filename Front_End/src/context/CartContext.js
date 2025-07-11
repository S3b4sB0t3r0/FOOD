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
    const id = product.title; 
    const price = parsePrice(product.price);

    setCart((currentCart) => {
      const existing = currentCart.find(item => item.id === id);
      if (existing) {
        return currentCart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...currentCart, {
          id,
          title: product.title,
          description: product.description || '',
          price,
          image: product.image || '',
          quantity: 1,
        }];
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
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
