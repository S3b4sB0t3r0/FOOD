// src/Cliente/Perfil.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomAlert from './components/CustomAlert';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import PersonalInfoContent from './components/PersonalInfoContent';
import OrderHistoryContent from './components/OrderHistoryContent';
import SettingsContent from './components/SettingsContent';

const Perfil = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [refreshOrders, setRefreshOrders] = useState(0); // 🆕 Para refrescar órdenes

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

  // 🆕 Función para refrescar las órdenes
  const handleOrderUpdate = () => {
    setRefreshOrders(prev => prev + 1);
  };

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      if (!token) return;
    
      try {
        // Cargar información del usuario
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
       
        if (!isEditingInfo && !isEditingPassword) {
          setEditForm({
            name: userData.name,
            email: userData.correo,
            telefono: userData.telefono || '',
            direccion: userData.direccion || ''
          });
        }
        
        // 🆕 Cargar órdenes del usuario
        const ordersRes = await axios.get(`${API_BASE}/orders/getorderuser?email=${userData.correo}`);
        setPurchaseHistory(ordersRes.data.orders);
    
      } catch (err) {
        console.error('Error al cargar el perfil o las órdenes:', err);
        showAlert('error', 'No se pudo cargar la información del perfil o las órdenes.');
      }
    };
     
    fetchUserDataAndOrders();
  }, [token, isEditingInfo, isEditingPassword, refreshOrders]); // 🆕 Agregado refreshOrders

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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}

      <ProfileHeader userName={userInfo.name} />
      
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <section className="py-12 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'info' && (
            <PersonalInfoContent
              userInfo={userInfo}
              editForm={editForm}
              isEditingInfo={isEditingInfo}
              setIsEditingInfo={setIsEditingInfo}
              handleInputChange={handleInputChange}
              handleSaveInfo={handleSaveInfo}
              handleCancelEdit={handleCancelEdit}
            />
          )}

          {activeTab === 'history' && (
            <OrderHistoryContent 
              purchaseHistory={purchaseHistory}
              onOrderUpdate={handleOrderUpdate}
              showAlert={showAlert}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsContent
              passwordData={passwordData}
              showPassword={showPassword}
              showNewPassword={showNewPassword}
              isEditingPassword={isEditingPassword}
              setShowPassword={setShowPassword}
              setShowNewPassword={setShowNewPassword}
              setIsEditingPassword={setIsEditingPassword}
              handleInputChange={handleInputChange}
              handlePasswordUpdate={handlePasswordUpdate}
              setPasswordData={setPasswordData}
            />
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Perfil;