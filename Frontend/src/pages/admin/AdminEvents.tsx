import React, { useEffect, useState } from 'react';
import { Calendar, Trash2, MapPin, Euro, Users } from 'lucide-react';
import { evenementService } from '../../services/evenementService';
import { Evenement } from '../../types';

const AdminEvents: React.FC = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvenements();
  }, []);

  const loadEvenements = async () => {
    try {
      const data = await evenementService.getAll();
      setEvenements(data);
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

  const filteredEvenements = evenements.filter(
    (event) =>
      event.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.utilisateur.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gestion des événements</h1>
          <p className="text-gray-400">Administrez tous les événements de la plateforme</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un événement..."
            className="w-full md:w-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {filteredEvenements.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">Aucun événement trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredEvenements.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-purple-500 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{event.nom}</h3>
                    <p className="text-gray-400 mb-4">{event.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Dates</p>
                        <p className="text-white text-sm">
                          {formatDate(event.dateDebut)}
                        </p>
                        <p className="text-gray-400 text-xs">
                          au {formatDate(event.dateFin)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Lieu</p>
                        <p className="text-white flex items-center text-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.ville}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Places</p>
                        <p className="text-white flex items-center text-sm">
                          <Users className="w-3 h-3 mr-1" />
                          {event.lieu.nbPlaces}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Prix</p>
                        <p className="text-green-400 font-semibold flex items-center">
                          <Euro className="w-3 h-3 mr-1" />
                          {event.prix} €
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-3">
                      <p className="text-gray-500 text-xs">Organisateur</p>
                      <p className="text-white">
                        {event.utilisateur.prenom} {event.utilisateur.nom}
                      </p>
                      <p className="text-gray-400 text-sm">{event.utilisateur.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(event.id, event.nom)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition ml-4"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center text-gray-400">
          Total: {filteredEvenements.length} événement(s)
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
