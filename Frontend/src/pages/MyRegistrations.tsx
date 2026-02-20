import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {MapPin, Clock, ArrowLeft, Trash2, ExternalLink, Ticket, AlertCircle } from 'lucide-react';
import { inscriptionService } from '../services/inscriptionService';
import { useAuth } from '../context/AuthContext';
import { Inscription } from '../types';



const MyRegistrations: React.FC = () => {
  const { user } = useAuth();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

// Fonction pour obtenir le dashboard correct selon le rôle
  const getDashboardRoute = () => {
    const role = user?.role?.nom;
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'ORGANISATEUR':
        return '/organisateur/dashboard';
      case 'PARTICIPANT':
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    if (user) {
      loadInscriptions();
    }
  }, [user]);

  const loadInscriptions = async () => {
    try {
      setLoading(true);
      // On récupère toutes les inscriptions de l'utilisateur
      const data = await inscriptionService.getByUser(user!.id);
      
      // On filtre pour ne garder que celles qui sont valides (pas annulées)
      // et on trie par date d'événement la plus proche
      const activeInscriptions = data
        .filter(ins => !ins.dateAnnulation && ins.evenement)
        .sort((a, b) => new Date(a.evenement.dateDebut).getTime() - new Date(b.evenement.dateDebut).getTime());

      setInscriptions(activeInscriptions);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger vos inscriptions.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (inscriptionId: number, eventName: string) => {
    if (!window.confirm(`Voulez-vous vraiment annuler votre inscription à l'événement "${eventName}" ?`)) {
      return;
    }

    try {
      await inscriptionService.delete(inscriptionId);
      // On met à jour la liste localement
      setInscriptions(prev => prev.filter(ins => ins.id !== inscriptionId));
    } catch (err) {
      alert("Erreur lors de la désinscription.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper pour la localisation (même logique que EventsList)
  const getEventLocation = (event: any) => {
    if (event.lieu?.ville) return `${event.lieu.nom}, ${event.lieu.ville}`;
    if (event.ville) return `${event.lieu?.nom || 'Lieu'}, ${event.ville}`;
    return event.lieu?.adresse || 'Lieu à définir';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Chargement de vos inscriptions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* En-tête avec bouton retour */}
        <div className="flex items-center mb-8">
            <Link to={getDashboardRoute()} className="text-gray-400 hover:text-white mr-4 transition">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-white">Mes Inscriptions</h1>
                <p className="text-gray-400">Gérez vos billets et vos participations</p>
            </div>
        </div>

        {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
            </div>
        )}

        {inscriptions.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Aucune inscription en cours</h3>
                <p className="text-gray-400 mb-6">Vous n'êtes inscrit à aucun événement à venir.</p>
                <Link 
                    to="/evenements" 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    Explorer les événements
                </Link>
            </div>
        ) : (
            <div className="space-y-4">
                {inscriptions.map((inscription) => {
                    const event = inscription.evenement;
                    // On vérifie si l'événement est passé
                    const isPast = new Date(event.dateDebut).getTime() < Date.now();

                    return (
                        <div 
                            key={inscription.id} 
                            className={`bg-gray-800 rounded-xl border ${isPast ? 'border-gray-700 opacity-75' : 'border-gray-600 hover:border-blue-500'} p-6 transition-all shadow-lg flex flex-col md:flex-row gap-6`}
                        >
                            {/* Date Box */}
                            <div className="hidden md:flex flex-col items-center justify-center bg-gray-700/50 rounded-lg p-4 w-32 h-32 flex-shrink-0 text-center border border-gray-600">
                                <span className="text-3xl font-bold text-blue-400">
                                    {new Date(event.dateDebut).getDate()}
                                </span>
                                <span className="text-sm text-gray-300 uppercase font-semibold">
                                    {new Date(event.dateDebut).toLocaleDateString('fr-FR', { month: 'short' })}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    {new Date(event.dateDebut).getFullYear()}
                                </span>
                            </div>

                            {/* Infos */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {event.nom}
                                    </h3>
                                    {isPast && (
                                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded uppercase font-bold">Terminé</span>
                                    )}
                                </div>

                                <div className="space-y-2 text-gray-300 mb-4">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                                        <span>{formatDate(event.dateDebut)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-green-400" />
                                        <span>{getEventLocation(event)}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-400">
                                        <Ticket className="w-4 h-4 mr-2" />
                                        <span>Inscrit le {new Date(inscription.dateInscription).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
                                <Link 
                                    to={`/evenements/${event.id}`}
                                    className="flex items-center justify-center bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Détails
                                </Link>

                                {!isPast && (
                                    <button 
                                        onClick={() => handleUnsubscribe(inscription.id, event.nom)}
                                        className="flex items-center justify-center bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Se désinscrire
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;