// src/pages/PaginaPrincipal.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeaturedMenu from '../components/FeaturedMenu';
import Testimonials from '../components/Testimonials';
import PromoCarousel from '../components/PromoCarousel';

const PaginaPrincipal = () => {
  return (
    <div>
      <Header />
      <Hero />
      <PromoCarousel />
      <FeaturedMenu />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default PaginaPrincipal;
