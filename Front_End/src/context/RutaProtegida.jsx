// src/components/RutaProtegida.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutaProtegida = ({ rolRequerido }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/LR" replace />;
  }

  if (rolRequerido && user.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RutaProtegida;
