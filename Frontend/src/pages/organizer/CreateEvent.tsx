import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Euro, FileText, Save, Image } from 'lucide-react';
import { evenementService } from '../../services/evenementService';
import {lieuService} from '../../services/lieuService';
import {Lieu} from '../../types';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [lieuxLoading, setLieuxLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    payant: false,
    prix: 0,
    lieuId: 0,
    imageUrl: '',
  });

  useEffect(() => {
    const loadLieux = async () => {
      try {
        const data = await lieuService.getAll();
        setLieux(data);
        // Option : mettre par défaut le premier lieu
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, lieuId: data[0].id }));
        }
      } catch (err) {
        setError('Erreur lors du chargement des lieux');
      } finally {
        setLieuxLoading(false);
      }
    };

    loadLieux();
  }, []);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;
  const checked = (e.target as HTMLInputElement).checked;

  let newValue: any;
  if (type === 'checkbox') {
    newValue = checked;
  } else if (name === 'prix') {
    newValue = Number(value);
  } else if (name === 'lieuId') {
    newValue = Number(value);  
  } else {
    newValue = value;
  }

  setFormData(prev => ({
    ...prev,
    [name]: newValue,
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await evenementService.create(formData);
      navigate('/organisateur/evenements');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8">Créer un événement</h1>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de l'événement
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de votre événement"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez votre événement"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de l'image
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Optionnel : URL d'une image pour illustrer l'événement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de début
                </label>
                <input
                  type="datetime-local"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de fin
                </label>
                <input
                  type="datetime-local"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

           <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lieu
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  name="lieuId"
                  value={formData.lieuId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={lieuxLoading || lieux.length === 0}
                >
                  {lieuxLoading && <option>Chargement des lieux...</option>}
                  {!lieuxLoading && lieux.length === 0 && (
                    <option>Aucun lieu disponible</option>
                  )}
                  {!lieuxLoading &&
                    lieux.map((lieu) => (
                      <option key={lieu.id} value={lieu.id}>
                        {lieu.nom} - {lieu.ville} {lieu.adresse} - {lieu.nbPlaces} places
                      </option>
                    ))}
                </select>
              </div>
              <p className="text-gray-500 text-xs mt-1">Sélectionnez le lieu de l'événement</p>
            </div>


            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="payant"
                  checked={formData.payant}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-300">
                  Événement payant
                </label>
              </div>

              {formData.payant && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prix (€)
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Création...' : 'Créer l\'événement'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/organisateur/evenements')}
                className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
