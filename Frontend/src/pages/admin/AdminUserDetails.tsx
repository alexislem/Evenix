import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {Mail, Phone, Building, ArrowLeft, Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import { utilisateurService } from '../../services/utilisateurService';
import { inscriptionService } from '../../services/inscriptionService';
import { Utilisateur, Inscription } from '../../types';

const AdminUserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadData(Number(id));
    }
  }, [id]);

  const loadData = async (userId: number) => {
    try {
      setLoading(true);
      // Chargement parallèle : Infos user + Inscriptions
      const [userData, inscriptionsData] = await Promise.all([
        utilisateurService.getById(userId),
        inscriptionService.getByUser(userId)
      ]);

      setUser(userData);
      setInscriptions(inscriptionsData);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les informations de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseignée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>;
  if (error || !user) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">{error || "Utilisateur introuvable"}</div>;

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <button onClick={() => navigate('/admin/utilisateurs')} className="text-gray-400 hover:text-white flex items-center mb-6 text-sm transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour à la liste
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- COLONNE GAUCHE : INFOS PROFIL --- */}
            <div className="lg:w-1/3">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg h-fit">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                            {user.nom[0]}{user.prenom[0]}
                        </div>
                        <h1 className="text-2xl font-bold text-white">{user.prenom} {user.nom}</h1>
                        <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role.nom === 'ADMIN' ? 'bg-red-900/50 text-red-200' : 
                            user.role.nom === 'ORGANISATEUR' ? 'bg-purple-900/50 text-purple-200' : 
                            'bg-blue-900/50 text-blue-200'
                        }`}>
                            {user.role.nom}
                        </span>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="flex items-center p-3 bg-gray-700/30 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-400 mr-3" />
                            <div className="overflow-hidden">
                                <p className="text-gray-400 text-xs">Email</p>
                                <p className="text-white truncate" title={user.email}>{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-gray-700/30 rounded-lg">
                            <Phone className="w-5 h-5 text-green-400 mr-3" />
                            <div>
                                <p className="text-gray-400 text-xs">Téléphone</p>
                                <p className="text-white">{user.telephone || 'Non renseigné'}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-gray-700/30 rounded-lg">
                            <Calendar className="w-5 h-5 text-yellow-400 mr-3" />
                            <div>
                                <p className="text-gray-400 text-xs">Date de naissance</p>
                                <p className="text-white">{formatDate(user.dateDeNaissance || '')}</p>
                            </div>
                        </div>

                        {user.entreprise && (
                            <div className="flex items-center p-3 bg-purple-900/20 rounded-lg border border-purple-700/30">
                                <Building className="w-5 h-5 text-purple-400 mr-3" />
                                <div>
                                    <p className="text-gray-400 text-xs">Entreprise</p>
                                    <p className="text-white font-medium">{user.entreprise.nom}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- COLONNE DROITE : HISTORIQUE INSCRIPTIONS --- */}
            <div className="lg:w-2/3">
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Ticket className="w-5 h-5 mr-2 text-blue-500" />
                            Historique des inscriptions
                        </h2>
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            {inscriptions.length} total
                        </span>
                    </div>

                    {inscriptions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Cet utilisateur ne s'est inscrit à aucun événement.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-700">
                            {inscriptions.map(inscription => {
                                const event = inscription.evenement;
                                const isCancelled = !!inscription.dateAnnulation;
                                
                                return (
                                    <div key={inscription.id} className="p-4 hover:bg-gray-750 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <Link to={`/evenements/${event.id}`} className="text-lg font-semibold text-white hover:text-blue-400 transition">
                                                {event.nom}
                                            </Link>
                                            <div className="text-sm text-gray-400 mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                <span className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(event.dateDebut).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {event.lieu?.ville}
                                                </span>
                                                <span className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Inscrit le {new Date(inscription.dateInscription).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            {isCancelled ? (
                                                <span className="bg-red-900/50 text-red-300 border border-red-800 px-3 py-1 rounded-full text-xs font-medium">
                                                    Annulée
                                                </span>
                                            ) : (
                                                <span className="bg-green-900/50 text-green-300 border border-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                                    Confirmée
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminUserDetails;