import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, XCircle, AlertCircle, X, ArrowLeft } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LOGO from '../img/LOGO.png';

// Componente de Alerta personalizada
const CustomAlert = ({ type, message, onClose }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500 text-green-100';
      case 'error':
        return 'bg-red-900/90 border-red-500 text-red-100';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-500 text-yellow-100';
      default:
        return 'bg-gray-900/90 border-gray-500 text-gray-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);


  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 border rounded-xl shadow-lg backdrop-blur-sm ${getAlertStyles()} animate-in slide-in-from-right duration-300`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Componente de validación de contraseña
const PasswordStrength = ({ password }) => {
  const requirements = [
    { regex: /.{8,}/, text: 'Mínimo 8 caracteres' },
    { regex: /[A-Z]/, text: 'Al menos una mayúscula' },
    { regex: /[a-z]/, text: 'Al menos una minúscula' },
    { regex: /\d/, text: 'Al menos un número' },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'Al menos un carácter especial' }
  ];

  const getStrengthColor = () => {
    const metCount = requirements.filter(req => req.regex.test(password)).length;
    if (metCount < 2) return 'bg-red-500';
    if (metCount < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    const metCount = requirements.filter(req => req.regex.test(password)).length;
    if (metCount < 2) return 'Débil';
    if (metCount < 4) return 'Media';
    return 'Fuerte';
  };

  if (!password) return null;

  

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Seguridad:</span>
        <span className={`text-xs font-medium ${
          getStrengthText() === 'Fuerte' ? 'text-green-400' :
          getStrengthText() === 'Media' ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {getStrengthText()}
        </span>
        <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(requirements.filter(req => req.regex.test(password)).length / requirements.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2">
            {req.regex.test(password) ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : (
              <XCircle className="w-3 h-3 text-gray-500" />
            )}
            <span className={`text-xs ${req.regex.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoginRegister  = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = () => {
    const requirements = [
      { regex: /.{8,}/, message: 'La contraseña debe tener mínimo 8 caracteres' },
      { regex: /[A-Z]/, message: 'La contraseña debe tener al menos una mayúscula' },
      { regex: /[a-z]/, message: 'La contraseña debe tener al menos una minúscula' },
      { regex: /\d/, message: 'La contraseña debe tener al menos un número' },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'La contraseña debe tener al menos un carácter especial' }
    ];

    for (const req of requirements) {
      if (!req.regex.test(formData.password)) {
        return req.message;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones
    if (!isLogin) {
      const passwordError = validatePassword();
      if (passwordError) {
        showAlert('error', passwordError);
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        showAlert('error', 'Las contraseñas no coinciden');
        setIsLoading(false);
        return;
      }
    }

    const endpoint = isLogin ? '/login' : '/register';
    const url = `http://localhost:5000/api/user${endpoint}`;
    
    const payload = isLogin
      ? { correo: formData.email, contraseña: formData.password }
      : {
          name: formData.name,
          correo: formData.email,
          contraseña: formData.password,
        };

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        
          const data = await response.json();
        
          if (!response.ok) {
            throw new Error(data.message || 'Error en el servidor');
          }
        
          if (isLogin) {
            // Guardar token en localStorage
            login(data.user, data.token);
            showAlert('success', `¡Bienvenido ${data.user.name}!`);
        
            // Redirigir según el rol
            setTimeout(() => {
              const rol = data.user.rol;
              if (rol === 'administrador') {
                navigate('/Admin');
              } else if (rol === 'cliente') {
                navigate('/');
              } else {
                showAlert('warning', 'Rol no definido');
              }
            }, 1500);
          } else {
            showAlert('success', '¡Registro exitoso! Ahora puedes iniciar sesión.');
            setIsLogin(true);
            setFormData({
              email: '',
              password: '',
              name: '',
              confirmPassword: ''
            });
          }
        
        } catch (err) {
          let errorMessage = 'Ha ocurrido un error inesperado';
        
          if (err.message.includes('fetch')) {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
          } else if (err.message.includes('401')) {
            errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
          } else if (err.message.includes('403')) {
            errorMessage = 'Tu cuenta está bloqueada. Debes restablecer tu contraseña para desbloquearla.';
            setTimeout(() => {
              navigate('/restablecer');
            }, 2000);
          } else if (err.message.includes('400')) {
            errorMessage = 'Datos inválidos. Verifica la información ingresada.';
          } else if (err.message.includes('409')) {
            errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
          } else if (err.message) {
            errorMessage = err.message;
          }
        
          showAlert('error', errorMessage);
        
        } finally {
          // 👇 esto siempre se ejecuta
          setIsLoading(false);
        }
  }
  const [touched, setTouched] = useState({});

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };
  
  const isInvalid = (field) => touched[field] && !formData[field]?.trim();
  
  const validateForm = () => {
    const { name, correo, asunto, mensaje } = formData;
    return name.trim() && correo.trim() && asunto.trim() && mensaje.trim();
  };


  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            padding: '14px 16px',
            color: 'white',
          },
          success: {
            style: {
              background: '#22c55e',
              boxShadow: '0 0 0 2px #16a34a',
            },
            iconTheme: {
              primary: '#15803d',
              secondary: '#bbf7d0',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              boxShadow: '0 0 0 2px #b91c1c',
            },
            iconTheme: {
              primary: '#7f1d1d',
              secondary: '#fecaca',
            },
          },
        }}
      />
      {/* Alertas */}
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}

      {/* Fondos y efectos */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 group bg-yellow-500/10 hover:bg-yellow-500/20 backdrop-blur-md border border-yellow-400/20 text-yellow-300 hover:text-white font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105"
      >
        <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-sm">Volver al inicio</span>
      </button>
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
              {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
            </h1>
            <p className="text-gray-400">
              {isLogin ? 'Accede a tu cuenta para continuar' : 'Únete a nuestra comunidad premium'}
            </p>
          </div>

          {/* Contenedor del formulario */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
            {/* Botones de alternar */}
            <div className="flex mb-8 bg-gray-800/50 rounded-xl p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo {isInvalid('name') && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico {isInvalid('correo') && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña {isInvalid('contraseña') && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300"
                    placeholder="Tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!isLogin && (
                  <PasswordStrength password={formData.password} />
                )}
              </div>

              {!isLogin && (
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Contraseña{isInvalid('contraseña') && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all duration-300 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-500 focus:border-red-500'
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-green-500 focus:border-green-500'
                          : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      placeholder="Confirma tu contraseña"
                      required
                    />
                  </div>
                  {formData.confirmPassword && (
                    <div className="mt-2 flex items-center gap-2">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">Las contraseñas coinciden</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">Las contraseñas no coinciden</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-yellow-400 hover:text-yellow-300"
                    onClick={() => navigate('/restablecer')}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
              {!isLogin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    required
                    className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                    Acepto los{' '}
                    <a
                      href="../docs/terminos.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      Términos y Condiciones
                    </a>{' '}
                    y la{' '}
                    <a
                      href="/docs/privacidad.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      Política de Privacidad
                    </a>
                  </label>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-4 px-6 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p>
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
              </button>
            </p>
            <p className="mt-4">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;