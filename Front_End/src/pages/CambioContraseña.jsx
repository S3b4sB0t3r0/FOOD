import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle, Shield } from 'lucide-react';

import LOGO from '../img/LOGO.png';

const PasswordChange = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
    hasUpper: false
  });
  // Función para simular navegación - reemplazar con tu lógica de routing
  const handleNavigation = (path) => {
    console.log(`Navegando a: ${path}`);
    // Aquí iría tu lógica de navegación real
  };

  // Validar contraseña en tiempo real
  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpper: /[A-Z]/.test(password)
    };
    setValidations(validations);
    return Object.values(validations).every(Boolean);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
    setError('');
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (!validatePassword(formData.password)) {
      setError('La contraseña no cumple con todos los requisitos.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      // Aquí iría la lógica real de cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (err) {
      setError('Error al cambiar la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Fondos y efectos */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
              {/* Icono de éxito */}
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-400/25">
                  <Check className="w-10 h-10" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                ¡Contraseña Actualizada!
              </h1>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-400 font-semibold">Cuenta Segura</span>
                </div>
                <p className="text-sm text-gray-400">
                  Tu nueva contraseña cumple con todos los estándares de seguridad
                </p>
              </div>

              <button
                onClick={() => handleNavigation('/LR')}
                className="group w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25 flex items-center justify-center"
              >
                <span className="mr-2">Iniciar Sesión</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Fondos y efectos */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-yellow-400/25 overflow-hidden">
                <img 
                  src={LOGO} 
                  alt="Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Nueva Contraseña
            </h1>
            <p className="text-gray-400">
              Crea una contraseña segura para tu cuenta
            </p>
          </div>

          {/* Contenedor del formulario */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
            {/* Mostrar error si existe */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nueva Contraseña */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300"
                    placeholder="Ingresa tu nueva contraseña"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Requisitos de contraseña */}
              {formData.password && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-300 mb-3">Requisitos de seguridad:</p>
                  <div className="space-y-2">
                    <div className={`flex items-center text-sm ${validations.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 mr-2 ${validations.minLength ? 'opacity-100' : 'opacity-30'}`} />
                      Mínimo 8 caracteres
                    </div>
                    <div className={`flex items-center text-sm ${validations.hasUpper ? 'text-green-400' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 mr-2 ${validations.hasUpper ? 'opacity-100' : 'opacity-30'}`} />
                      Al menos una mayúscula
                    </div>
                    <div className={`flex items-center text-sm ${validations.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 mr-2 ${validations.hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                      Al menos un número
                    </div>
                    <div className={`flex items-center text-sm ${validations.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>
                      <Check className={`w-4 h-4 mr-2 ${validations.hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                      Al menos un carácter especial
                    </div>
                  </div>
                </div>
              )}

              {/* Campo Confirmar Contraseña */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300 ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-gray-700 focus:border-yellow-400'
                    }`}
                    placeholder="Confirma tu nueva contraseña"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2">Las contraseñas no coinciden</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-green-400 text-sm mt-2">Las contraseñas coinciden</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !Object.values(validations).every(Boolean) || formData.password !== formData.confirmPassword}
                className="group w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">Cambiar Contraseña</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Información de seguridad */}
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-300 mb-1">Consejo de Seguridad</p>
                    <p className="text-sm text-gray-400">
                      Guarda tu nueva contraseña en un lugar seguro y no la compartas con nadie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p>
              ¿Problemas con el enlace?{' '}
              <a href="/password-reset" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Solicitar nuevo enlace
              </a>
            </p>
            <p className="mt-2">
              ¿Necesitas ayuda?{' '}
              <a href="/contacto" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Contacta Soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;