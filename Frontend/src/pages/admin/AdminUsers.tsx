import React, { useEffect, useState } from 'react';
import { Trash2, Mail, Phone, Edit2, Check, X, Eye } from 'lucide-react'; // Ajout de Eye
import { useNavigate } from 'react-router-dom'; // Ajout du hook
import { utilisateurService } from '../../services/utilisateurService';
import { entrepriseService } from '../../services/entrepriseService';
import { Utilisateur, Entreprise } from '../../types';

// Interface pour le formulaire d'édition
interface EditFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  roleId: number;
  entrepriseId: number | string;
}

const AdminUsers: React.FC = () => {
  const navigate = useNavigate(); // Hook de navigation
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- États pour l'édition ---
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    nom: '', prenom: '', email: '', telephone: '', roleId: 1, entrepriseId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, entreprisesData] = await Promise.all([
        utilisateurService.getAll(),
        entrepriseService.getAll()
      ]);
      setUtilisateurs(usersData);
      setEntreprises(entreprisesData);
    } catch (err) {
      console.error('Erreur lors du chargement des données', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Initialisation du mode édition ---
  const handleEditClick = (user: Utilisateur) => {
    setEditingUserId(user.id);
    setEditFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone || '',
      roleId: user.role.id,
      entrepriseId: user.entreprise ? user.entreprise.id : ''
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  // --- Gestion des changements dans les inputs ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- Sauvegarde globale ---
  const handleSave = async (userId: number) => {
    try {
      const payload: any = {
        nom: editFormData.nom,
        prenom: editFormData.prenom,
        email: editFormData.email,
        telephone: editFormData.telephone,
        role: { id: Number(editFormData.roleId) },
        entreprise: editFormData.entrepriseId ? { id: Number(editFormData.entrepriseId) } : null
      };

      const updatedUser = await utilisateurService.update(userId, payload);

      setUtilisateurs(utilisateurs.map((u) =>
        u.id === userId ? updatedUser : u
      ));
      
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: number, nom: string, prenom: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${prenom} ${nom} ?`)) { return; }
    try {
      await utilisateurService.delete(id);
      setUtilisateurs(utilisateurs.filter((u) => u.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const safeLower = (value: string | null | undefined) => (value ?? '').toLowerCase();

  const filteredUtilisateurs = utilisateurs.filter((user) =>
    safeLower(user.nom).includes(searchTerm.toLowerCase()) ||
    safeLower(user.prenom).includes(searchTerm.toLowerCase()) ||
    safeLower(user.email).includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gestion des utilisateurs</h1>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="w-full md:w-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nom complet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Téléphone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rôles</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Entreprise</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUtilisateurs.map((user) => {
                  const isEditing = editingUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-gray-750 transition">
                      
                      {/* --- Colonne Nom / Prénom --- */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              name="prenom"
                              value={editFormData.prenom}
                              onChange={handleInputChange}
                              placeholder="Prénom"
                              className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                            />
                            <input
                              name="nom"
                              value={editFormData.nom}
                              onChange={handleInputChange}
                              placeholder="Nom"
                              className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-3">
                              {(user.prenom?.[0] ?? user.nom?.[0] ?? '?').toUpperCase()}
                            </div>
                            <p className="text-white font-medium">{user.prenom} {user.nom}</p>
                          </div>
                        )}
                      </td>

                      {/* --- Colonne Email --- */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            name="email"
                            value={editFormData.email}
                            onChange={handleInputChange}
                            className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-sm w-full"
                          />
                        ) : (
                          <div className="flex items-center text-gray-300">
                            <Mail className="w-4 h-4 mr-2 text-blue-400" />
                            {user.email}
                          </div>
                        )}
                      </td>

                      {/* --- Colonne Téléphone --- */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            name="telephone"
                            value={editFormData.telephone}
                            onChange={handleInputChange}
                            className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white text-sm w-28"
                          />
                        ) : (
                          <div className="flex items-center text-gray-300">
                            <Phone className="w-4 h-4 mr-2 text-green-400" />
                            {user.telephone}
                          </div>
                        )}
                      </td>

                      {/* --- Colonne Rôles --- */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            name="roleId"
                            value={editFormData.roleId}
                            onChange={handleInputChange}
                            className="bg-gray-900 border border-gray-600 text-white text-sm px-2 py-1 rounded focus:outline-none"
                          >
                            <option value="2">PARTICIPANT</option>
                            <option value="3">ORGANISATEUR</option>
                            <option value="1">ADMIN</option>
                          </select>
                        ) : (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {user.role.nom}
                          </span>
                        )}
                      </td>

                      {/* --- Colonne Entreprise --- */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            name="entrepriseId"
                            value={editFormData.entrepriseId}
                            onChange={handleInputChange}
                            className="bg-gray-900 border border-gray-600 text-white text-sm px-2 py-1 rounded focus:outline-none w-32"
                          >
                            <option value="">-- Aucune --</option>
                            {entreprises.map((ent) => (
                              <option key={ent.id} value={ent.id}>
                                {ent.nom}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-gray-300">
                            {user.entreprise ? user.entreprise.nom : '-'}
                          </p>
                        )}
                      </td>

                      {/* --- Colonne Actions --- */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(user.id)}
                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition"
                                title="Sauvegarder"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition"
                                title="Annuler"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* BOUTON DÉTAILS (Nouvelle page) */}
                              <button
                                onClick={() => navigate(`/admin/utilisateurs/${user.id}`)}
                                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition"
                                title="Voir détails et inscriptions"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleEditClick(user)}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                                title="Modifier"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id, user.nom, user.prenom)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;