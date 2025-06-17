// src/components/Hero.js
import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="overlay" />
      <div className="hero-content">
        <h1>Somos El Vandalo Grill</h1>
        <p>Disfrute de las mejores comidas con los mejores precios y lo mas importante decidiendo que comer</p>
        <button className="hero-btn">COMPRA AHORA</button>
      </div>
    </section>
  );
};

export default Hero;
