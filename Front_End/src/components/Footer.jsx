import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative">
        {/* Sección principal */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Logo y descripción */}
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <div className="inline-block">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-yellow-400/25">
                    <span className="font-bold text-xl">V</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  El Vandalo Grill
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Experiencia gastronómica única donde cada plato cuenta una historia. 
                  Sabores auténticos que despiertan tus sentidos.
                </p>
              </div>
              
              {/* Redes sociales */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-300">Síguenos</p>
                <div className="flex space-x-3">
                  {[
                    { icon: Facebook, href: '#', label: 'Facebook' },
                    { icon: Instagram, href: '#', label: 'Instagram' },
                    { icon: Twitter, href: '#', label: 'Twitter' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn' }
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300 group"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                Enlaces Rápidos
              </h3>
              <nav className="space-y-3">
                {[
                  'Inicio',
                  'Acerca de Nosotros',
                  'Menú Digital',
                  'Promociones',
                  'Reservaciones',
                  'Blog Gastronómico'
                ].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-300 group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="text-sm">{link}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Información de contacto */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                Contacto
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    text: 'Bogotá, Colombia',
                    subtext: 'Zona Rosa - Chapinero'
                  },
                  {
                    icon: Phone,
                    text: '+57 310 286 2229',
                    subtext: 'WhatsApp disponible'
                  },
                  {
                    icon: Mail,
                    text: 'frankfurt28@gmail.com',
                    subtext: 'Respuesta en 24hrs'
                  }
                ].map(({ icon: Icon, text, subtext }) => (
                  <div key={text} className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 rounded-lg flex items-center justify-center mt-0.5">
                      <Icon className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{text}</p>
                      <p className="text-xs text-gray-500">{subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Horarios y extras */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                Horarios
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium">Lun - Dom</p>
                    <p className="text-gray-400">11:00 AM - 11:00 PM</p>
                    <p className="text-xs text-gray-500 mt-1">Delivery hasta 10:30 PM</p>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-white">4.8</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    +500 reseñas satisfechas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Footer bottom */}
        <div className="border-t border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <p>&copy; 2025 Frank Furt. Todos los derechos reservados.</p>
              </div>
              
              <div className="flex items-center space-x-6 text-xs text-gray-500">
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Términos de Servicio
                </a>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Política de Privacidad
                </a>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Cookies
                </a>
              </div>
              
              <div className="flex items-center text-xs text-gray-500">
                <span>Hecho con</span>
                <Heart className="w-3 h-3 mx-1 text-red-500 fill-current" />
                <span>en Colombia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;