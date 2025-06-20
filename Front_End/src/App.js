// src/App.js
import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './context/RutaProtegida';


// pages
import PaginaPrincipal from './pages/PaginaPrincipal';
import AboutPage from './pages/AboutPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import TeamPage from './pages/TeamPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/Contacto';
import Login_Register from './pages/L-R';
import PasswordReset from './pages/RestablecerContraseña';
import PasswordChange from './pages/CambioContraseña';
import FoodChainDashboard from './Administrador/dashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/equipo" element={<TeamPage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/LR" element={<Login_Register />} />
            <Route path="/restablecer" element={<PasswordReset />} />
            <Route path="/cambio" element={<PasswordChange />} />

            {/* 🔐 Ruta protegida solo para administradores */}
            <Route element={<RutaProtegida rolRequerido="administrador" />}>
              <Route path="/Admin" element={<FoodChainDashboard />} />
            </Route>

            {/* Ejemplo adicional para usuarios autenticados (sin importar rol) */}
            {/* 
            <Route element={<RutaProtegida />}>
              <Route path="/cuenta" element={<Cuenta />} />
            </Route>
            */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
