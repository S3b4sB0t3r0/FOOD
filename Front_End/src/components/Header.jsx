import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin, Clock, Facebook, Twitter, Linkedin, Instagram,
  Menu, X, User, ShoppingCart, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LOGO from '../img/LOGO.png';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, token, logout } = useAuth();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);


  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleLinkClick = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setUserMenuOpen(false);
  };

  const getMenuLink = (section) => {
    return location.pathname === '/menu' ? `#${section}` : `/menu#${section}`;
  };

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  return (
    <header className="relative">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span>Colombia - Bogotá</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="hidden lg:inline">L-D 1:00PM - 10:30PM</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-2 md:mt-0">
              <span className="text-gray-400 text-xs">Síguenos:</span>
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
                >
                  <Icon className="w-3 h-3" />
                </a>
              ))}
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
                <img src={LOGO} alt="El Vandalo Grill Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="text">
                <h2 className="text-xl font-bold text-white">El Vandalo Grill</h2>
                <small className="text-yellow-400 text-xs font-medium">Comidas Rápidas</small>
              </div>
            </div>

            {/* Menu Desktop */}
            <ul className="hidden lg:flex items-center space-x-8">
              <li><Link to="/" className="text-gray-300 hover:text-yellow-400 font-medium">Inicio</Link></li>

              <li className="relative group">
                <button onClick={() => toggleDropdown('pages')} className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 font-medium">
                  <span>Páginas</span>
                  <ChevronDown className={`w-4 h-4 ${openDropdown === 'pages' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'pages' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl z-50">
                    <Link to="/about" onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Nosotros</Link>
                    <Link to="/equipo" onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Equipo</Link>
                    <Link to="/servicios" onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Servicios</Link>
                  </div>
                )}
              </li>

              <li className="relative group">
                <Link to="/menu" onClick={() => toggleDropdown('food')} className="flex items-center space-x-1 text-gray-300 hover:text-yellow-400 font-medium">
                  <span>Menú</span>
                  <ChevronDown className={`w-4 h-4 ${openDropdown === 'food' ? 'rotate-180' : ''}`} />
                </Link>
                {openDropdown === 'food' && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl z-50">
                    <a href={getMenuLink('entradas')} onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Entradas</a>
                    <a href={getMenuLink('platosprincipales')} onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Platos Principales</a>
                    <a href={getMenuLink('postres')} onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Postres</a>
                    <a href={getMenuLink('bebidas')} onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Bebidas</a>
                  </div>
                )}
              </li>

              <li><Link to="/contacto" className="text-gray-300 hover:text-yellow-400 font-medium">Contacto</Link></li>
            </ul>

            {/* Iconos derecha */}
            <div className="flex items-center space-x-4">
              {/* Usuario */}
              <div className="relative flex items-center space-x-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Dropdown cuando hay usuario */}
                {userMenuOpen && user && token && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl">
                    <div className="py-3 px-4 border-b border-gray-700">
                      <p className="text-sm font-semibold text-yellow-400 truncate">
                        {getFirstName(user.name)}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.rol}</p>
                    </div>
                    <div className="py-2">
                      <Link to="/cuenta" onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Cuenta</Link>
                      <button
                        onClick={() => { logout(); handleLinkClick(); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-yellow-400"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}

                {/* Dropdown cuando NO hay usuario */}
                {userMenuOpen && !user && !token && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl">
                    <div className="py-2">
                      <Link to="/LR" onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Iniciar Sesión</Link>
                      <Link to="/LR" onClick={handleLinkClick} className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-400">Registrarse</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de compra */}
              {user && token && (
                <Link to="/cart" className="relative hidden md:flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/25">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Comprar Ahora</span>
                  
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-400"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="bg-gradient-to-b from-gray-900/95 to-black/95 px-4 py-4 space-y-2">
            <Link to="/" onClick={handleLinkClick} className="block py-3 px-4 text-gray-300 hover:text-yellow-400">Inicio</Link>
            <Link to="/about" onClick={handleLinkClick} className="block py-3 px-4 text-gray-300 hover:text-yellow-400">Nosotros</Link>
            <Link to="/equipo" onClick={handleLinkClick} className="block py-3 px-4 text-gray-300 hover:text-yellow-400">Equipo</Link>
            <Link to="/servicios" onClick={handleLinkClick} className="block py-3 px-4 text-gray-300 hover:text-yellow-400">Servicios</Link>
            <Link to="/menu" onClick={handleLinkClick} className="block py-3 px-4 text-gray-300 hover:text-yellow-400">Menú</Link>
            <Link to="/contacto" onClick={handleLinkClick} className="block py-3 px-4 text-gray-300 hover:text-yellow-400">Contacto</Link>

            {user && token && (
              <div className="flex flex-col items-start px-4 py-2 bg-gray-800 rounded-md text-yellow-400 font-medium">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Bienvenido, {getFirstName(user.name)}
                </div>
                <span className="text-xs text-gray-400">{user.rol}</span>
              </div>
            )}

            {user && token && (
              <Link to="/cart" onClick={handleLinkClick} className="block text-center mt-4 py-3 px-4 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition">
                Comprar Ahora
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
