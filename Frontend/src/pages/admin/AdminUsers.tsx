import React, { useEffect, useState } from 'react';
import { Users, Trash2, Mail, Phone } from 'lucide-react';
import { utilisateurService } from '../../services/utilisateurService';
import { Utilisateur } from '../../types';

const AdminUsers: React.FC = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUtilisateurs();
  }, []);

  const loadUtilisateurs = async () => {
    try {
      const data = await utilisateurService.getAll();
      setUtilisateurs(data);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nom: string, prenom: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${prenom} ${nom} ?`)) {
      return;
    }

    try {
      await utilisateurService.delete(id);
      setUtilisateurs(utilisateurs.filter((u) => u.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

    const safeLower = (value: string | null | undefined) =>
    (value ?? '').toLowerCase();

    const filteredUtilisateurs = utilisateurs.filter((user) =>
      safeLower(user.nom).includes(searchTerm.toLowerCase()) ||
      safeLower(user.prenom).includes(searchTerm.toLowerCase()) ||
      safeLower(user.email).includes(searchTerm.toLowerCase())
    );


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-400">Administrez tous les utilisateurs de la plateforme</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full md:w-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Nom complet
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Téléphone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Rôles
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Entreprise
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUtilisateurs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">Aucun utilisateur trouvé</p>
                    </td>
                  </tr>
                ) : (
                  filteredUtilisateurs.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-3">
                            {(user.prenom?.[0] ?? user.nom?.[0] ?? '?').toUpperCase()}
                            {user.nom?.[0]?.toUpperCase() ?? ''}
                          </div>

                          <div>
                            <p className="text-white font-medium">
                              {user.prenom} {user.nom}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-300">
                          <Mail className="w-4 h-4 mr-2 text-blue-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-300">
                          <Phone className="w-4 h-4 mr-2 text-green-400" />
                          {user.telephone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {user.role.nom}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300">
                          {user.entreprise ? user.entreprise.nom : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(user.id, user.nom, user.prenom)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400">
          Total: {filteredUtilisateurs.length} utilisateur(s)
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
