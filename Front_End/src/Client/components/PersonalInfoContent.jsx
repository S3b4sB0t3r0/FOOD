// src/Cliente/components/PersonalInfoContent.jsx
import React from 'react';
import { Calendar, Edit, Save, X } from 'lucide-react';

const PersonalInfoContent = ({ 
  userInfo, 
  editForm, 
  isEditingInfo, 
  setIsEditingInfo,
  handleInputChange,
  handleSaveInfo,
  handleCancelEdit
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
      
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Información <span className="text-yellow-400">Personal</span>
          </h2>
          {!isEditingInfo ? (
            <button
              onClick={() => setIsEditingInfo(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Actualizar Información
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSaveInfo}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Guardar
              </button>
              <button
                onClick={handleCancelEdit}
                className="border-2 border-gray-600 text-gray-400 px-6 py-3 rounded-xl font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 inline-flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Nombre Completo</label>
            <div className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white">
              {userInfo.name}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Correo Electrónico</label>
            {isEditingInfo ? (
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={(e) => handleInputChange(e, 'edit')}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white">
                {userInfo.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Teléfono</label>
            {isEditingInfo ? (
              <input
                type="tel"
                name="telefono"
                value={editForm.telefono}
                onChange={(e) => handleInputChange(e, 'edit')}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white">
                {userInfo.telefono}
              </div>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Dirección</label>
            {isEditingInfo ? (
              <input
                type="text"
                name="direccion"
                value={editForm.direccion}
                onChange={(e) => handleInputChange(e, 'edit')}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white">
                {userInfo.direccion}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Fecha de Registro</label>
            <div className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-gray-400">
              <Calendar className="w-5 h-5 inline mr-2" />
              {userInfo.fechaRegistro}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoContent;