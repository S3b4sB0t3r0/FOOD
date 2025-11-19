// src/Cliente/components/PasswordStrength.jsx
import React from 'react';

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

export default PasswordStrength;