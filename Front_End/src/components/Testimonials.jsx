import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Star, Quote, ChevronLeft, ChevronRight, Users } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Emily Smith',
    text: 'Absolutamente delicioso! La mejor experiencia de comida a domicilio que he tenido. Los sabores son increíbles y la presentación es perfecta.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQamGrmjIeKVlIZ-O57JihteELbYmrajbMOiw&s',
    rating: 5,
    dish: 'Hamburguesa Clásica',
    location: 'Bogotá'
  },
  {
    id: 2,
    name: 'Michael Brown',
    text: 'Excelente calidad y un servicio amable. Recomiendo El Vándalo Grill encarecidamente! Siempre superan mis expectativas.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    dish: 'Parrillada Especial',
    location: 'San Cristóbal'
  },
  {
    id: 3,
    name: 'Sara Wilson',
    text: 'Fresco, caliente y siempre a tiempo. Hago mi pedido todas las semanas! La consistencia en calidad es impresionante.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    dish: 'Alitas BBQ',
    location: 'La Victoria'
  },
  {
    id: 4,
    name: 'Carlos Mendoza',
    text: 'La mejor carne que he probado en Bogotá. El servicio es excepcional y los precios son muy justos. Totalmente recomendado.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    dish: 'Churrasco Premium',
    location: 'Bogotá'
  },
  {
    id: 5,
    name: 'Ana García',
    text: 'Cada vez que vengo con mi familia quedamos encantados. La atención es personalizada y el ambiente es perfecto.',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    dish: 'Plato Familiar',
    location: 'San Cristóbal'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
              Testimonios
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Lo que dicen
            <span className="block text-yellow-400">nuestros clientes</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Miles de clientes satisfechos avalan nuestra calidad y servicio excepcional
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '1000+', label: 'Clientes Felices', icon: Users },
            { number: '5.0', label: 'Calificación Promedio', icon: Star },
            { number: '98%', label: 'Satisfacción', icon: Quote },
            { number: '24/7', label: 'Servicio', icon: Quote }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black mx-auto mb-3">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
            
            <div className="relative">
              <div className="flex items-center justify-center mb-8">
                <Quote className="w-16 h-16 text-yellow-400 opacity-20" />
              </div>
              
              <div className="text-center max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed italic">
                  "{testimonials[currentIndex].text}"
                </p>
                
                <div className="flex justify-center mb-6">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                  />
                  <div className="text-left">
                    <h4 className="text-white font-semibold text-lg">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-yellow-400 text-sm">
                      {testimonials[currentIndex].dish} • {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/80 border border-gray-700 rounded-full flex items-center justify-center text-white hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/80 border border-gray-700 rounded-full flex items-center justify-center text-white hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-yellow-400 w-8' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Quote Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center text-black mb-4">
                  <Quote className="w-5 h-5" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  "{testimonial.text}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 group-hover:border-yellow-400 transition-colors duration-300"
                  />
                  <div>
                    <h4 className="text-white font-semibold group-hover:text-yellow-400 transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {testimonial.dish}
                    </p>
                  </div>
                </div>

                {/* Hover Effect Bar */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿Quieres ser parte de nuestros <span className="text-yellow-400">clientes satisfechos?</span>
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Únete a miles de personas que ya disfrutan de la mejor experiencia gastronómica
          </p>
          <Link to="/cart">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105 inline-flex items-center gap-2">
            <Users className="w-5 h-5" />
            Hacer mi Pedido
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;