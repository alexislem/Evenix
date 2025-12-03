import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Euro, Users, Mail, Phone, ArrowLeft, Building, Ticket, LogOut } from 'lucide-react';
import { evenementService } from '../services/evenementService';
import { inscriptionService } from '../services/inscriptionService';
import { useAuth } from '../context/AuthContext';
import { Evenement } from '../types';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [userInscriptionId, setUserInscriptionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const eventData = await evenementService.getById(Number(id));
      setEvenement(eventData);

      if (user) {
        try {
            const inscriptions = await inscriptionService.getByUser(user.id);
            // ⚠️ CHANGEMENT ICI : On cherche une inscription SANS date d'annulation
            const existingInscription = inscriptions.find(ins => 
                ins.evenement && 
                ins.evenement.id === Number(id) && 
                !ins.dateAnnulation
            );
            
            if (existingInscription) {
                setUserInscriptionId(existingInscription.id);
            } else {
                setUserInscriptionId(null);
            }
        } catch (err) {
            console.error("Erreur verification inscription", err);
        }
      }
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

  const handleInscriptionClick = () => {
    if (evenement) {
        navigate(`/evenements/${evenement.id}/inscription`);
    }
  };

  const handleUnsubscribe = async () => {
    if (!userInscriptionId || !window.confirm("Êtes-vous sûr de vouloir vous désinscrire de cet événement ?")) {
        return;
    }

    try {
        await inscriptionService.delete(userInscriptionId);
        setUserInscriptionId(null);
        alert("Désinscription réussie");
    } catch (err) {
        alert("Erreur lors de la désinscription");
    }
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

        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
          {evenement.image_url ? (
            <div className="h-64 relative overflow-hidden">
              <img
                src={evenement.image_url}
                alt={evenement.nom}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Calendar className="w-24 h-24 text-white/50" />
            </div>
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-bold text-white">{evenement.nom}</h1>
                
                {userInscriptionId ? (
                    <button
                        onClick={handleUnsubscribe}
                        className="hidden md:flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105 shadow-lg shadow-red-900/20"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Se désinscrire
                    </button>
                ) : (
                    <button
                        onClick={handleInscriptionClick}
                        className="hidden md:flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition transform hover:scale-105 shadow-lg shadow-green-900/20"
                    >
                        <Ticket className="w-5 h-5 mr-2" />
                        S'inscrire
                    </button>
                )}
            </div>

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
                  <Calendar className="w-5 h-5 mr-3 text-purple-400 mt-1" />
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
                    <p className="text-gray-300 text-sm">{evenement.lieu.adresse}, {evenement.lieu.ville}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-gray-750/50 p-4 rounded-xl border border-gray-700/50">
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

            {/* --- BOUTON MOBILE --- */}
            {userInscriptionId ? (
                <button
                    onClick={handleUnsubscribe}
                    className="md:hidden w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl mb-8 transition shadow-lg"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Se désinscrire
                </button>
            ) : (
                <button
                    onClick={handleInscriptionClick}
                    className="md:hidden w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl mb-8 transition shadow-lg"
                >
                    <Ticket className="w-5 h-5 mr-2" />
                    S'inscrire à l'événement
                </button>
            )}

            <div className="border-t border-gray-700 pt-6 mb-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{evenement.description}</p>
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