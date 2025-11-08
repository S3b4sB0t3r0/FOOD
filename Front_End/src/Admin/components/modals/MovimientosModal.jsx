import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, History } from "lucide-react";

const MovimientosModal = ({ isOpen, onClose }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchMovimientos();
    }
  }, [isOpen]);

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/movimientos"); 
      const data = await res.json();
      setMovimientos(data);
    } catch (error) {
      console.error("Error cargando movimientos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl w-[40rem] max-h-[80vh] overflow-y-auto"
      >
        {/* === HEADER === */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-yellow-400" />
            Historial de Movimientos
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* === CONTENIDO === */}
        {loading ? (
          <p className="text-gray-400 text-center py-6">Cargando movimientos...</p>
        ) : movimientos.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No hay movimientos registrados.
          </p>
        ) : (
          <div className="space-y-3">
            {movimientos.map((mov, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  mov.tipo === "SALIDA"
                    ? "bg-red-900/30 border border-red-700"
                    : mov.tipo === "ENTRADA"
                    ? "bg-green-900/30 border border-green-700"
                    : "bg-gray-800/50 border border-gray-600"
                }`}
              >
                <div className="flex flex-col text-gray-300">
                  <span className="font-semibold text-white">
                    {mov.nombre}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(mov.fecha).toLocaleString("es-CO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold ${
                      mov.tipo === "SALIDA"
                        ? "text-red-400"
                        : mov.tipo === "ENTRADA"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {mov.tipo}
                  </span>
                  <p className="text-gray-300 text-sm">
                    Cantidad: {mov.cantidad}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ref: {mov.referencia?.slice(0, 8) || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === FOOTER === */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold shadow-md"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MovimientosModal;
