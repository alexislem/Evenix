import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Euro, Users, Mail, Phone, ArrowLeft, Building } from 'lucide-react';
import { evenementService } from '../services/evenementService';
import { Evenement } from '../types';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadEvenement();
    }
  }, [id]);

  const loadEvenement = async () => {
    try {
      const data = await evenementService.getById(Number(id));
      setEvenement(data);
    } catch (err) {
      setError('Événement introuvable');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !evenement) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link to="/evenements" className="text-blue-400 hover:text-blue-300">
            Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/evenements"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux événements
        </Link>

        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          {evenement.image_url ? (
            <div className="h-64 relative overflow-hidden">
              <img
                src={evenement.image_url}
                alt={evenement.nom}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
              <Calendar className="w-24 h-24 text-white" />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{evenement.nom}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-blue-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Date de début</p>
                    <p className="text-white font-medium">{formatDate(evenement.dateDebut)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-green-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Date de fin</p>
                    <p className="text-white font-medium">{formatDate(evenement.dateFin)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-red-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Lieu</p>
                    <p className="text-white font-medium">{evenement.lieu.nom}</p>
                    <p className="text-gray-300">{evenement.lieu.adresse}</p>
                    <p className="text-gray-300">{evenement.lieu.ville}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Euro className="w-5 h-5 mr-3 text-green-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Prix</p>
                    <p className="text-white font-medium text-2xl">{evenement.payant ? `${evenement.prix} €` : 'Gratuit'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-5 h-5 mr-3 text-yellow-400 mt-1" />
                  <div>
                    <p className="text-gray-400 text-sm">Places disponibles</p>
                    <p className="text-white font-medium">{evenement.lieu.nbPlaces}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 mb-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed">{evenement.description}</p>
            </div>

            <div className="border-t border-gray-700 pt-6 bg-gray-900 -mx-8 px-8 -mb-8 pb-8 mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Organisateur</h3>
              <div className="space-y-3">
                <p className="text-white font-medium text-lg">
                  {evenement.utilisateur.prenom} {evenement.utilisateur.nom}
                </p>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  <span>{evenement.utilisateur.email}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-2 text-green-400" />
                  <span>{evenement.utilisateur.telephone}</span>
                </div>
                {evenement.utilisateur.entreprise && (
                  <div className="flex items-center text-gray-300">
                    <Building className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{evenement.utilisateur.entreprise.nom}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
