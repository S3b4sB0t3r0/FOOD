import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin, Clock, Facebook, Twitter, Linkedin, Instagram,
  Menu, X, User, ShoppingCart, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // IMPORTAR
import LOGO from '../img/LOGO.png';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth(); // USAR contexto

  const toggleDropdown = (name) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  const handleLinkClick = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setUserMenuOpen(false);
  };

  const getMenuLink = (section) => {
    return location.pathname === '/menu' ? `#${section}` : `/menu#${section}`;
  };

  return (
    <header className="relative">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            {/* Información izquierda */}
            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span>Colombia - Bogotá</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="hidden lg:inline">L-V 8:00AM - 5:30PM / S-D 7:00AM - 5:30PM / F 9:30AM - 3:30PM</span>
                <span className="lg:hidden">L-D 7:00AM - 5:30PM</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="flex items-center space-x-3 mt-2 md:mt-0">
              <span className="text-gray-400 text-xs">Síguenos:</span>
              <div className="flex space-x-2">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' },
                  { icon: Instagram, href: '#' }
                ].map(({ icon: Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                  >
                    <Icon className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Principal */}
      <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/25 overflow-hidden">
                <img 
                  src={LOGO} 
                  alt="El Vandalo Grill Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="text">
                <h2 className="text-xl font-bold text-white">El Vandalo Grill</h2>
                <small className="text-yellow-400 text-xs font-medium">Comidas Rápidas</small>
              </div>
            </div>

            {/* Menu Desktop */}
            <ul className="hidden lg:flex items-center space-x-8">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-300 relative group"
                >
                  Inicio
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>

              {/* Dropdown Páginas */}
              <li className="relative group">
                <button
                  className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-300"
                  onClick={() => toggleDropdown('pages')}
                >
                  <span>Páginas</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'pages' ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`absolute top-full left-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${openDropdown === 'pages' ? 'opacity-100 visible translate-y-0' : ''}`}>
                  <div className="py-2">
                    {[
                      { to: '/about', label: 'Nosotros' },
                      { to: '/equipo', label: 'Equipo' },
                      { to: '/servicios', label: 'Servicios' }
                    ].map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={handleLinkClick}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Dropdown Menú */}
              <li className="relative group">
                <Link
                  to="/menu"
                  className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-300"
                  onClick={() => toggleDropdown('food')}
                >
                  <span>Menú</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'food' ? 'rotate-180' : ''}`} />
                </Link>
                
                <div className={`absolute top-full left-0 mt-2 w-52 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${openDropdown === 'food' ? 'opacity-100 visible translate-y-0' : ''}`}>
                  <div className="py-2">
                    {[
                      { href: getMenuLink('entradas'), label: 'Entradas' },
                      { href: getMenuLink('platosprincipales'), label: 'Platos Principales' },
                      { href: getMenuLink('postres'), label: 'Postres' },
                      { href: getMenuLink('bebidas'), label: 'Bebidas' }
                    ].map(({ href, label }) => (
                      <a
                        key={href}
                        href={href}
                        onClick={handleLinkClick}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </li>

              <li>
                <Link 
                  to="/contacto" 
                  className="text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-300 relative group"
                >
                  Contacto
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>

            {/* Iconos derecha */}
            <div className="flex items-center space-x-4">
                  {/* Menú de usuario */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300"
                    >
                      <User className="w-5 h-5" />
                    </button>
                
                    {userMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl">
              <div className="py-2">
                {user ? (
                  <>
                    <Link
                      to="/cuenta" // o ruta que uses para perfil
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                    >
                      Cuenta
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        handleLinkClick();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/LR"
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/LR"
                      onClick={handleLinkClick}
                      className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

              {/* Botón de compra */}
              <Link
                to="/cart"
                className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/25"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Comprar Ahora</span>
              </Link>

              {/* Menu toggle mobile */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-all duration-300"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <div className={`lg:hidden border-t border-gray-800/50 transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-sm">
            <div className="py-4 px-4 space-y-2">
              
              <Link
                to="/"
                onClick={handleLinkClick}
                className="block py-3 px-4 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all duration-300"
              >
                Inicio
              </Link>

              {/* Páginas mobile */}
              <div>
                <button
                  onClick={() => toggleDropdown('pages')}
                  className="flex items-center justify-between w-full py-3 px-4 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all duration-300"
                >
                  <span>Páginas</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'pages' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'pages' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <Link to="/about" onClick={handleLinkClick} className="block py-2 px-4 text-sm text-gray-400 hover:text-yellow-400 transition-colors">Nosotros</Link>
                  <Link to="/equipo" onClick={handleLinkClick} className="block py-2 px-4 text-sm text-gray-400 hover:text-yellow-400 transition-colors">Equipo</Link>
                  <Link to="/servicios" onClick={handleLinkClick} className="block py-2 px-4 text-sm text-gray-400 hover:text-yellow-400 transition-colors">Servicios</Link>
                </div>
              </div>

              {/* Menú mobile */}
              <div>
                <Link
                  to="/menu"
                  onClick={() => toggleDropdown('food')}
                  className="flex items-center justify-between w-full py-3 px-4 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all duration-300"
                >
                  <span>Menú</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'food' ? 'rotate-180' : ''}`} />
                </Link>
                <div className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'food' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <a href={getMenuLink('entradas')} onClick={handleLinkClick} className="block py-2 px-4 text-sm text-gray-400 hover:text-yellow-400 transition-colors">Entradas</a>
                  <a href={getMenuLink('platosprincipales')} onClick={handleLinkClick} className="block py-2 px-4 text-sm text-gray-400 hover:text-yellow-400 transition-colors">Platos Principales</a>
                  <a href={getMenuLink('postres')} onClick={handleLinkClick} className="block py-2 px-4 text-sm text-gray-400 hover:text-yellow-400 transition-colors">Postres</a>
                  <a href={getMenuLink('bebidas')} onClick={handleLinkClick} className="block py-2 px-4 text-sm text-gray-400 hover:text-yellow-400 transition-colors">Bebidas</a>
                </div>
              </div>

              <Link
                to="/contacto"
                onClick={handleLinkClick}
                className="block py-3 px-4 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all duration-300"
              >
                Contacto
              </Link>

              {/* Botón comprar mobile */}
              <Link
                to="/cart"
                onClick={handleLinkClick}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 mt-4"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Comprar Ahora</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;