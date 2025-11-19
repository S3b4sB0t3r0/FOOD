// src/Cliente/components/CustomAlert.jsx
import React from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

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

export default CustomAlert;