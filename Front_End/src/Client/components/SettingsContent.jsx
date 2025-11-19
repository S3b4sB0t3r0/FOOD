// src/Cliente/components/SettingsContent.jsx
import React from 'react';
import { Settings, Edit, Save, X, Eye, EyeOff } from 'lucide-react';
import PasswordStrength from './PasswordStrength';

const SettingsContent = ({ 
  passwordData,
  showPassword,
  showNewPassword,
  isEditingPassword,
  setShowPassword,
  setShowNewPassword,
  setIsEditingPassword,
  handleInputChange,
  handlePasswordUpdate,
  setPasswordData
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
      
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Cambiar <span className="text-yellow-400">Contraseña</span>
          </h2>
          {!isEditingPassword && (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Actualizar Contraseña
            </button>
          )}
        </div>

        {isEditingPassword ? (
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Contraseña Actual</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => handleInputChange(e, 'password')}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300 pr-12"
                  placeholder="Introduce tu contraseña actual"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange(e, 'password')}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300 pr-12"
                  placeholder="Introduce tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <PasswordStrength password={passwordData.newPassword} />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange(e, 'password')}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePasswordUpdate}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Actualizar Contraseña
              </button>
              <button
                onClick={() => {
                  setIsEditingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="border-2 border-gray-600 text-gray-400 px-6 py-3 rounded-xl font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 inline-flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black mx-auto mb-6">
              <Settings className="w-8 h-8" />
            </div>
            <p className="text-gray-400 text-lg">
              Tu contraseña está segura. Haz clic en "Actualizar Contraseña" para cambiarla.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsContent;