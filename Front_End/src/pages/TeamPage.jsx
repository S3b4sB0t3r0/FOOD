// src/pages/TeamPage.js
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChefHat, Users, Award, Star } from 'lucide-react';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/equipo');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTeamMembers(data);
      } catch (err) {
        console.error('Error cargando el equipo:', err);
        setError('No se pudo cargar la información del equipo. Por favor, intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleImageError = (e) => {
    e.target.src = '/images/default-avatar.jpg'; // Imagen por defecto
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f8b400] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando equipo...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-[#f8b400] hover:bg-[#e6a200] text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="team-page bg-white">
        {/* Hero Section */}
        <section className="team-hero bg-gradient-to-br from-black via-gray-900 to-black text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="bg-[#f8b400] p-4 rounded-full">
                <Users className="w-12 h-12 text-black" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Conoce a Nuestro Equipo
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Detrás de cada gran plato hay un equipo aún más grande. 
              Conoce a los artistas culinarios que hacen posible cada experiencia excepcional.
            </p>
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-[#f8b400]" />
                <span className="text-gray-300">Chefs Expertos</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#f8b400]" />
                <span className="text-gray-300">Premiados</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-[#f8b400]" />
                <span className="text-gray-300">5 Estrellas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Team Stats */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#f8b400]">
                <div className="text-4xl font-bold text-black mb-2">{teamMembers.length}+</div>
                <div className="text-gray-600 font-semibold">Miembros del Equipo</div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#f8b400]">
                <div className="text-4xl font-bold text-black mb-2">15+</div>
                <div className="text-gray-600 font-semibold">Años de Experiencia</div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#f8b400]">
                <div className="text-4xl font-bold text-black mb-2">100%</div>
                <div className="text-gray-600 font-semibold">Dedicación</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="team-members py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                Nuestros Profesionales
              </h2>
              <div className="w-24 h-1 bg-[#f8b400] mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Cada miembro de nuestro equipo aporta pasión, experiencia y dedicación 
                para crear momentos culinarios inolvidables.
              </p>
            </div>

            {teamMembers.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                  Próximamente
                </h3>
                <p className="text-gray-500">
                  Estamos preparando la información de nuestro increíble equipo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div 
                    key={member.id || index} 
                    className="team-card group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#f8b400] transform hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={member.image || '/images/default-avatar.jpg'} 
                        alt={`${member.name} - ${member.role}`}
                        onError={handleImageError}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#f8b400] rounded-full"></div>
                          <span className="text-sm font-semibold">Disponible</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#f8b400] transition-colors duration-200">
                        {member.name}
                      </h3>
                      <p className="team-role text-[#f8b400] font-semibold text-sm uppercase tracking-wide mb-3">
                        {member.role}
                      </p>
                      <p className="team-desc text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {member.description}
                      </p>
                      
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mt-4 pt-4 border-t border-gray-100">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="w-4 h-4 fill-[#f8b400] text-[#f8b400]" 
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">5.0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-black to-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Quieres Unirte a Nuestro Equipo?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Siempre estamos buscando talento excepcional para formar parte 
              de nuestra familia culinaria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#f8b400] hover:bg-[#e6a200] text-black font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                Ver Oportunidades
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 px-8 rounded-lg transition-all duration-200">
                Contáctanos
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TeamPage;