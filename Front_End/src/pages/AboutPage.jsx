import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLayoutEffect } from 'react';
import { FaUtensils, FaTruck, FaUsers, FaStar, FaHeart, FaAward, FaGlobe, FaRocket, FaLeaf, FaHandshake, FaChevronDown, FaPlay } from 'react-icons/fa';

const AboutPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [expandedFaq, setExpandedFaq] = useState(null);

  const testimonials = [
    {
      name: "María González",
      role: "Cliente Frecuente",
      text: "La calidad de la comida es excepcional. Siempre fresca y deliciosa. Mi lugar favorito para comer rápido.",
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      role: "Empresario Local",
      text: "Perfecto para reuniones de trabajo. El servicio es rápido y la comida siempre está perfecta.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Madre de Familia",
      text: "Mis hijos adoran venir aquí. El ambiente familiar y la comida saludable nos encanta.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Clientes Satisfechos", icon: FaUsers },
    { number: "25+", label: "Ubicaciones", icon: FaGlobe },
    { number: "20+", label: "Años de Experiencia", icon: FaAward },
    { number: "99%", label: "Satisfacción Cliente", icon: FaStar }
  ];

  const values = [
    {
      icon: FaHeart,
      title: "Pasión por la Calidad",
      description: "Cada plato es preparado con ingredientes frescos y amor por lo que hacemos."
    },
    {
      icon: FaLeaf,
      title: "Sostenibilidad",
      description: "Comprometidos con el medio ambiente y prácticas sostenibles en toda nuestra operación."
    },
    {
      icon: FaHandshake,
      title: "Compromiso Social",
      description: "Apoyamos a nuestra comunidad local y contribuimos al desarrollo social."
    },
    {
      icon: FaRocket,
      title: "Innovación Constante",
      description: "Siempre buscamos nuevas formas de mejorar y sorprender a nuestros clientes."
    }
  ];

  const faqs = [
    {
      question: "¿Cuáles son nuestros horarios de atención?",
      answer: "Estamos abiertos de lunes a domingo de 10:00 AM a 11:00 PM, incluyendo días festivos."
    },
    {
      question: "¿Ofrecen servicio de delivery?",
      answer: "Sí, tenemos servicio de delivery disponible en todas nuestras ubicaciones con tiempo estimado de 30-45 minutos."
    },
    {
      question: "¿Tienen opciones vegetarianas y veganas?",
      answer: "Por supuesto, contamos con una amplia variedad de opciones vegetarianas y veganas en nuestro menú."
    },
    {
      question: "¿Cómo puedo hacer una reserva?",
      answer: "Puedes hacer reservas a través de nuestra página web, llamando directamente o usando nuestra app móvil."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Visible:", entry.target.id); // Puedes quitar esto luego
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);
  
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));
  
    // Fallback en caso de que el observer no active
    const fallbackTimeout = setTimeout(() => {
      const fallbackVisibility = {};
      elements.forEach((el) => {
        fallbackVisibility[el.id] = true;
      });
      setIsVisible(prev => ({ ...fallbackVisibility, ...prev }));
    }, 3000);
  
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, []);
  

  const AnimatedSection = ({ children, id, className = "", delay = 0 }) => (
    <div
      id={id}
      data-animate
      className={`transition-all duration-1000 ${
        isVisible[id] 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30 animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-black text-black mb-6 animate-bounce">
              Acerca de <span className="text-white drop-shadow-lg">Nosotros</span>
            </h1>
            <p className="text-2xl md:text-3xl text-black font-semibold mb-8 max-w-4xl mx-auto leading-relaxed">
              Transformamos momentos ordinarios en experiencias extraordinarias a través del sabor
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-xl">
                <FaPlay className="inline mr-2" />
                Ver Nuestra Historia
              </button>
              <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Conocer Más
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-white rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-black rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white rounded-full opacity-10 animate-pulse"></div>
      </section>

      {/* Stats Section */}
      <AnimatedSection id="stats" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-2xl text-black" />
                </div>
                <div className="text-4xl font-black text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-white font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* About Introduction */}
      <AnimatedSection id="intro" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black text-black mb-8">
                ¿Quiénes <span className="text-yellow-400">Somos?</span>
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Somos una empresa apasionada por la comida rápida, que nació con el propósito de ofrecer platos sabrosos,
                atención cercana y momentos inolvidables.
              </p>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Con más de dos décadas de experiencia, hemos crecido manteniendo siempre nuestros valores fundamentales:
                calidad excepcional, sabor auténtico y compromiso inquebrantable con nuestros clientes.
              </p>
              <div className="flex space-x-4">
                <button className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300">
                  Nuestra Misión
                </button>
                <button className="border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition-all duration-300">
                  Nuestra Visión
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/api/placeholder/500/400" 
                  alt="Nuestro equipo" 
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-black text-yellow-400 p-4 rounded-2xl shadow-xl">
                <FaHeart className="text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Timeline Section */}
      <AnimatedSection id="timeline" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6">
              Nuestra <span className="text-yellow-400">Historia</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un viaje de más de 20 años construyendo sabores y creando sonrisas
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-400"></div>
            
            {[
              {
                year: "2002",
                title: "Fundación",
                description: "Todo comenzó con una pequeña cocina familiar y una gran pasión por la comida rápida de calidad.",
                icon: FaUtensils,
                side: "left"
              },
              {
                year: "2005",
                title: "Primer Restaurante",
                description: "Abrimos nuestra primera sede con servicio a domicilio y atención personalizada que nos caracteriza.",
                icon: FaTruck,
                side: "right"
              },
              {
                year: "2015",
                title: "Expansión Nacional",
                description: "Gracias al apoyo incondicional de nuestros clientes, nos expandimos a múltiples ciudades del país.",
                icon: FaUsers,
                side: "left"
              },
              {
                year: "2020",
                title: "Reconocimiento",
                description: "Fuimos reconocidos como una de las mejores cadenas de comida rápida a nivel nacional.",
                icon: FaStar,
                side: "right"
              }
            ].map((item, index) => (
              <div key={index} className={`relative flex items-center mb-16 ${item.side === 'right' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-1/2 ${item.side === 'right' ? 'pl-16' : 'pr-16'}`}>
                  <div className={`bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${item.side === 'right' ? 'ml-auto' : ''}`}>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                        <item.icon className="text-black text-xl" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black">{item.year}</h3>
                        <h4 className="text-xl font-semibold text-yellow-400">{item.title}</h4>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white shadow-lg z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Values Section */}
      <AnimatedSection id="values" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-6">
              Nuestros <span className="text-yellow-400">Valores</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Los principios que guían cada decisión y cada plato que servimos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <value.icon className="text-3xl text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection id="testimonials" className="py-20 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6">
              Lo Que Dicen <span className="text-white">Nuestros Clientes</span>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-2xl mx-1" />
                  ))}
                </div>
                <p className="text-2xl text-gray-700 mb-8 leading-relaxed italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div>
                  <h4 className="text-xl font-bold text-black">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? 'bg-black' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-6">
              Preguntas <span className="text-yellow-400">Frecuentes</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-yellow-400 transition-all duration-300">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-300"
                >
                  <span className="text-xl font-semibold text-black">{faq.question}</span>
                  <FaChevronDown className={`text-yellow-400 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            ¿Listo para <span className="text-yellow-400">Vivir la Experiencia?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Únete a miles de clientes satisfechos y descubre por qué somos la mejor opción en comida rápida
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-yellow-400 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-xl">
              Ver Nuestro Menú
            </button>
            <button className="border-2 border-yellow-400 text-yellow-400 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300">
              Encontrar Ubicación
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
    <Footer />
    </div>
  );
};

export default AboutPage;