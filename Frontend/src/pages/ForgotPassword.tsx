import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { api } from '../utils/api';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  
  // Étapes : 1 = Email, 2 = Question/Réponse, 3 = Succès
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Données du formulaire
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // ÉTAPE 1 : Vérifier l'email et récupérer la question
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // GET /api/auth/security-question?email=...
      const response = await api.get(`/api/auth/security-question?email=${email}`);
      setSecurityQuestion(response.data.question);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      // CORRECTION ICI : On regarde si le backend a envoyé un message
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Cet email ne correspond à aucun compte ou n'a pas de question de sécurité.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 2 : Vérifier la réponse et changer le mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // POST /api/auth/reset-password
      await api.post('/api/auth/reset-password', {
        email,
        reponseSecurite: securityAnswer,
        nouveauMotDePasse: newPassword
      });
      setStep(3);
    } catch (err: any) {
      console.error(err);
      // CORRECTION ICI : C'est ici que le message "Compte non confirmé" sera attrapé
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Réponse incorrecte ou erreur technique.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="bg-blue-600/20 text-blue-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Récupération de compte</h2>
          <p className="text-gray-400 mt-2 text-sm">
            {step === 1 && "Entrez votre email pour commencer"}
            {step === 2 && "Répondez à votre question de sécurité"}
            {step === 3 && "Mot de passe modifié !"}
          </p>
        </div>

        {/* Affichage des erreurs - Amélioration visuelle pour les alertes (Jaune) vs Erreurs (Rouge) */}
        {error && (
          <div className={`border px-4 py-3 rounded-lg mb-6 flex items-center text-sm ${
            error.includes("confirmé") 
              ? "bg-yellow-900/30 border-yellow-700 text-yellow-200" 
              : "bg-red-900/30 border-red-700 text-red-200"
          }`}>
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* --- FORMULAIRE ÉTAPE 1 : EMAIL --- */}
        {step === 1 && (
          <form onSubmit={handleCheckEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
            >
              {loading ? 'Recherche...' : <>Continuer <ArrowRight className="w-4 h-4 ml-2" /></>}
            </button>
          </form>
        )}

        {/* --- FORMULAIRE ÉTAPE 2 : QUESTION & NOUVEAU MDP --- */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-6">
                <p className="text-gray-400 text-xs uppercase mb-1">Question de sécurité</p>
                <p className="text-white font-medium flex items-start">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                    {securityQuestion}
                </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Votre réponse</label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Réponse..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Modification...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}

        {/* --- ÉTAPE 3 : SUCCÈS --- */}
        {step === 3 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-300 mb-8">
              Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Retour à la connexion
            </button>
          </div>
        )}

        <div className="mt-6 text-center border-t border-gray-700 pt-4">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white">
            Annuler et revenir à la connexion
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;