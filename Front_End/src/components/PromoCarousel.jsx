import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Pause, Star, Gift, Truck, Users, IceCream2 } from 'lucide-react';

const slides = [
  {
    id: 1,
    text: '2x1 en todas las hamburguesas los viernes',
    subtitle: 'La mejor oferta de la semana',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
    icon: <Star className="w-8 h-8" />,
    color: 'from-red-600 to-orange-500'
  },
  {
    id: 2,
    text: 'Envío gratis en pedidos mayores a $20',
    subtitle: 'Ahorra en cada pedido',
    image: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
    icon: <Truck className="w-8 h-8" />,
    color: 'from-green-600 to-emerald-500'
  },
  {
    id: 3,
    text: 'Nueva línea saludable: ensaladas frescas',
    subtitle: 'Nutrición y sabor en cada bocado',
    image: 'https://comedera.com/wp-content/uploads/sites/9/2024/10/ensalada-mediterranea-de-tomate-aceitunas-y-queso-feta.jpg',
    icon: <Gift className="w-8 h-8" />,
    color: 'from-green-500 to-lime-400'
  },
  {
    id: 4,
    text: 'Combo familiar: 4 hamburguesas + papas + refrescos',
    subtitle: 'Perfecto para compartir',
    image: 'https://media.istockphoto.com/id/600056274/es/foto/comida-r%C3%A1pida-para-llevar-hamburguesa-cola-y-patatas-fritas-sobre-madera.jpg?s=612x612&w=0&k=20&c=-SOnUc2j1QymeK_z07d_xuTtg9Xf-3ikRzn5pLwtWF0=',
    icon: <Users className="w-8 h-8" />,
    color: 'from-blue-600 to-purple-500'
  },
  {
    id: 5,
    text: 'Postre gratis con tu pedido de $30 o más',
    subtitle: 'El final perfecto para tu comida',
    image: 'https://www.paulinacocina.net/wp-content/uploads/2024/01/receta-de-postre-de-maracuya-Paulina-Cocina-Recetas-1722251880-1200x676.jpg',
    icon: <IceCream2 className="w-8 h-8" />,
    color: 'from-pink-600 to-rose-500'
  },
];

const PromoCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative h-96 md:h-[500px] bg-black overflow-hidden">
      {/* Main Carousel */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current 
                ? 'opacity-100 scale-100 z-10' 
                : 'opacity-0 scale-105 z-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-30`}></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center px-4">
              <div className="max-w-4xl mx-auto text-center">
                {/* Icon */}
                <div className="inline-block mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-yellow-400/25">
                    {slide.icon}
                  </div>
                </div>

                {/* Main Text */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {slide.text}
                </h2>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>

                {/* CTA Button */}
                <Link to ="/menu">
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105">
                  ¡Aprovecha Ahora!
                </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {/* Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? 'bg-yellow-400 w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30 z-20">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 right-8 w-20 h-20 border border-yellow-400/30 rounded-full animate-pulse z-10"></div>
      <div className="absolute bottom-20 left-8 w-16 h-16 bg-yellow-400/10 rounded-full animate-bounce z-10"></div>
    </section>
  );
};

export default PromoCarousel;