// src/App.js
import './index.css'; // o './App.css' dependiendo del nombre que usas
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaPrincipal from './pages/PaginaPrincipal';
import AboutPage from './pages/AboutPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage'; 
import { CartProvider } from './context/CartContext';
import TeamPage from './pages/TeamPage';
import ServicesPage from './pages/ServicesPage';
import FoodChainDashboard from './Administrador/dashboard';
import ContactPage from './pages/Contacto'
import Login_Register from './pages/L-R'

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/Admin" element={<FoodChainDashboard />} />
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/equipo" element={<TeamPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/LR" element={<Login_Register />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
