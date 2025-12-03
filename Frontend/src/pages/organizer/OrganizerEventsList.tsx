import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Edit, Trash2, Plus, MapPin } from 'lucide-react';
import { evenementService } from '../../services/evenementService';
import { Evenement } from '../../types';
import { useAuth } from '../../context/AuthContext';

const OrganizerEventsList: React.FC = () => {
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

  const handleDelete = async (id: number, nom: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${nom}" ?`)) {
      return;
    }

    try {
      await evenementService.delete(id);
      setEvenements(evenements.filter((e) => e.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mes Événements</h1>
            <p className="text-gray-400">Gérez tous vos événements</p>
          </div>
          <Link
            to="/organisateur/evenements/nouveau"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvel événement
          </Link>
        </div>

        {evenements.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-6">Aucun événement créé</p>
            <Link
              to="/organisateur/evenements/nouveau"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Créer mon premier événement
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {evenements.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{event.nom}</h3>
                    <p className="text-gray-400 mb-4">{event.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Dates</p>
                        <p className="text-white">
                          {formatDate(event.dateDebut)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          au {formatDate(event.dateFin)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Lieu</p>
                        <p className="text-white flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.lieu.ville}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Places</p>
                        <p className="text-white text-xl font-semibold">{event.lieu.capaciteMax}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Prix</p>
                        <p className="text-green-400 text-xl font-semibold">{event.prix} €</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      to={`/organisateur/evenements/${event.id}/edit`}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id, event.nom)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventsList;
