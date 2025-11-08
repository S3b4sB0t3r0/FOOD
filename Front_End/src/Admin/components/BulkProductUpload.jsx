import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const BulkProductUpload = ({ onBulkUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(sheet);
      setProducts(parsed);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkUpdate = async () => {
    if (products.length === 0) return alert('Primero sube un archivo válido.');

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/menu/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Actualización masiva completada');
        onBulkUpdate && onBulkUpdate();
      } else {
        alert('Error: ' + (data.message || 'No se pudo actualizar'));
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black border border-gray-700 p-6 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4">Carga Masiva de Productos</h2>

      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {products.length > 0 && (
        <p className="mb-4">{products.length} productos listos para actualizar.</p>
      )}

      <button
        onClick={handleBulkUpdate}
        disabled={loading || products.length === 0}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          loading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg'
        }`}
      >
        {loading ? 'Actualizando...' : 'Actualizar Masivamente'}
      </button>
    </div>
  );
};

export default BulkProductUpload;
