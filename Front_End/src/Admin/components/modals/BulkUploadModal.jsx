import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download, Users } from 'lucide-react';
import * as XLSX from 'xlsx';

const BulkUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Juan Pérez",
        correo: "juan@ejemplo.com",
        contraseña: "Password123!",
        direccion: "Calle 123 #45-67",
        telefono: "3001234567",
        rol: "cliente"
      },
      {
        name: "María García",
        correo: "maria@vandalo.com",
        contraseña: "Secure456#",
        direccion: "Carrera 45 #12-34",
        telefono: "3109876543",
        rol: "administrador"
      },
      {
        name: "Carlos López",
        correo: "carlos@ejemplo.com",
        contraseña: "MyPass789@",
        direccion: "Avenida 30 #20-10",
        telefono: "3201234567",
        rol: "cliente"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    // Ajustar ancho de columnas
    worksheet['!cols'] = [
      { wch: 20 }, // name
      { wch: 30 }, // correo
      { wch: 15 }, // contraseña
      { wch: 25 }, // direccion
      { wch: 15 }, // telefono
      { wch: 15 }  // rol
    ];

    XLSX.writeFile(workbook, 'plantilla_usuarios.xlsx');
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Leer la primera hoja
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      if (jsonData.length === 0) {
        alert('El archivo está vacío o no tiene el formato correcto');
        setLoading(false);
        return;
      }

      // Formatear datos para el backend
      const usuarios = jsonData.map(row => ({
        name: row.name || row.nombre || '',
        correo: row.correo || row.email || '',
        contraseña: row.contraseña || row.password || '',
        direccion: row.direccion || row.direccion || null,
        telefono: row.telefono || row.telefono || null,
        rol: row.rol || null
      }));

      const response = await fetch('http://localhost:5000/api/user/carga-masiva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuarios })
      });

      const responseData = await response.json();

      if (response.ok) {
        setResult(responseData);
        if (responseData.exitosos > 0 && onSuccess) {
          onSuccess();
        }
      } else {
        alert(responseData.message || 'Error al procesar la carga');
      }
    } catch (error) {
      alert('Error al leer o procesar el archivo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Carga Masiva de Usuarios</h2>
              <p className="text-sm text-gray-400">Importa múltiples usuarios desde un archivo Excel</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instrucciones y plantilla */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-400 mb-2">Instrucciones</h3>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>El archivo debe ser formato Excel (.xlsx o .xls)</li>
                  <li>Debe contener las columnas: name, correo, contraseña, direccion, telefono, rol</li>
                  <li>La contraseña debe tener mínimo 8 caracteres, una mayúscula, minúscula, número y símbolo</li>
                  <li>Los campos obligatorios son: name, correo y contraseña</li>
                  <li>Si el dominio es @vandalo.com, el rol será "administrador" automáticamente</li>
                </ul>
                <button
                  onClick={downloadTemplate}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Descargar Plantilla Excel
                </button>
              </div>
            </div>
          </div>

          {/* Upload area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-gray-800 p-4 rounded-full mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              
              {file ? (
                <>
                  <FileSpreadsheet className="w-8 h-8 text-green-400 mb-2" />
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-white font-medium mb-1">
                    Arrastra tu archivo Excel aquí
                  </p>
                  <p className="text-gray-400 text-sm">
                    o haz clic para seleccionar (.xlsx, .xls)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Botón de carga */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Cargar Usuarios
              </>
            )}
          </button>

          {/* Resultados */}
          {result && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-white text-lg">Resultados de la Carga</h3>
              
              {/* Resumen */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Total</p>
                  <p className="text-2xl font-bold text-white">{result.total}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Exitosos</p>
                  <p className="text-2xl font-bold text-green-400">{result.exitosos}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Fallidos</p>
                  <p className="text-2xl font-bold text-red-400">{result.fallidos}</p>
                </div>
              </div>

              {/* Detalles de exitosos */}
              {result.detalles.exitosos.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Usuarios Creados
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                    {result.detalles.exitosos.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="text-gray-500">Fila {item.linea}:</span>
                        <span className="text-white font-medium">{item.nombre}</span>
                        <span className="text-gray-400">({item.correo})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detalles de fallidos */}
              {result.detalles.fallidos.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Errores Encontrados
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                    {result.detalles.fallidos.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="text-gray-300 flex items-center gap-2">
                          <span className="text-gray-500">Fila {item.linea}:</span>
                          <span className="text-white">{item.correo}</span>
                        </div>
                        <div className="text-red-400 ml-16 mt-1">{item.error}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;