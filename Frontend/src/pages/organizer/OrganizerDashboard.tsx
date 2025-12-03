import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, BarChart3, Users } from 'lucide-react';
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
      const myEvents = data.filter((e) => e.utilisateur.id === user?.id);
      setEvenements(myEvents);
    } catch (err) {
      console.error('Erreur lors du chargement des événements', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPlaces = evenements.reduce((sum, e) => sum + e.lieu.nbPlaces, 0);
  const totalRevenu = evenements.reduce((sum, e) => sum + e.prix * e.lieu.nbPlaces, 0);

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Organisateur</h1>
            <p className="text-gray-400">Gérez vos événements</p>
          </div>
          <Link
            to="/organisateur/evenements/nouveau"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvel événement
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <Calendar className="w-10 h-10 mb-4" />
            <h3 className="text-3xl font-bold mb-2">{evenements.length}</h3>
            <p className="text-blue-100">Événements créés</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <Users className="w-10 h-10 mb-4" />
            <h3 className="text-3xl font-bold mb-2">{totalPlaces}</h3>
            <p className="text-green-100">Places totales</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
            <BarChart3 className="w-10 h-10 mb-4" />
            <h3 className="text-3xl font-bold mb-2">{totalRevenu.toLocaleString()} €</h3>
            <p className="text-yellow-100">Revenu potentiel</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Mes Événements</h2>
            <Link
              to="/organisateur/evenements"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Voir tous
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">Chargement...</div>
          ) : evenements.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Aucun événement créé</p>
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
                  className="block p-6 hover:bg-gray-750 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {event.nom}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(event.dateDebut).toLocaleDateString('fr-FR')} -{' '}
                        {event.ville}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{event.prix} €</p>
                      <p className="text-gray-400 text-sm">{event.lieu.nbPlaces} places</p>
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
