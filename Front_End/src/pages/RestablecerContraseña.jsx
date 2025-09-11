import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import LOGO from '../img/LOGO.png';


const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:5000/api/user/recuperar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo: email }) 
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el correo');
      }
  
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Hubo un error al enviar el correo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  



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
            {/* Contenedor del mensaje de éxito */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
              {/* Icono de éxito */}
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-400/25">
                  <Check className="w-10 h-10" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                ¡Correo Enviado!
              </h1>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Hemos enviado un enlace de restablecimiento de contraseña a{' '}
                <span className="text-yellow-400 font-semibold">{email}</span>
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-2">
                  <strong className="text-white">Nota importante:</strong>
                </p>
                <ul className="text-sm text-gray-400 space-y-1 text-left">
                  <li>• Revisa tu bandeja de entrada y spam</li>
                  <li>• El enlace expira en 24 horas</li>
                  <li>• Si no recibes el correo, intenta de nuevo</li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/LR')}
                className="group w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25 flex items-center justify-center mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                
                Volver al Login
              </button>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
                className="w-full text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
              >
                Enviar a otro correo
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
              Restablecer Contraseña
            </h1>
            <p className="text-gray-400">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
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

            {/* FORMULARIO */}
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300"
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !email.trim()}
                className="group w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">Enviar Enlace</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Información adicional */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">
                  <strong className="text-gray-300">¿Qué sucede después?</strong>
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Recibirás un correo con un enlace seguro</li>
                  <li>• Haz clic en el enlace para crear una nueva contraseña</li>
                  <li>• El enlace expira en 24 horas por seguridad</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p>
              ¿Recordaste tu contraseña?{' '}
              <button
                onClick={() => navigate('/LR')}
                className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
              >
                Volver al Login
              </button>
            </p>
            <p className="mt-4">
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

export default PasswordReset;
