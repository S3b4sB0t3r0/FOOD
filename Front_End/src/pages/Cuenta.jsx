import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, ShoppingBag, Settings, Eye, EyeOff, Calendar, MapPin, Edit, Save, X, CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    <div className="mt-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-400">Fortaleza:</span>
        <div className={`px-2 py-1 rounded text-xs font-medium ${getStrengthColor()} text-white`}>
          {getStrengthText()}
        </div>
      </div>
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${req.regex.test(password) ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span className={`text-xs ${req.regex.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

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

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border-2 backdrop-blur-sm shadow-2xl max-w-md ${getAlertStyles()}`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaRegistro: ''
  });

  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const API_BASE = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const closeAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
        const fetchUserDataAndOrders = async () => {
          if (!token) return;
      
          try {
            // Paso 1: Cargar información del usuario
            const userRes = await axios.get(`${API_BASE}/user/perfil`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const userData = userRes.data.user;
      
            const formattedDate = new Date(userData.createdAt).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
      
            setUserInfo({
              name: userData.name,
              email: userData.correo,
              telefono: userData.telefono || '',
              direccion: userData.direccion || '',
              fechaRegistro: formattedDate
            });
      
            setEditForm({
              name: userData.name,
              email: userData.correo,
              telefono: userData.telefono || '',
              direccion: userData.direccion || ''
            });
      
            // Paso 2: Cargar historial de pedidos
            // Esta es la llamada correcta, enviando el correo en la URL
            const ordersRes = await axios.get(`${API_BASE}/orders/getorderuser?email=${userData.correo}`);
            
            setPurchaseHistory(ordersRes.data.orders);
      
          } catch (err) {
            console.error('Error al cargar el perfil o las órdenes:', err);
            showAlert('error', 'No se pudo cargar la información del perfil o las órdenes.');
          }
        };
      
        fetchUserDataAndOrders();
      }, [token, showAlert]);

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    if (form === 'edit') {
      setEditForm(prev => ({ ...prev, [name]: value }));
    } else if (form === 'password') {
      setPasswordData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveInfo = async () => {
    try {
      await axios.put(`${API_BASE}/user/perfil`, {
        name: editForm.name,
        correo: editForm.email,
        direccion: editForm.direccion,
        telefono: editForm.telefono
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserInfo(prev => ({
        ...prev,
        ...editForm
      }));

      setIsEditingInfo(false);
      showAlert('success', 'Información actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      showAlert('error', 'No se pudo actualizar la información');
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: userInfo.name,
      email: userInfo.email,
      telefono: userInfo.telefono,
      direccion: userInfo.direccion
    });
    setIsEditingInfo(false);
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
  
    if (newPassword !== confirmPassword) {
      showAlert('warning', 'Las contraseñas no coinciden');
      return;
    }
  
    const requirements = [
      { regex: /.{8,}/, text: 'Mínimo 8 caracteres' },
      { regex: /[A-Z]/, text: 'Al menos una mayúscula' },
      { regex: /[a-z]/, text: 'Al menos una minúscula' },
      { regex: /\d/, text: 'Al menos un número' },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'Al menos un carácter especial' }
    ];
  
    const metCount = requirements.filter(req => req.regex.test(newPassword)).length;
    if (metCount < 5) {
      showAlert('warning', 'La contraseña debe cumplir todos los requisitos de seguridad');
      return;
    }

    try {
      await axios.put(`${API_BASE}/user/password`, {
        contraseñaActual: currentPassword,
        nuevaContraseña: newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showAlert('success', 'Contraseña actualizada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsEditingPassword(false);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      const msg = error?.response?.data?.message || 'No se pudo actualizar la contraseña';
      showAlert('error', msg);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregado': return 'text-green-400';
      case 'En Proceso': return 'text-yellow-400';
      case 'Cancelado': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Alerta personalizada */}
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}

      {/* Header */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
              Mi Perfil
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Hola, <span className="text-yellow-400">{userInfo.name}</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Gestiona tu información personal y revisa tu historial de pedidos
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
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

      {/* Content */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          
          {/* Información Personal */}
          {activeTab === 'info' && (
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
                    {isEditingInfo ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={(e) => handleInputChange(e, 'edit')}
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white">
                        {userInfo.name}
                      </div>
                    )}
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
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Historial de <span className="text-yellow-400">Compras</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Revisa todos tus pedidos anteriores
                </p>
              </div>

              
              {purchaseHistory && purchaseHistory.length > 0 ? (
                <div className="space-y-6">
                  {purchaseHistory.map((order) => (
                    <div
                      key={order._id}
                      className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300"
                    >
                      {/* Contenedor principal del pedido con diseño corregido */}
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        {/* Contenido de la izquierda: detalles del pedido */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center text-black font-bold">
                              #{order._id.substring(0, 4)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                Pedido del {new Date(order.createdAt).toLocaleDateString('es-CO')}
                              </h3>
                              <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400 mb-1">Productos:</p>
                              <div className="text-white">
                                {order.items.map((item, idx) => (
                                  <span key={idx} className="block">• {item.quantity}x {item.title}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Dirección de entrega:</p>
                              <p className="text-white flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-yellow-400" />
                                {order.direccion || 'No especificada'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Contenido de la derecha: precio y botón */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-400">
                            ${order.totalPrice.toLocaleString()}
                          </p>
                          <button className="mt-2 border-2 border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 text-sm">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400 bg-gray-900 rounded-xl border border-gray-700">
                  <p>Aún no has realizado ningún pedido.</p>
                </div>
              )}
            </div>
          )}

          {/* Configuración */}
          {activeTab === 'settings' && (
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
                      {/* AGREGAR AQUÍ: */}
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
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProfilePage;