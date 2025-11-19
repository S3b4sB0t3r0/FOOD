// src/Cliente/components/ProfileTabs.jsx
import React from 'react';
import { User, ShoppingBag, Settings } from 'lucide-react';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <section className="py-8 px-4 bg-black border-b border-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'info'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
                : 'bg-gray-800 text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
            }`}
          >
            <User className="w-5 h-5 inline mr-2" />
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
                : 'bg-gray-800 text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5 inline mr-2" />
            Historial de Compras
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black'
                : 'bg-gray-800 text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
            }`}
          >
            <Settings className="w-5 h-5 inline mr-2" />
            Configuración
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileTabs;