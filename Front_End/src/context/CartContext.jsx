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
    // AHORA USAMOS EL _id ÚNICO DEL PRODUCTO COMO IDENTIFICADOR
    const id = product._id;
    const price = parsePrice(product.price);

    setCart((currentCart) => {
      // BUSCAMOS USANDO EL _id, no el título
      const existing = currentCart.find(item => item.id === id);

      if (existing) {
        return currentCart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...currentCart,
          {
            id, // El id ahora es el _id de MongoDB
            title: product.title,
            description: product.description || '',
            price,
            image: product.image || '',
            quantity: 1,
          }
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    // Filtramos por el _id del producto
    setCart((currentCart) => currentCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    // Actualizamos la cantidad por el _id del producto
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

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};