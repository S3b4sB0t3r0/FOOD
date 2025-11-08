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
import LoginRegister  from './pages/LoginRegister';
import PasswordReset from './pages/RestablecerContraseña';
import PasswordChange from './pages/CambioContraseña';
import ProfilePage from './pages/Cuenta';
import FoodChainDashboard from './Admin/dashboard';
import EmployeeDashboard from './Employee/dashboard';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/equipo" element={<TeamPage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/LR" element={<LoginRegister />} />
            <Route path="/restablecer" element={<PasswordReset />} />
            <Route path="/recuperar/:token" element={<PasswordChange />} />

            {/* Ruta protegida solo para administradores */}
            <Route element={<RutaProtegida rolRequerido="administrador" />}>
              <Route path="/Admin" element={<FoodChainDashboard />} />
            </Route>

            {/* Empleado */}
            <Route element={<RutaProtegida rolRequerido="empleado" />}>
              <Route path="/empleados" element={<EmployeeDashboard />} />
            </Route> 

            {/* Rutas protegidas para clientes */}
            <Route element={<RutaProtegida />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/cuenta" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
