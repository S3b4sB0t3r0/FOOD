import React, { useState } from "react";
import { Package, PlusCircle, LogOut, User } from "lucide-react";
import OrdersContent from "./components/OrdersContent";
import CreateOrderContent from "./components/CreateOrderContent";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("orders");

  const handleLogout = () => {
    // Limpiar token y datos del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    
    // Limpiar sessionStorage si también lo usas
    sessionStorage.clear();
    
    // Redirigir al login (ajustar según tu estructura)
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 p-6 flex flex-col shadow-2xl">
        {/* Header con usuario */}
        <div className="mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Panel Empleado</h2>
              <p className="text-sm text-gray-400">Gestión de órdenes</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-3">
          <button
            className={`flex items-center gap-3 text-left p-4 rounded-xl transition-all duration-300 ${
              activePage === "orders"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/50 font-semibold"
                : "text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
            }`}
            onClick={() => setActivePage("orders")}
          >
            <Package className="w-5 h-5" />
            <span>Órdenes</span>
          </button>
          
          <button
            className={`flex items-center gap-3 text-left p-4 rounded-xl transition-all duration-300 ${
              activePage === "create"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/50 font-semibold"
                : "text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
            }`}
            onClick={() => setActivePage("create")}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Crear Orden</span>
          </button>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 transition-all duration-300 mt-4 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {activePage === "orders" ? "Gestión de Órdenes" : "Crear Nueva Orden"}
            </h1>
            <p className="text-gray-400">
              {activePage === "orders" 
                ? "Administra y visualiza todas las órdenes del sistema"
                : "Genera una nueva orden para un cliente"
              }
            </p>
          </div>

          {/* Content */}
          {activePage === "orders" && <OrdersContent />}
          {activePage === "create" && <CreateOrderContent />}
        </div>
      </main>
    </div>
  );
}