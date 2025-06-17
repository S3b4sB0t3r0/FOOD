import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Star, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Aquí iría la lógica para enviar el formulario
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Ubicación Principal',
      details: ['Av. Libertador 1234', 'Bogotá, Colombia'],
      extra: 'Centro Comercial Gran Plaza'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Teléfonos',
      details: ['+57 1 234-5678', '+57 300 123-4567'],
      extra: 'Línea de pedidos 24/7'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Correo Electrónico',
      details: ['info@turestaurante.com', 'pedidos@turestaurante.com'],
      extra: 'Respuesta en menos de 2 horas'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Horarios de Atención',
      details: ['Lun - Dom: 10:00 AM - 11:00 PM', 'Delivery 24/7'],
      extra: 'Servicio continuo'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
    <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
              Estamos Aquí Para Ti
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Contáctanos
            <span className="block text-yellow-400">Hoy Mismo</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            ¿Tienes preguntas, sugerencias o quieres hacer un pedido especial? 
            Estamos listos para ayudarte y brindarte la mejor atención.
          </p>
          <div className="mt-12 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Múltiples Formas de <span className="text-yellow-400">Conectar</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Elige la opción que más te convenga para ponerte en contacto con nosotros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black group-hover:shadow-lg group-hover:shadow-yellow-400/25 transition-all duration-300">
                    {info.icon}
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-400 mb-1 group-hover:text-gray-300 transition-colors duration-300">
                      {detail}
                    </p>
                  ))}
                  <p className="text-yellow-400 text-sm mt-2 font-medium">
                    {info.extra}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
              
              <div className="relative">
                <div className="text-center mb-12">
                  <MessageCircle className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black mx-auto mb-6 shadow-lg shadow-yellow-400/25" />
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Envíanos un <span className="text-yellow-400">Mensaje</span>
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Completa el formulario y te responderemos lo antes posible
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                    <h4 className="text-2xl font-bold text-white mb-4">¡Mensaje Enviado!</h4>
                    <p className="text-gray-400">
                      Gracias por contactarnos. Te responderemos muy pronto.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">Nombre Completo</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Correo Electrónico</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">Teléfono</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                          placeholder="+57 300 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Asunto</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                        >
                          <option value="">Selecciona un asunto</option>
                          <option value="pedido">Pedido Especial</option>
                          <option value="sugerencia">Sugerencia</option>
                          <option value="queja">Queja o Reclamo</option>
                          <option value="felicitacion">Felicitación</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Mensaje</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300 resize-none"
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                      ></textarea>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105 inline-flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Enviar Mensaje
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Encuéntranos Fácilmente
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Visítanos en cualquiera de nuestras ubicaciones o haz tu pedido online
            </p>
          </div>
          
          <div className="bg-black rounded-3xl p-8 shadow-2xl">
            <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-white text-lg">Mapa Interactivo</p>
                <p className="text-gray-400">Integración con Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            ¿Necesitas Ayuda <span className="text-yellow-400">Inmediata?</span>
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105">
              Llamar Ahora
            </button>
            <button className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300">
              Chat en Vivo
            </button>
            <button className="border-2 border-gray-600 text-gray-400 px-8 py-4 rounded-xl font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300">
              FAQ
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;