import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Mail, Phone, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tableau de bord</h1>
          <p className="text-gray-400">
            Bienvenue, {user?.prenom} {user?.nom}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <Calendar className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Mes Événements</h3>
            <p className="text-blue-100">Gérez vos participations</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <User className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Mon Profil</h3>
            <Link to="/profil" className="text-green-100 hover:underline">
              Modifier mes informations
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <Calendar className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Explorer</h3>
            <Link to="/evenements" className="text-purple-100 hover:underline">
              Découvrir les événements
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Mes Informations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-3 text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Nom complet</p>
                  <p className="text-white font-medium">
                    {user?.prenom} {user?.nom}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 mr-3 text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <Phone className="w-5 h-5 mr-3 text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">Téléphone</p>
                  <p className="text-white font-medium">{user?.telephone}</p>
                </div>
              </div>
            </div>

            <div>
              {user?.entreprise && (
                <div className="flex items-center mb-4">
                  <Building className="w-5 h-5 mr-3 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Entreprise</p>
                    <p className="text-white font-medium">{user.entreprise.nom}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-3 text-red-400" />
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 mr-3 text-red-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Rôle</p>
                    {user?.role && (
                      <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full inline-block mt-1">
                        {user.role.nom}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <Link
              to="/profil"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Modifier mon profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
