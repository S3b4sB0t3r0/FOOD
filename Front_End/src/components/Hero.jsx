import React from 'react';
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Award, Clock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 border border-yellow-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-yellow-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-8 w-8 h-8 bg-yellow-400/20 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-8">
            <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
              <Award className="w-4 h-4" />
              Calidad Garantizada
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Somos 
            <span className="block text-yellow-400 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              El Vandalo Grill
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Disfrute de las mejores comidas con los mejores precios y lo más importante: 
            <span className="text-yellow-400 font-semibold"> decidiendo qué comer</span>
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-gray-300">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Calidad Premium</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span>Entrega Rápida</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Award className="w-5 h-5 text-yellow-400" />
              <span>Mejor Precio</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/cart">
          <button className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105 inline-flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
            COMPRA AHORA
          </button>
        </Link>
            
            <Link to="/menu">
            <button className="border-2 border-yellow-400 text-yellow-400 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25 hover:transform hover:scale-105">
              VER MENÚ
            </button>
            </Link>
          </div>

          {/* Bottom Decorative Line */}
          <div className="mt-16 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="absolute bottom-8 right-8">
        <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-110">
          <ShoppingCart className="w-6 h-6" />
        </button>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping animation-delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping animation-delay-700"></div>
      </div>
    </section>
  );
};

export default Hero;