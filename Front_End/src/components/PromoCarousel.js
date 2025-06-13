// src/components/PromoCarousel.js
import React, { useState, useEffect } from 'react';
import '../styles/PromoCarousel.css';

const slides = [
  {
    id: 1,
    text: '🔥 2x1 en todas las hamburguesas los viernes',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
  },
  {
    id: 2,
    text: '🍕 Envío gratis en pedidos mayores a $20',
    image: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
  },
  {
    id: 3,
    text: '🥗 Nueva línea saludable: ensaladas frescas',
    image: 'https://comedera.com/wp-content/uploads/sites/9/2024/10/ensalada-mediterranea-de-tomate-aceitunas-y-queso-feta.jpg',
  },
  {
    id: 4,
    text: '🍔 Combo familiar: 4 hamburguesas + papas + refrescos',
    image: 'https://media.istockphoto.com/id/600056274/es/foto/comida-r%C3%A1pida-para-llevar-hamburguesa-cola-y-patatas-fritas-sobre-madera.jpg?s=612x612&w=0&k=20&c=-SOnUc2j1QymeK_z07d_xuTtg9Xf-3ikRzn5pLwtWF0=',
  },
  {
    id: 5,
    text: '🍦 Postre gratis con tu pedido de $30 o más',
    image: 'https://www.paulinacocina.net/wp-content/uploads/2024/01/receta-de-postre-de-maracuya-Paulina-Cocina-Recetas-1722251880-1200x676.jpg',
  },
];

const PromoCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="promo-carousel">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-text">{slide.text}</div>
        </div>
      ))}
    </section>
  );
};

export default PromoCarousel;
