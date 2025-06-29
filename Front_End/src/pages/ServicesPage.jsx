import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from "react-router-dom";
import { Clock, Handshake, Star, Smile, Lightbulb, Heart, ThumbsUp, ChefHat, Award, Shield, Users, Zap } from 'lucide-react';

const services = [
  {
    icon: <ChefHat className="w-8 h-8" />,
    title: 'Menú Variado y Sabroso',
    description: 'Desde hamburguesas clásicas hasta opciones gourmet, cada bocado está diseñado para satisfacer todos los gustos con ingredientes premium.',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Servicio Rápido y Eficiente',
    description: 'Entendemos la importancia del tiempo; por eso, garantizamos un servicio ágil sin comprometer la calidad ni la experiencia.',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Compromiso con la Calidad',
    description: 'Seleccionamos ingredientes frescos y de alta calidad para ofrecerte una experiencia culinaria excepcional en cada visita.',
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: 'Atención Personalizada',
    description: 'Nuestro equipo está siempre listo para atender tus necesidades y asegurarse de que disfrutes cada momento con nosotros.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Ambiente Agradable',
    description: 'Creamos un espacio cómodo y acogedor donde puedes disfrutar de tu comida con amigos y familia en un entorno moderno.',
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Innovación Constante',
    description: 'Siempre estamos buscando nuevas formas de sorprenderte con sabores únicos, promociones especiales y experiencias memorables.',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Compromiso Social',
    description: 'Apoyamos iniciativas locales y trabajamos para contribuir positivamente a nuestra comunidad y el medio ambiente.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Valor por tu Dinero',
    description: 'Ofrecemos precios competitivos sin sacrificar la calidad, para que disfrutes más por menos en cada experiencia gastronómica.',
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
              Servicios Premium
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Servicios
            <span className="block text-yellow-400">Destacados</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            En nuestra cadena de comida rápida, combinamos sabor, rapidez y calidad 
            para brindarte una experiencia gastronómica excepcional.
          </p>
          <div className="mt-12 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Lo Que Nos Hace <span className="text-yellow-400">Únicos</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Cada servicio está diseñado para superar tus expectativas y crear momentos memorables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black group-hover:shadow-lg group-hover:shadow-yellow-400/25 transition-all duration-300">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            ¿Listo para Vivir la Experiencia?
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Descubre por qué somos la opción preferida de miles de clientes satisfechos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
            <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors duration-300 hover:shadow-lg">
              Ver Menú Completo
            </button>
            </Link>
            <Link to="/contacto">
            <button className="border-2 border-black text-black px-8 py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300">
              Encuentranos
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">100+</div>
              <div className="text-gray-400">Productos Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">50K+</div>
              <div className="text-gray-400">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">15</div>
              <div className="text-gray-400">Ubicaciones</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-400">Servicio</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicesPage;