import React, { useEffect, useState } from 'react';
import { Building, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { entrepriseService } from '../../services/entrepriseService';
import { Entreprise } from '../../types';

const AdminEntreprises: React.FC = () => {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredEntreprises = entreprises.filter(
    (entreprise) =>
      entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entreprise.email.toLowerCase().includes(searchTerm.toLowerCase())
     // entreprise.siret.includes(searchTerm)
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
            {filteredEntreprises.map((entreprise) => (
              <div
                key={entreprise.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-green-500 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                        {entreprise.nom[0]}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{entreprise.nom}</h3>
                        {/* <p className="text-gray-400 text-sm">SIRET: {entreprise.siret}</p> */}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{entreprise.email}</span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Phone className="w-4 h-4 mr-2 text-green-400" />
                        <span>{entreprise.telephone}</span>
                      </div>

                      <div className="flex items-center text-gray-300 md:col-span-2">
                        <MapPin className="w-4 h-4 mr-2 text-red-400" />
                        <span>{entreprise.adresse}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(entreprise.id, entreprise.nom)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition ml-4"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
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
