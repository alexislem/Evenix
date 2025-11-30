import React, { useEffect, useState } from 'react';
import { Building, Trash2, Mail, Phone, MapPin, Edit2, Check, X } from 'lucide-react';
import { entrepriseService } from '../../services/entrepriseService';
import { Entreprise } from '../../types';

// Interface pour le formulaire d'édition
interface EditFormData {
  nom: string;
  statutJuridique: string;
  adresse: string;
  secteurActivite: string;
  telephone: string;
  email: string;
}

const AdminEntreprises: React.FC = () => {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ÉTATS D'ÉDITION ---
  const [editingEntrepriseId, setEditingEntrepriseId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({} as EditFormData);

  useEffect(() => {
    loadEntreprises();
  }, []);

  const loadEntreprises = async () => {
    try {
      const data = await entrepriseService.getAll();
      setEntreprises(data);
    } catch (err) {
      console.error('Erreur lors du chargement des entreprises', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nom: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise "${nom}" ?`)) {
      return;
    }

    try {
      await entrepriseService.delete(id);
      setEntreprises(entreprises.filter((e) => e.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  // --- FONCTIONS D'ÉDITION ---

  const handleEditClick = (entreprise: Entreprise) => {
    setEditingEntrepriseId(entreprise.id);
    // CORRECTION ICI : On utilise ?? '' pour éviter l'erreur "undefined is not assignable to string"
    setEditFormData({
      nom: entreprise.nom,
      statutJuridique: entreprise.statutJuridique ?? '', 
      adresse: entreprise.adresse ?? '',
      secteurActivite: entreprise.secteurActivite ?? '',
      telephone: entreprise.telephone ?? '',
      email: entreprise.email,
    });
  };

  const handleCancelEdit = () => {
    setEditingEntrepriseId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (entrepriseId: number) => {
    try {
      const payload: Partial<Entreprise> = {
        id: entrepriseId,
        nom: editFormData.nom,
        statutJuridique: editFormData.statutJuridique,
        adresse: editFormData.adresse,
        secteurActivite: editFormData.secteurActivite,
        telephone: editFormData.telephone,
        email: editFormData.email,
      };

      const updatedEntreprise = await entrepriseService.update(entrepriseId, payload);

      setEntreprises(entreprises.map((e) =>
        e.id === entrepriseId ? updatedEntreprise : e
      ));
      
      setEditingEntrepriseId(null);

    } catch (err) {
      console.error("Erreur de sauvegarde:", err);
      alert('Erreur lors de la modification de l\'entreprise');
    }
  };


  // --- FILTRAGE ---

  const filteredEntreprises = entreprises.filter(
    (entreprise) =>
      entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entreprise.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // CORRECTION ICI AUSSI : On sécurise l'adresse avant le toLowerCase()
      (entreprise.adresse ?? '').toLowerCase().includes(searchTerm.toLowerCase()) 
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
          <h1 className="text-4xl font-bold text-white mb-2">Gestion des entreprises</h1>
          <p className="text-gray-400">Administrez toutes les entreprises de la plateforme</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une entreprise..."
            className="w-full md:w-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {filteredEntreprises.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">Aucune entreprise trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredEntreprises.map((entreprise) => {
                const isEditing = editingEntrepriseId === entreprise.id;

                return (
                    <div
                        key={entreprise.id}
                        className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-green-500 transition"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                
                                {/* --- Nom et Statut Juridique --- */}
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                                        {entreprise.nom[0]}
                                    </div>
                                    <div className='flex-1'>
                                        {isEditing ? (
                                            <input
                                                name="nom"
                                                value={editFormData.nom}
                                                onChange={handleInputChange}
                                                className="text-2xl font-bold text-white bg-gray-700 border border-gray-600 rounded p-1 w-full mb-1"
                                            />
                                        ) : (
                                            <h3 className="text-2xl font-bold text-white">{entreprise.nom}</h3>
                                        )}
                                        {isEditing ? (
                                            <input
                                                name="statutJuridique"
                                                value={editFormData.statutJuridique}
                                                onChange={handleInputChange}
                                                placeholder="Statut Juridique"
                                                className="text-gray-400 text-sm bg-gray-700 border border-gray-600 rounded p-1 w-full"
                                            />
                                        ) : (
                                            <p className="text-gray-400 text-sm">Statut: {entreprise.statutJuridique}</p>
                                        )}
                                    </div>
                                </div>

                                {/* --- Champs de Contact et Adresse --- */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
                                    {/* Email */}
                                    <div className="flex items-center text-gray-300">
                                        <Mail className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                                        {isEditing ? (
                                            <input
                                                name="email"
                                                type="email"
                                                value={editFormData.email}
                                                onChange={handleInputChange}
                                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                                            />
                                        ) : (
                                            <span>{entreprise.email}</span>
                                        )}
                                    </div>

                                    {/* Téléphone */}
                                    <div className="flex items-center text-gray-300">
                                        <Phone className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                                        {isEditing ? (
                                            <input
                                                name="telephone"
                                                type="tel"
                                                value={editFormData.telephone}
                                                onChange={handleInputChange}
                                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                                            />
                                        ) : (
                                            <span>{entreprise.telephone}</span>
                                        )}
                                    </div>

                                    {/* Secteur d'activité */}
                                    <div className="flex items-center text-gray-300">
                                        <Building className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
                                        {isEditing ? (
                                            <input
                                                name="secteurActivite"
                                                value={editFormData.secteurActivite}
                                                onChange={handleInputChange}
                                                placeholder="Secteur"
                                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                                            />
                                        ) : (
                                            <span className='text-gray-400'>Secteur: {entreprise.secteurActivite}</span>
                                        )}
                                    </div>

                                    {/* Adresse */}
                                    <div className="flex items-center text-gray-300">
                                        <MapPin className="w-4 h-4 mr-2 text-red-400 flex-shrink-0" />
                                        {isEditing ? (
                                            <input
                                                name="adresse"
                                                value={editFormData.adresse}
                                                onChange={handleInputChange}
                                                placeholder="Adresse du siège"
                                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                                            />
                                        ) : (
                                            <span>{entreprise.adresse}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- ACTIONS --- */}
                            <div className="flex flex-col gap-2 ml-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => handleSave(entreprise.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition"
                                            title="Sauvegarder"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition"
                                            title="Annuler"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(entreprise)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                                            title="Modifier"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(entreprise.id, entreprise.nom)}
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
          </div>
        )}

        <div className="mt-6 text-center text-gray-400">
          Total: {filteredEntreprises.length} entreprise(s)
        </div>
      </div>
    </div>
  );
};

export default AdminEntreprises;