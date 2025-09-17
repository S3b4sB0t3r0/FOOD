import React, { useState, useEffect } from 'react';
import {
  Star, Clock, ChefHat, Flame, Coffee,
  Utensils, Award, Heart, Search, Filter,
  X, Tag, TrendingUp
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// Importar el contexto del carrito
import { useCart, parsePrice } from '../context/CartContext';

// Mapeo de iconos por nombre
const iconMap = {
  Star: <Star className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  ChefHat: <ChefHat className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
};

const MenuPage = () => {
  const [menuData, setMenuData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/menu-cliente');
        const data = await res.json();

        // Agrupar productos por categoría
        const grouped = data.reduce((acc, item) => {
          const cat = item.category || 'Otros';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {});

        setMenuData(grouped);
        setFilteredData(grouped);
      } catch (error) {
        console.error('Error al cargar el menú:', error);
      }
    };

    fetchMenu();
  }, []);

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let filtered = { ...menuData };

    // Filtrar por categoría
    if (selectedCategory !== 'Todos') {
      filtered = { [selectedCategory]: menuData[selectedCategory] || [] };
    }

    // Aplicar filtros especiales (popular, nuevo)
    if (selectedFilters.length > 0) {
      Object.keys(filtered).forEach(category => {
        filtered[category] = filtered[category].filter(item => {
          return selectedFilters.every(filter => {
            if (filter === 'popular') return item.popular;
            if (filter === 'nuevo') return item.new;
            return true;
          });
        });
      });
    }

    // Aplicar búsqueda por texto
    if (searchTerm.trim()) {
      Object.keys(filtered).forEach(category => {
        filtered[category] = filtered[category].filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      // Eliminar categorías vacías
      Object.keys(filtered).forEach(category => {
        if (filtered[category].length === 0) {
          delete filtered[category];
        }
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedCategory, selectedFilters, menuData]);

  const categories = ['Todos', ...Object.keys(menuData)];
  const totalItems = Object.values(filteredData).reduce((sum, items) => sum + items.length, 0);

  const toggleFilter = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedFilters([]);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Nuestro <span className="block text-yellow-400">Menú Completo</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Descubre una selección cuidadosamente curada de platos excepcionales, preparados con los mejores ingredientes y mucho amor.
          </p>
          <div className="mt-12 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-950 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Barra de búsqueda principal */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar platos, ingredientes o categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/25'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Botón de filtros avanzados */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  showFilters || selectedFilters.length > 0
                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filtros
                {selectedFilters.length > 0 && (
                  <span className="bg-black text-yellow-400 text-xs px-2 py-0.5 rounded-full font-bold">
                    {selectedFilters.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Panel de filtros expandible */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-yellow-400" />
                    Filtros Especiales
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleFilter('popular')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedFilters.includes('popular')
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Popular
                    </button>
                    <button
                      onClick={() => toggleFilter('nuevo')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedFilters.includes('nuevo')
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      Nuevo
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={clearAllFilters}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contador de resultados */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {totalItems > 0 ? (
                <>
                  Mostrando <span className="text-yellow-400 font-semibold">{totalItems}</span> {totalItems === 1 ? 'producto' : 'productos'}
                  {searchTerm && (
                    <span> para "<span className="text-white font-medium">{searchTerm}</span>"</span>
                  )}
                </>
              ) : (
                <span className="text-red-400">No se encontraron productos con los filtros seleccionados</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          {Object.keys(filteredData).length > 0 ? (
            Object.keys(filteredData).map((category) => {
              const id = category.replace(/\s+/g, '').toLowerCase();
              return (
                <div key={category} className="mb-20" id={id}>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {category}
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto"></div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredData[category].map((item) => (
                      <div
                        key={item.title}
                        className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/10"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative h-32 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute top-2 left-2 flex gap-1">
                            {item.popular && (
                              <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-semibold">Popular</span>
                            )}
                            {item.new && (
                              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">Nuevo</span>
                            )}
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <span className="bg-yellow-400 text-black px-2 py-1 rounded-lg text-sm font-bold">
                              {item.price}
                            </span>
                          </div>
                        </div>

                        <div className="relative p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                              {iconMap[item.icon] || <Utensils className="w-3 h-3" />}
                            </div>
                            <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 truncate">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 line-clamp-2 mb-3">
                            {item.description}
                          </p>

                          <button
                            onClick={() => {
                              console.log('Producto que se agrega:', item);
                              console.log('Precio original:', item.price);
                              const priceNumber = parsePrice(item.price);
                              console.log('Precio convertido a número:', priceNumber);

                              addToCart({
                                ...item,
                                price: priceNumber
                              });
                            }}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-2 rounded-lg text-xs hover:shadow-md hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
                          >
                            Agregar
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:w-full transition-all duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No se encontraron productos</h3>
              <p className="text-gray-400 mb-6">Intenta ajustar tus filtros o términos de búsqueda</p>
              <button
                onClick={clearAllFilters}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">¿Listo para Ordenar?</h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Cada plato está preparado con ingredientes frescos y el amor de nuestros chefs expertos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors duration-300 hover:shadow-lg">
              Hacer Pedido Ahora
            </button>
            <button className="border-2 border-black text-black px-8 py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300">
              Ver Promociones
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">25+</div>
              <div className="text-gray-400">Platos Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">5★</div>
              <div className="text-gray-400">Calificación Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
              <div className="text-gray-400">Ingredientes Frescos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">15min</div>
              <div className="text-gray-400">Tiempo Promedio</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;