import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Clock,
  Award,
  ChefHat,
  Plus
} from 'lucide-react';

const menuItems = [
  {
    id: 1,
    title: 'Salmón a la Parrilla',
    description: 'Salmón fresco del Atlántico servido con verduras de temporada y salsa de eneldo.',
    price: '$30.000',
    originalPrice: '$35.000',
    image: 'https://kasani.pe/wp-content/uploads/2020/08/SALMON-A-LA-PARRILLA.jpg',
    rating: 4.8,
    cookTime: '15-20 min',
    category: 'Especialidad',
    isSpecial: true
  },
  {
    id: 2,
    title: 'Pollo Alfredo',
    description: 'Pasta cremosa con pechuga de pollo a la plancha, champiñones y queso parmesano.',
    price: '$15.500',
    originalPrice: '$18.000',
    image: 'https://www.recetasnestlecam.com/sites/default/files/srh_recipes/2face93eead8f917c911d544f5d32744.jpg',
    rating: 4.6,
    cookTime: '12-15 min',
    category: 'Pasta',
    isSpecial: false
  },
  {
    id: 3,
    title: 'Hamburguesa Vegetariana',
    description: 'Hamburguesa a base de plantas con aguacate, tomate y papas fritas de boniato.',
    price: '$12.700',
    originalPrice: null,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtACaSxt-DcemtaLB2WxOEsbFNWjJ9iZ2Yfg&s',
    rating: 4.4,
    cookTime: '10-12 min',
    category: 'Saludable',
    isSpecial: false
  },
  {
    id: 4,
    title: 'Costillas BBQ',
    description: 'Costillas cocinadas a fuego lento y glaseadas con nuestra salsa barbacoa especial.',
    price: '$20.000',
    originalPrice: '$25.000',
    image: 'https://cdn0.uncomo.com/es/posts/3/9/5/como_hacer_costillas_bbq_en_sarten_50593_orig.jpg',
    rating: 4.9,
    cookTime: '20-25 min',
    category: 'Parrilla',
    isSpecial: true
  },
];

const FeaturedMenu = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleFavorite = (itemId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Más Vendido': return 'bg-red-500';
      case 'Favorito': return 'bg-blue-500';
      case 'Nuevo': return 'bg-green-500';
      case 'Chef\'s Choice': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Especialidades del Chef
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Platos <span className="text-yellow-400">Destacados</span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestra selección de platos premium, cuidadosamente preparados 
            con los mejores ingredientes y técnicas culinarias
          </p>

          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl overflow-hidden hover:border-yellow-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Badge */}
              {item.badge && (
                <div className="absolute top-4 left-4 z-20">
                  <span className={`${getBadgeColor(item.badge)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(item.id)}
                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all duration-300"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors duration-300 ${
                    favorites.has(item.id) ? 'text-red-500 fill-red-500' : 'text-white'
                  }`} 
                />
              </button>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <Link to="/menu">
                    <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Agregar
                    </button>
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-yellow-400 text-sm font-medium">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-300 text-sm">{item.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {item.description}
                  </p>

                  {/* Cook Time */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 text-sm">{item.cookTime}</span>
                  </div>

                  {/* Price & Cart Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-yellow-400">{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-gray-500 text-sm line-through">{item.originalPrice}</span>
                      )}
                    </div>

                    <Link to="/menu">
                      <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-3 rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-110">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:w-full transition-all duration-500 rounded-b-3xl"></div>
              </div>

              {/* Special Glow */}
              {item.isSpecial && (
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/20 to-transparent animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Link to="/menu">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:transform hover:scale-105 inline-flex items-center gap-3">
              <Award className="w-6 h-6" />
              Ver Menú Completo
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;
