import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, CreditCard, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { evenementService } from '../services/evenementService';
import { inscriptionService } from '../services/inscriptionService';
import { paiementService } from '../services/paiementService';
import { Evenement } from '../types';
import { useAuth } from '../context/AuthContext'; // Import du hook d'authentification

const InscriptionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Récupération de l'utilisateur connecté depuis le Context
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
      setErrorMsg("Impossible de charger l'événement");
    } finally {
      setLoading(false);
    }
  };

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evenement) return;

    // Vérification de sécurité : l'utilisateur doit être connecté
    if (!user) {
        setErrorMsg("Vous devez être connecté pour finaliser l'inscription.");
        return;
    }

    setProcessing(true);
    setErrorMsg('');

    try {
      // 1. Si Payant, on traite le paiement d'abord (Simulation)
      if (evenement.payant && evenement.prix > 0) {
        const transactionCode = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        await paiementService.create({
          montant: evenement.prix,
          date: new Date().toISOString(),
          code: transactionCode,
          utilisateurId: user.id, // ID réel de l'utilisateur connecté
          evenementId: evenement.id
        });
      }

      // 2. Création de l'inscription
      await inscriptionService.create(user.id, evenement.id);

      // 3. Succès
      setStep('success');

    } catch (err: any) {
      console.error(err);
      setStep('error');
      setErrorMsg("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setProcessing(false);
    }
  };

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
              {evenement.payant && <span className="block mt-2 text-sm text-gray-400">Un reçu de paiement a été envoyé à {user?.email}.</span>}
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
              <h3 className="text-xl font-semibold text-white mb-2">{evenement.nom}</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  {new Date(evenement.dateDebut).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-400" />
                  {evenement.lieu.nom}, {evenement.lieu.ville}
                </div>
                {/* Petit rappel de l'utilisateur connecté */}
                <div className="flex items-center mt-2 pt-2 border-t border-gray-800 text-gray-500">
                   <span className="mr-2">Inscrit en tant que :</span>
                   <span className="text-white font-medium">{user?.prenom} {user?.nom}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-gray-400">Total à payer</span>
                <span className={`text-2xl font-bold ${evenement.payant ? 'text-green-400' : 'text-blue-400'}`}>
                  {evenement.payant ? `${evenement.prix} €` : 'Gratuit'}
                </span>
              </div>
            </div>

            {step === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start text-red-400">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleInscription}>
              {evenement.payant && (
                <div className="mb-6 space-y-4">
                  <p className="text-white font-medium flex items-center mb-3">
                    <CreditCard className="w-5 h-5 mr-2" /> Paiement sécurisé
                  </p>
                  
                  {/* Simulation de formulaire CB */}
                  <div className="opacity-75">
                    <input type="text" placeholder="Numéro de carte" disabled className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed mb-4" value="•••• •••• •••• 4242 (Simulation)" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/AA" disabled className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed" value="12/28" />
                        <input type="text" placeholder="CVC" disabled className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed" value="123" />
                    </div>
                  </div>
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
                {processing ? 'Traitement en cours...' : (evenement.payant ? `Payer ${evenement.prix} € et S'inscrire` : "Confirmer l'inscription")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscriptionPage;