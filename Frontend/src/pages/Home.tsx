import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Shield, Sparkles, MapPin, Clock } from 'lucide-react';
import { evenementService } from '../services/evenementService';
import { Evenement } from '../types';

const Home: React.FC = () => {
  const [recentEvents, setRecentEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const events = await evenementService.getAll();
        const sortedEvents = events
          .sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime())
          .slice(0, 3);
        setRecentEvents(sortedEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-950 text-white">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-green-900/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-8">
            <Calendar className="w-20 h-20 mx-auto text-blue-500 mb-6" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Bienvenue sur Evenix
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            La plateforme complète de gestion d'événements professionnels pour organiser, gérer et promouvoir vos événements en toute simplicité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/evenements"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105"
            >
              Découvrir les événements
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-green-500 hover:bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Événements récents</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Découvrez les derniers événements ajoutés sur notre plateforme
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {recentEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/evenements/${event.id}`}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition transform hover:scale-105"
                >
                  {event.image_url ? (
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.nom}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white line-clamp-2">{event.nom}</h3>
                      <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full ml-2 whitespace-nowrap">
                        {event.payant ? `${event.prix} €` : 'Gratuit'}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{event.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{formatDate(event.dateDebut)}</span>
                      </div>

                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-green-500" />
                        <span>{event.lieu.ville}</span>
                      </div>

                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-2 text-yellow-500" />
                        <span>{event.lieu.nbPlaces} places disponibles</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Aucun événement disponible pour le moment</p>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/evenements"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Voir tous les événements
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Pourquoi choisir Evenix ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition">
              <Users className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Gestion simplifiée</h3>
              <p className="text-gray-400">
                Organisez vos événements facilement avec une interface intuitive et des outils puissants de gestion.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-green-500 transition">
              <Shield className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Sécurité garantie</h3>
              <p className="text-gray-400">
                Vos données et celles de vos participants sont protégées par des systèmes de sécurité avancés.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 transition">
              <Sparkles className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Expérience premium</h3>
              <p className="text-gray-400">
                Offrez une expérience exceptionnelle à vos participants avec des fonctionnalités modernes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Prêt à commencer ?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Rejoignez des milliers d'organisateurs qui font confiance à Evenix pour leurs événements professionnels.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
