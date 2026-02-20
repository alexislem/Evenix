import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. On attend la réponse de la connexion
      // (AuthContext a été modifié précédemment pour renvoyer la réponse complète)
      const response = await login({ email, motDePasse });

      // 2. On récupère le rôle de l'utilisateur
      // La structure correspond à votre LoginData.java : { token, utilisateur: { role: { nom: ... } } }
      const role = response?.utilisateur?.role?.nom;

      console.log("Connexion réussie, Rôle détecté :", role);

      // 3. Redirection intelligente selon les routes définies dans votre router
      switch (role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'ORGANISATEUR':
          navigate('/organisateur/dashboard');
          break;
        case 'PARTICIPANT':
        default:
          navigate('/dashboard'); // Dashboard par défaut pour les utilisateurs
          break;
      }

    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">Connexion</h2>
          <p className="text-gray-400 text-center mb-8">
            Accédez à votre compte Evenix
          </p>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div className="flex items-center justify-end mb-6">
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Mot de passe oublié ?
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;