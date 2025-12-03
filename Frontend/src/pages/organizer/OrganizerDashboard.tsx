import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, BarChart3, Users, Ticket } from 'lucide-react';
import { evenementService } from '../../services/evenementService';
import { Evenement } from '../../types';
import { useAuth } from '../../context/AuthContext';

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvenements();
  }, []);

  const loadEvenements = async () => {
    try {
      const data = await evenementService.getAll();
      // On filtre les événements dont l'utilisateur connecté est l'organisateur
      const myEvents = data.filter((e) => e.utilisateur.id === user?.id);
      setEvenements(myEvents);
    } catch (err) {
      console.error('Erreur lors du chargement des événements', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPlaces = evenements.reduce((sum, e) => sum + e.lieu.capaciteMax, 0);
  const totalRevenu = evenements.reduce((sum, e) => sum + e.prix * e.lieu.capaciteMax, 0);

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* En-tête avec Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Organisateur</h1>
            <p className="text-gray-400">Gérez vos événements et suivez vos performances</p>
          </div>
          
          <div className="flex gap-3">
            {/* Bouton vers mes inscriptions (Vue Participant) */}
            <Link
              to="/mes-inscriptions"
              className="bg-blue-600/20 text-blue-400 border border-blue-600/50 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-semibold flex items-center transition"
            >
              <Ticket className="w-5 h-5 mr-2" />
              Mes Inscriptions
            </Link>

            {/* Bouton Création */}
            <Link
              to="/organisateur/evenements/nouveau"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition shadow-lg shadow-green-900/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvel événement
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Total</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{evenements.length}</h3>
            <p className="text-blue-100 text-sm">Événements créés</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Capacité</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{totalPlaces}</h3>
            <p className="text-purple-100 text-sm">Places cumulées</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Potentiel</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{totalRevenu.toLocaleString()} €</h3>
            <p className="text-yellow-100 text-sm">Revenu maximum théorique</p>
          </div>
        </div>

        {/* Liste des événements récents */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
            <h2 className="text-2xl font-bold text-white">Mes Événements Récents</h2>
            <Link
              to="/organisateur/evenements"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
            >
              Voir tous les événements
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 animate-pulse">Chargement des données...</div>
          ) : evenements.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Aucun événement</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">Vous n'avez pas encore organisé d'événement. Lancez-vous dès maintenant !</p>
              <Link
                to="/organisateur/evenements/nouveau"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Créer mon premier événement
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {evenements.slice(0, 5).map((event) => (
                <Link
                  key={event.id}
                  to={`/organisateur/evenements/${event.id}/edit`}
                  className="block p-6 hover:bg-gray-700/50 transition group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition">
                        {event.nom}
                      </h3>
                      <p className="text-gray-400 text-sm flex items-center">
                        {new Date(event.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        <span className="mx-2">•</span>
                        {event.lieu.ville}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-white font-medium bg-gray-700 px-3 py-1 rounded-full text-sm mb-1">
                            {event.prix > 0 ? `${event.prix} €` : 'Gratuit'}
                        </span>
                        <span className="text-gray-500 text-xs">
                            Capacité: {event.lieu.capaciteMax}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;