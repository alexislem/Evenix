import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, Calendar, BarChart3 } from 'lucide-react';
import { utilisateurService } from '../../services/utilisateurService';
import { entrepriseService } from '../../services/entrepriseService';
import { evenementService } from '../../services/evenementService';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    utilisateurs: 0,
    entreprises: 0,
    evenements: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, companies, events] = await Promise.all([
        utilisateurService.getAll(),
        entrepriseService.getAll(),
        evenementService.getAll(),
      ]);

      setStats({
        utilisateurs: users.length,
        entreprises: companies.length,
        evenements: events.length,
      });
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Administration</h1>
          <p className="text-gray-400">Gérez la plateforme Evenix</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/utilisateurs"
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white hover:scale-105 transition transform"
          >
            <Users className="w-10 h-10 mb-4" />
            <h3 className="text-3xl font-bold mb-2">{stats.utilisateurs}</h3>
            <p className="text-blue-100">Utilisateurs</p>
          </Link>

          <Link
            to="/admin/entreprises"
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white hover:scale-105 transition transform"
          >
            <Building className="w-10 h-10 mb-4" />
            <h3 className="text-3xl font-bold mb-2">{stats.entreprises}</h3>
            <p className="text-green-100">Entreprises</p>
          </Link>

          <Link
            to="/admin/evenements"
            className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white hover:scale-105 transition transform"
          >
            <Calendar className="w-10 h-10 mb-4" />
            <h3 className="text-3xl font-bold mb-2">{stats.evenements}</h3>
            <p className="text-purple-100">Événements</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-white">Gestion rapide</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/utilisateurs"
                className="block bg-gray-900 hover:bg-gray-700 p-4 rounded-lg text-white transition"
              >
                Gérer les utilisateurs
              </Link>
              <Link
                to="/admin/entreprises"
                className="block bg-gray-900 hover:bg-gray-700 p-4 rounded-lg text-white transition"
              >
                Gérer les entreprises
              </Link>
              <Link
                to="/admin/evenements"
                className="block bg-gray-900 hover:bg-gray-700 p-4 rounded-lg text-white transition"
              >
                Gérer les événements
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Aperçu de la plateforme</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Utilisateurs actifs</span>
                  <span className="text-white font-semibold">{stats.utilisateurs}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Entreprises enregistrées</span>
                  <span className="text-white font-semibold">{stats.entreprises}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Événements créés</span>
                  <span className="text-white font-semibold">{stats.evenements}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
