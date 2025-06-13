// src/components/Footer.js
import React from 'react';
import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt
} from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        <div className="footer-logo">
          <h2>FRANK FURT</h2>
          <p>Tus comidas favoritas solo aqui.</p>
          <div className="socials">
            <FaFacebookF />
            <FaTwitter />
            <FaLinkedinIn />
            <FaInstagram />
          </div>
        </div>

        <div className="footer-links">
          <h3>Paginas</h3>
          <ul>
            <li>Inicio</li>
            <li>Acerca de nosotros</li>
            <li>Menu</li>
            <li>Contacto</li>
            <li>Ubicaciones</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contacto</h3>
          <ul>
            <li><FaMapMarkerAlt /> Colombia - Bogota</li>
            <li><FaPhone /> 3102862229</li>
            <li><FaEnvelope /> frankfurt28@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; 2025 Frank Furt. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
