import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Euro, Users, Search, CheckCircle } from 'lucide-react';
import { evenementService } from '../services/evenementService';
import { inscriptionService } from '../services/inscriptionService';
import { useAuth } from '../context/AuthContext';
import { Evenement } from '../types';

const EventsList: React.FC = () => {
  const { user } = useAuth();
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const eventsData = await evenementService.getAll();
      setEvenements(eventsData);

      if (user) {
        try {
            const inscriptions = await inscriptionService.getByUser(user.id);
            
            if (Array.isArray(inscriptions)) {
                const ids = inscriptions
                    // ⚠️ CHANGEMENT ICI : On ne considère que les inscriptions SANS date d'annulation
                    .filter(ins => ins.evenement && !ins.dateAnnulation) 
                    .map(ins => ins.evenement.id);
                setRegisteredEventIds(ids);
            } else {
                console.warn("Format d'inscription reçu incorrect (pas un tableau)", inscriptions);
                setRegisteredEventIds([]);
            }
        } catch (err) {
            console.error("Erreur chargement inscriptions", err);
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvenements = evenements.filter((event) => {
    const term = searchTerm.toLowerCase();
    const nom = typeof event.nom === 'string' ? event.nom.toLowerCase() : '';
    const ville = event.lieu && typeof event.lieu.ville === 'string' ? event.lieu.ville.toLowerCase() : '';
    return nom.includes(term) || ville.includes(term);
  });

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
        <div className="text-white text-xl">Chargement des événements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tous nos événements
          </h1>
          <p className="text-gray-400 text-lg">
            Découvrez les événements à venir et réservez votre place
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un événement..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {filteredEvenements.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">Aucun événement trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvenements.map((event) => {
              const isInscrit = registeredEventIds.includes(event.id);

              return (
                <Link
                  key={event.id}
                  to={`/evenements/${event.id}`}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105 relative"
                >
                  {/* BADGE INSCRIT */}
                  {isInscrit && (
                    <div className="absolute top-3 right-3 z-10 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Inscrit
                    </div>
                  )}

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
                    <h3 className="text-xl font-bold text-white mb-3">{event.nom}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        <span>
                          {formatDate(event.dateDebut)} - {formatDate(event.dateFin)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 text-green-400" />
                        <span>{event.lieu.ville}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-yellow-400" />
                        <span>{event.lieu.nbPlaces} places</span>
                      </div>
                      <div className="flex items-center text-gray-300 font-semibold">
                        <Euro className="w-4 h-4 mr-2 text-green-400" />
                        <span>{event.payant ? `${event.prix} €` : 'Gratuit'}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500">
                        Organisé par {event.utilisateur.prenom} {event.utilisateur.nom}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;