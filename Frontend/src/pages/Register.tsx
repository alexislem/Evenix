import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; // 1. Import useSearchParams
import { UserPlus, Mail, Lock, User, Phone, Calendar, AlertCircle, ShieldCheck, ShieldQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api'; // Assure-toi d'avoir accès à api ou modifie useAuth

const Register: React.FC = () => {
  // 2. Récupération du rôle dans l'URL
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  
  // Par sécurité, si l'URL n'a pas de rôle, on met PARTICIPANT par défaut
  const userRole = roleParam === 'ORGANISATEUR' ? 'ORGANISATEUR' : 'PARTICIPANT';
  
  // 3. Configuration des couleurs dynamiques (Vert = Participant, Violet = Organisateur)
  const themeColor = userRole === 'ORGANISATEUR' ? 'purple' : 'green';
  const ThemeIcon = userRole === 'ORGANISATEUR' ? Calendar : UserPlus;

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
  const [showPassword, setShowPassword] = useState(false);

  // Note : Si ta fonction 'register' du contexte ne prend pas le rôle en argument,
  // il faudra peut-être utiliser 'api.post' directement ici ou modifier ton AuthContext.
  // Pour l'exemple, j'utilise une requête directe qui est plus sûre pour ce cas spécifique.
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telephone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fonction de validation du mot de passe
  const validatePassword = (password: string) => {
    // 1. Longueur minimale
    if (password.length < 12) return "Le mot de passe doit contenir au moins 12 caractères.";

    // 2. Compter les caractères par type
    const lowerCount = (password.match(/[a-z]/g) || []).length;
    const specialCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
    const upperCount = (password.match(/[A-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length; // ✅ On compte les chiffres

    // 3. Vérifier la composition totale (Pour interdire les espaces ou symboles non gérés)
    // La longueur totale doit être égale à la somme des 4 catégories.
    const isValidComposition = password.length === (lowerCount + specialCount + upperCount + numberCount);

    // --- RÈGLES ---
    if (lowerCount !== 1) return "Le mot de passe doit contenir exactement 1 minuscule.";
    if (specialCount < 1) return "Le mot de passe doit contenir au moins 1 caractère spécial.";
    if (!isValidComposition) return "Le mot de passe contient des caractères interdits (espaces...).";
    
    // On s'assure qu'il y a quand même des majuscules (si c'est que des chiffres, ce n'est pas bon ?)
    // Si vous voulez obliger au moins une majuscule :
    if (upperCount < 1) return "Le mot de passe doit contenir au moins une majuscule.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(formData.motDePasse);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      // 4. Envoi de la requête avec le RÔLE
      await api.post('/api/auth/register', {
        ...formData,
        role: userRole // <--- C'est ici que ça se joue
      });
      navigate('/login?registration=success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        
        {/* Lien retour */}
        <Link to="/RegisterSelection" className="text-gray-400 hover:text-white flex items-center mb-6 text-sm">
           <ArrowLeft className="w-4 h-4 mr-2" /> Changer de type de compte
        </Link>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          
          <div className="flex justify-center mb-6">
            {/* Couleur dynamique de l'icône */}
            <div className={`p-4 rounded-full ${userRole === 'ORGANISATEUR' ? 'bg-purple-600' : 'bg-green-600'}`}>
              <ThemeIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Titre Dynamique */}
          <h2 className="text-3xl font-bold text-white text-center mb-1">
            Inscription {userRole === 'ORGANISATEUR' ? 'Organisateur' : 'Participant'}
          </h2>
          <p className="text-center text-gray-400 text-sm mb-6">
            {userRole === 'ORGANISATEUR' ? 'Créez et gérez vos événements' : 'Rejoignez des événements inoubliables'}
          </p>

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
                <input
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  // Couleur du focus dynamique
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${userRole === 'ORGANISATEUR' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`} required />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  name="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={handleChange} placeholder="Prénom"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${userRole === 'ORGANISATEUR' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`} required />
              </div>
            </div>

            {/* Contact */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${userRole === 'ORGANISATEUR' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  name="telephone"
                  type="text"
                  inputMode='numeric'
                  pattern='[0-9]*'
                  maxLength={10}
                  value={formData.telephone}
                  onChange={handleChange} 
                  placeholder="Téléphone"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${userRole === 'ORGANISATEUR' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`} />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  name="dateDeNaissance"
                  type="date"
                  value={formData.dateDeNaissance}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white [color-scheme:dark] focus:outline-none focus:ring-2 ${userRole === 'ORGANISATEUR' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`} required />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  name="motDePasse"
                  type={showPassword ? "text" : "password"}
                  value={formData.motDePasse}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${userRole === 'ORGANISATEUR' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
                  required
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label htmlFor="showPassword" className="text-white">
                  Montrer le mot de passe
                </label>
              </div>
              {/* Guide visuel sécurité */}
              <div className="mt-2 text-xs text-gray-400 space-y-1 bg-gray-900/50 p-2 rounded border border-gray-700">
                <p className="font-semibold mb-1 flex items-center"><ShieldCheck className="w-3 h-3 mr-1 text-blue-400"/> Règles requises :</p>
                <ul className="space-y-1">
                  {/* Test : Au moins 12 caractères */}
                  <li className={formData.motDePasse.length >= 12 ? "text-green-400" : "text-gray-500"}>
                    • Au moins 12 caractères
                  </li>

                  {/* Test : Exactement 1 minuscule */}
                  <li className={(formData.motDePasse.match(/[a-z]/g) || []).length === 1 ? "text-green-400" : "text-gray-500"}>
                    • Exactement 1 lettre minuscule
                  </li>

                  {/* Test : Au moins 1 caractère spécial */}
                  <li className={(formData.motDePasse.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 1 ? "text-green-400" : "text-gray-500"}>
                    • Au moins 1 caractère spécial
                  </li>

                  {/* Test : Le reste en Majuscules OU Chiffres */}
                  {/* Logique : On vérifie qu'il y a au moins 1 majuscule ET que la somme de tous les types = longueur totale */}
                  <li className={
                      /[A-Z]/.test(formData.motDePasse) && 
                      (formData.motDePasse.length === (
                        ((formData.motDePasse.match(/[a-z]/g) || []).length) + 
                        ((formData.motDePasse.match(/[A-Z]/g) || []).length) + 
                        ((formData.motDePasse.match(/[0-9]/g) || []).length) + 
                        ((formData.motDePasse.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length)
                      ))
                      ? "text-green-400" : "text-gray-500"
                    }>
                    • Le reste en Majuscules ou Chiffres
                  </li>
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
                    className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 ${userRole === 'ORGANISATEUR' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
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
                    className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 ${userRole === 'ORGANISATEUR' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
                    placeholder="Votre réponse secrète"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bouton Submit avec couleur dynamique */}
            <button 
                type="submit" 
                disabled={loading} 
                className={`w-full font-semibold py-3 rounded-lg transition text-white ${userRole === 'ORGANISATEUR' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
                {loading ? 'Inscription...' : userRole === 'ORGANISATEUR' ? "S'inscrire comme Organisateur" : "S'inscrire"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
                Déjà un compte ? 
                <Link to="/login" className={`font-semibold ml-1 ${userRole === 'ORGANISATEUR' ? 'text-purple-500 hover:text-purple-400' : 'text-green-500 hover:text-green-400'}`}>
                    Connectez-vous
                </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;