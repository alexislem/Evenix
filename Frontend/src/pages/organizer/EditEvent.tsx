import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, Euro, FileText, Save, Image, AlertCircle } from 'lucide-react';
import { evenementService } from '../../services/evenementService';
import { lieuService } from '../../services/lieuService'; // Import du service Lieu
import { Lieu, CreateEventRequest } from '../../types';

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  
  // On stocke la liste des lieux pour le selecteur
  const [lieux, setLieux] = useState<Lieu[]>([]);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    payant: false,
    prix: 0,
    lieuId: 0,
    imageUrl: '',
    ville: ''
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      
      // 1. On charge l'événement ET la liste des lieux en parallèle
      const [event, lieuxData] = await Promise.all([
        evenementService.getById(Number(id)),
        lieuService.getAll()
      ]);

      setLieux(lieuxData);

      // Helper pour formater la date pour l'input datetime-local (YYYY-MM-DDTHH:mm)
      const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().slice(0, 16);
      };

      // 2. On pré-remplit le formulaire
      setFormData({
        nom: event.nom,
        description: event.description,
        dateDebut: formatDateForInput(event.dateDebut),
        dateFin: formatDateForInput(event.dateFin),
        payant: event.prix > 0, // On déduit si c'est payant
        prix: event.prix,
        lieuId: event.lieu?.id || 0,
        imageUrl: event.imageUrl || '',
        ville: event.lieu?.ville || ''
      });

    } catch (err) {
      console.error(err);
      setError('Impossible de charger les données de l\'événement');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let newValue: any;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (name === 'prix' || name === 'lieuId') {
      newValue = Number(value);
    } else {
      newValue = value;
    }

    setFormData(prev => {
      const updatedState = {
        ...prev,
        [name]: newValue,
      };

      // Mise à jour dynamique de la ville si on change le lieu
      if (name === 'lieuId') {
        const selectedLieu = lieux.find(l => l.id === newValue);
        if (selectedLieu) {
          updatedState.ville = selectedLieu.ville || '';
        }
      }

      return updatedState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Récupération de l'objet Lieu complet (nécessaire pour le backend)
    const selectedLieu = lieux.find(l => l.id === formData.lieuId);
    if (!selectedLieu) {
        setError("Lieu invalide");
        setLoading(false);
        return;
    }

    try {
      const payload: CreateEventRequest = {
        nom: formData.nom,
        description: formData.description,
        dateDebut: new Date(formData.dateDebut).toISOString(),
        dateFin: new Date(formData.dateFin).toISOString(),
        prix: formData.payant ? formData.prix : 0,
        ville: formData.ville,
        imageUrl: formData.imageUrl,
        
        // On envoie l'objet Lieu complet
        lieu: selectedLieu,
        types: [] // À gérer si vous ajoutez l'édition des types
      };

      await evenementService.update(Number(id), payload);
      navigate('/organisateur/evenements');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8">Modifier l'événement</h1>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* NOM */}
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
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION */}
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
                  required
                />
              </div>
            </div>

            {/* IMAGE URL */}
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
            </div>

            {/* DATES */}
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
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
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
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            {/* LIEU */}
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
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  required
                >
                  <option value={0}>Sélectionner un lieu</option>
                  {lieux.map((lieu) => (
                    <option key={lieu.id} value={lieu.id}>
                      {lieu.nom} - {lieu.ville} ({lieu.capaciteMax} places)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* VILLE (ReadOnly) */}
            <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">Ville (auto-remplie)</label>
               <input
                 type="text"
                 name="ville"
                 value={formData.ville}
                 readOnly
                 className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 focus:outline-none cursor-not-allowed"
               />
            </div>

            {/* PRIX */}
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="payant"
                  name="payant"
                  checked={formData.payant}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
                />
                <label htmlFor="payant" className="ml-3 text-sm font-medium text-gray-300 cursor-pointer">
                  Cet événement est payant
                </label>
              </div>

              {formData.payant && (
                <div className="animate-fade-in-down">
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
                      required={formData.payant}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* BOUTONS */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
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

export default EditEvent;