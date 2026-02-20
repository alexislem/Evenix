import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Euro, FileText, Save, Image, AlertCircle, Users, Search } from 'lucide-react';
import { evenementService } from '../../services/evenementService';
import { useAuth } from '../../context/AuthContext';
import { CreateEventRequest, Lieu } from '../../types';

// REMPLACEZ CECI PAR VOTRE VRAIE CLÉ API
const GOOGLE_MAPS_API_KEY = "AIzaSyDjS8znkaMw0N1JM3YXT7QrcsxPkHLwS9I";

declare global {
  interface Window {
    google: any;
  }
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Référence pour l'input d'adresse Google
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // État pour stocker le lieu sélectionné via Google
  const [selectedLieu, setSelectedLieu] = useState<Partial<Lieu> | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    payant: false,
    prix: 0,
    imageUrl: '',
    // Champs spécifiques au lieu
    lieuNom: '',
    lieuAdresse: '',
    lieuVille: '',
    lieuCapacite: 100, // Valeur par défaut
  });

  // 1. Chargement du script Google Maps
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Nettoyage éventuel
    };
  }, []);

  // 2. Initialisation de l'Autocomplete
  useEffect(() => {
    if (scriptLoaded && autocompleteInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
        types: ["establishment", "geocode"], // Établissements ou adresses
        fields: ["place_id", "geometry", "name", "formatted_address", "address_components", "types"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        handlePlaceSelect(place);
      });
    }
  }, [scriptLoaded]);

  // 3. Traitement des données Google Places
  const handlePlaceSelect = (place: any) => {
    if (!place.geometry || !place.geometry.location) {
      console.error("Lieu sans géométrie");
      return;
    }

    // Extraction de la ville et code postal
    let ville = "";
    let codePostal = "";
    
    if (place.address_components) {
      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes("locality")) {
          ville = component.long_name;
        } else if (types.includes("administrative_area_level_1") && !ville) {
            // Fallback si pas de "locality"
            ville = component.long_name;
        }
        if (types.includes("postal_code")) {
          codePostal = component.long_name;
        }
      }
    }

    // Construction de l'objet Lieu temporaire
    const newLieu: Partial<Lieu> = {
      nom: place.name,
      adresse: place.formatted_address,
      ville: ville,
      codePostal: codePostal,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      googlePlaceId: place.place_id,
      typeLieu: place.types ? place.types[0] : "point_of_interest",
      capaciteMax: formData.lieuCapacite // On prend la capacité saisie
    };

    setSelectedLieu(newLieu);

    // Mise à jour de l'affichage
    setFormData(prev => ({
      ...prev,
      lieuNom: place.name || "",
      lieuAdresse: place.formatted_address || "",
      lieuVille: ville
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Si on change la capacité manuellement, on met à jour l'objet lieu sélectionné
    if (name === 'lieuCapacite' && selectedLieu) {
        setSelectedLieu(prev => prev ? ({ ...prev, capaciteMax: Number(value) }) : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
        setError("Vous devez être connecté.");
        setLoading(false);
        return;
    }

    if (!selectedLieu) {
        setError("Veuillez sélectionner un lieu via la recherche Google Maps.");
        setLoading(false);
        return;
    }

    try {
      // On s'assure que la capacité est à jour
      const lieuFinal = {
          ...selectedLieu,
          capaciteMax: Number(formData.lieuCapacite)
      };

      const payload: CreateEventRequest = {
        nom: formData.nom,
        description: formData.description,
        dateDebut: new Date(formData.dateDebut).toISOString(),
        dateFin: new Date(formData.dateFin).toISOString(),
        prix: formData.payant ? Number(formData.prix) : 0,
        ville: formData.lieuVille, // On utilise la ville extraite de Google
        imageUrl: formData.imageUrl,
        
        // On envoie l'objet Lieu COMPLET généré par Google Maps
        // Le backend va vérifier le googlePlaceId : s'il existe, il l'utilise, sinon il le crée.
        lieu: lieuFinal,
        
        types: []
      };

      await evenementService.create(payload, user.id);
      navigate('/organisateur/evenements');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la création");
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
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* NOM */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom de l'événement</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Conférence Tech 2025"
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* --- SECTION LIEU (GOOGLE MAPS) --- */}
            <div className="bg-gray-750/30 p-4 rounded-xl border border-gray-700/50 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                    Localisation
                </h3>
                
                {/* Recherche Google */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rechercher un lieu (Google Maps)</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            ref={autocompleteInputRef}
                            type="text"
                            placeholder="Tapez une adresse ou un nom de lieu..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!scriptLoaded}
                        />
                    </div>
                    {!scriptLoaded && <p className="text-xs text-yellow-500 mt-1">Chargement de Google Maps...</p>}
                </div>

                {/* Affichage des détails récupérés */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nom du lieu</label>
                        <input
                            type="text"
                            value={formData.lieuNom}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Ville</label>
                        <input
                            type="text"
                            value={formData.lieuVille}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 cursor-not-allowed"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Adresse complète</label>
                        <input
                            type="text"
                            value={formData.lieuAdresse}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 cursor-not-allowed"
                        />
                    </div>
                    {/* Capacité (Manuelle car Google ne l'a pas) */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Capacité max (places) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="number"
                                name="lieuCapacite"
                                value={formData.lieuCapacite}
                                onChange={handleChange}
                                min="1"
                                className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date de début</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Date de fin</label>
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

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL de l'image</label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
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
                  className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-700 rounded"
                />
                <label htmlFor="payant" className="ml-3 text-sm font-medium text-gray-300 cursor-pointer">
                  Cet événement est payant
                </label>
              </div>

              {formData.payant && (
                <div className="animate-fade-in-down">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prix (€)</label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center disabled:opacity-50 shadow-lg shadow-green-900/20"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Création en cours...' : 'Créer l\'événement'}
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