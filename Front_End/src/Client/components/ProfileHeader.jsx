// src/Cliente/components/ProfileHeader.jsx
import React from 'react';

const ProfileHeader = ({ userName }) => {
  return (
    <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-block mb-6">
          <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
            Mi Perfil
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Hola, <span className="text-yellow-400">{userName}</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Gestiona tu información personal y revisa tu historial de pedidos
        </p>
      </div>
    </section>
  );
};

export default ProfileHeader;