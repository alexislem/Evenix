import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Calendar, AlertCircle, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    dateDeNaissance: '',
    questionSecurite: '',
    reponseSecurite: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // On élargit le type de l'événement pour accepter les Select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction de validation du mot de passe
  const validatePassword = (password: string) => {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Le mot de passe doit contenir au moins 12 caractères.";
    if (!hasUpperCase) return "Le mot de passe doit contenir au moins une majuscule.";
    if (!hasLowerCase) return "Le mot de passe doit contenir au moins une minuscule.";
    if (!hasNumber) return "Le mot de passe doit contenir au moins un chiffre.";
    if (!hasSpecialChar) return "Le mot de passe doit contenir au moins un caractère spécial.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation du mot de passe
    const passwordError = validatePassword(formData.motDePasse);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err: any) { 
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white text-center mb-2">Inscription</h2>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identité */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input name="nom" type="text" value={formData.nom} onChange={handleChange} placeholder="Nom" className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input name="prenom" type="text" value={formData.prenom} onChange={handleChange} placeholder="Prénom" className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
            </div>

            {/* Contact */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input name="telephone" type="tel" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input name="dateDeNaissance" type="date" value={formData.dateDeNaissance} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
            </div>
            
            {/* Mot de passe */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  name="motDePasse" 
                  type="password" 
                  value={formData.motDePasse} 
                  onChange={handleChange} 
                  placeholder="Mot de passe" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  required 
                />
              </div>
              {/* Guide visuel sécurité */}
              <div className="mt-2 text-xs text-gray-400 space-y-1 bg-gray-900/50 p-2 rounded border border-gray-700">
                <p className="font-semibold mb-1 flex items-center"><ShieldCheck className="w-3 h-3 mr-1 text-blue-400"/> Sécurité requise :</p>
                <ul className="grid grid-cols-2 gap-x-2">
                   <li className={formData.motDePasse.length >= 12 ? "text-green-400" : "text-gray-500"}>• 12 caractères</li>
                   <li className={/[A-Z]/.test(formData.motDePasse) ? "text-green-400" : "text-gray-500"}>• 1 Majuscule</li>
                   <li className={/[0-9]/.test(formData.motDePasse) ? "text-green-400" : "text-gray-500"}>• 1 Chiffre</li>
                   <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.motDePasse) ? "text-green-400" : "text-gray-500"}>• 1 Caractère spécial</li>
                </ul>
              </div>
            </div>

            {/* Section Question de Sécurité */}
            <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center mb-4">
                    <ShieldQuestion className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-white font-medium text-sm">Sécurité du compte (Récupération)</span>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Question secrète</label>
                        <select
                            name="questionSecurite"
                            value={formData.questionSecurite}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="">Choisir une question...</option>
                            <option value="Quel est le nom de votre premier animal ?">Quel est le nom de votre premier animal ?</option>
                            <option value="Quelle est votre ville de naissance ?">Quelle est votre ville de naissance ?</option>
                            <option value="Quel est le nom de jeune fille de votre mère ?">Quel est le nom de jeune fille de votre mère ?</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Réponse</label>
                        <input
                            type="text"
                            name="reponseSecurite"
                            value={formData.reponseSecurite}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Votre réponse secrète"
                            required
                        />
                    </div>
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">{loading ? 'Inscription...' : 'S\'inscrire'}</button>
          </form>
          <div className="mt-6 text-center"><p className="text-gray-400">Déjà un compte ? <Link to="/login" className="text-green-500 hover:text-green-400 font-semibold">Connectez-vous</Link></p></div>
        </div>
      </div>
    </div>
  );
};
export default Register;