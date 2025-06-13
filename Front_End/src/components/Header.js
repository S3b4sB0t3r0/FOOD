import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
  FaBars, FaTimes, FaUser
} from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

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
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="left-info">
          <FaMapMarkerAlt />
          <span>Colombia - Bogotá</span>
          <span className="divider">/</span>
          <FaClock />
          <span> L-V 8:00AM - 5:30PM / S-D 7:00AM - 5:30PM / F 9:30AM - 3:30PM</span>
        </div>
        <div className="social-icons">
          <span>Síguenos:</span>
          <FaFacebookF />
          <FaTwitter />
          <FaLinkedinIn />
          <FaInstagram />
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="icon" />
          <div className="text">
            <h2>Frank Furt</h2>
            <small>Comidas Rápidas</small>
          </div>
        </div>

        <ul className={`nav-menu ${mobileOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={handleLinkClick}>Inicio</Link></li>

          <li
            className={`has-dropdown ${openDropdown === 'pages' ? 'active' : ''}`}
            onClick={() => toggleDropdown('pages')}
          >
            Páginas
            <ul className="dropdown">
              <li><Link to="/about" onClick={handleLinkClick}>Nosotros</Link></li>
              <li><Link to="/equipo" onClick={handleLinkClick}>Equipo</Link></li>
              <li><Link to="/servicios" onClick={handleLinkClick}>Servicios</Link></li>
            </ul>
          </li>

          <li
            className={`has-dropdown ${openDropdown === 'food' ? 'active' : ''}`}
            onClick={() => toggleDropdown('food')}
          >
            <Link to="/menu" onClick={handleLinkClick}>Menú</Link>
            <ul className="dropdown">
              <li><a href={getMenuLink('entradas')} onClick={handleLinkClick}>Entradas</a></li>
              <li><a href={getMenuLink('platosprincipales')} onClick={handleLinkClick}>Platos Principales</a></li>
              <li><a href={getMenuLink('postres')} onClick={handleLinkClick}>Postres</a></li>
              <li><a href={getMenuLink('bebidas')} onClick={handleLinkClick}>Bebidas</a></li>
            </ul>
          </li>

          <li><Link to="#" onClick={handleLinkClick}>Ubicaciones</Link></li>
          <li><Link to="/contact" onClick={handleLinkClick}>Contacto</Link></li>
        </ul>

        <div className="nav-icons">
          {/* Icono de usuario */}
          <div className="user-menu-container">
            <FaUser
              className="icon-user"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{ cursor: 'pointer' }}
            />
            {userMenuOpen && (
              <ul className="user-dropdown">
                <li><Link to="/LR" onClick={handleLinkClick}>Iniciar Sesión</Link></li>
                <li><Link to="/LR" onClick={handleLinkClick}>Registrarse</Link></li>
              </ul>
            )}
          </div>

          <Link to="/cart" className="order-btn">Comprar Ahora →</Link>
          <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
