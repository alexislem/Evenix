import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, CreditCard, CheckCircle, AlertCircle, ArrowLeft, Euro } from 'lucide-react';
import { evenementService } from '../services/evenementService';
import { inscriptionService } from '../services/inscriptionService';
import { paiementService } from '../services/paiementService';
import { Evenement } from '../types';
import { useAuth } from '../context/AuthContext';

const InscriptionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'confirm' | 'success' | 'error'>('confirm');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) loadEvenement();
  }, [id]);

  const loadEvenement = async () => {
    try {
      const data = await evenementService.getById(Number(id));
      setEvenement(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Impossible de charger l'événement");
    } finally {
      setLoading(false);
    }
  };

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evenement) return;

    if (!user) {
        setErrorMsg("Vous devez être connecté pour finaliser l'inscription.");
        return;
    }

    setProcessing(true);
    setErrorMsg('');

    try {
      // 1. D'ABORD : Créer l'inscription (Backend requirement)
      // Cela retourne l'objet Inscription avec son ID
      const inscription = await inscriptionService.create(user.id, evenement.id);

      // 2. ENSUITE : Si payant, traiter le paiement lié à cette inscription
      if (evenement.prix > 0) {
        await paiementService.create({
          montant: evenement.prix,
          moyenPaiement: 'CARTE', // Simulation: on force 'CARTE'
          inscriptionId: inscription.id // Lien essentiel
        });
      }

      // 3. Succès
      setStep('success');

    } catch (err: any) {
      console.error("Erreur inscription/paiement:", err);
      // Gestion basique des erreurs (ex: déjà inscrit)
      const message = err.response?.data || "Une erreur est survenue. Vous êtes peut-être déjà inscrit.";
      setErrorMsg(typeof message === 'string' ? message : "Erreur technique lors de l'inscription.");
      setStep('error');
    } finally {
      setProcessing(false);
    }
  };

  // Helpers d'affichage
  const getLocationString = () => {
    if (!evenement) return '';
    const lieuNom = evenement.lieu?.nom || 'Lieu';
    const lieuVille = evenement.lieu?.ville  || '';
    return `${lieuNom}${lieuVille ? `, ${lieuVille}` : ''}`;
  };

  const isPayant = evenement ? evenement.prix > 0 : false;

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>;
  if (!evenement) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Événement introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-950 py-12 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg p-8 shadow-2xl">
        
        {/* --- ÉTAPE SUCCÈS --- */}
        {step === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Inscription Confirmée !</h2>
            <p className="text-gray-300 mb-8">
              Félicitations <strong>{user?.prenom}</strong>, vous êtes bien inscrit à <strong>{evenement.nom}</strong>.
              {isPayant && <span className="block mt-2 text-sm text-gray-400">Le paiement a été validé avec succès.</span>}
            </p>
            <button 
              onClick={() => navigate('/evenements')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition w-full"
            >
              Retour aux événements
            </button>
          </div>
        ) : (
          /* --- ÉTAPE CONFIRMATION / PAIEMENT --- */
          <div>
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center mb-6 text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour
            </button>

            <h1 className="text-2xl font-bold text-white mb-2">Finaliser l'inscription</h1>
            <p className="text-gray-400 mb-6">Vérifiez les détails avant de confirmer.</p>

            {/* Récapitulatif */}
            <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">{evenement.nom}</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-blue-400" />
                  {new Date(evenement.dateDebut).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-red-400" />
                  {getLocationString()}
                </div>
                
                {/* Info Utilisateur */}
                <div className="flex items-center mt-2 pt-3 border-t border-gray-800 text-gray-400">
                   <span className="mr-2">Participant :</span>
                   <span className="text-white font-medium">{user?.prenom} {user?.nom}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-gray-400">Total à payer</span>
                <div className={`flex items-center text-2xl font-bold ${isPayant ? 'text-green-400' : 'text-blue-400'}`}>
                  {isPayant ? (
                    <>
                        <span className="mr-1">{evenement.prix}</span> <Euro className="w-6 h-6" />
                    </>
                  ) : 'Gratuit'}
                </div>
              </div>
            </div>

            {/* Zone d'erreur (si inscription échoue ou déjà inscrit) */}
            {(step === 'error' || errorMsg) && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start text-red-400">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleInscription}>
              {/* Simulation Paiement (uniquement si payant) */}
              {isPayant && (
                <div className="mb-6 space-y-4">
                  <p className="text-white font-medium flex items-center mb-3">
                    <CreditCard className="w-5 h-5 mr-2" /> Paiement sécurisé
                  </p>
                  
                  <div className="opacity-75 relative">
                    {/* Overlay pour simuler que c'est un mock */}
                    <div className="absolute inset-0 z-10 cursor-not-allowed"></div>
                    <input type="text" placeholder="Numéro de carte" readOnly className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400 mb-4" value="•••• •••• •••• 4242 (Simulation)" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/AA" readOnly className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400" value="12/28" />
                        <input type="text" placeholder="CVC" readOnly className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400" value="123" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Ceci est une simulation. Aucune carte réelle n'est requise.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center ${
                  processing 
                    ? 'bg-gray-600 text-gray-400 cursor-wait' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20'
                }`}
              >
                {processing 
                    ? 'Traitement en cours...' 
                    : (isPayant ? `Payer ${evenement.prix} € et S'inscrire` : "Confirmer l'inscription")
                }
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscriptionPage;