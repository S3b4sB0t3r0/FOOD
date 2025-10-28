import React from "react";

const ReportsContent = ({ reportStats, handleDownloadPDF }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-6">Reporte General</h3>

      {reportStats ? (
        <div className="space-y-4 text-white">
          <p>
            <span className="font-medium text-gray-300">Total Ventas:</span>{" "}
            <span className="text-yellow-400">
              ${reportStats.totalVentas.toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-300">Total Pedidos:</span>{" "}
            {reportStats.totalPedidos}
          </p>
          <p>
            <span className="font-medium text-gray-300">Total Usuarios:</span>{" "}
            {reportStats.totalUsuarios}
          </p>

          <button
            onClick={handleDownloadPDF}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold shadow-md transition"
          >
            Descargar Reporte PDF
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Cargando datos...</p>
      )}
    </div>
  );
};

export default ReportsContent;
