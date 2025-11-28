import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    dateDeNaissance: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
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
          <p className="text-gray-400 text-center mb-8">
            Créez votre compte Evenix
          </p>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-300 mb-2">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-300 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Prénom"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-300 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="dateDeNaissance" className="block text-sm font-medium text-gray-300 mb-2">
                Date de naissance
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="dateDeNaissance"
                  name="dateDeNaissance"
                  type="date"
                  value={formData.dateDeNaissance}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="motDePasse"
                  name="motDePasse"
                  type="password"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-green-500 hover:text-green-400 font-semibold">
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
