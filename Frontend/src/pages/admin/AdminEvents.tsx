import React, { useEffect, useState } from 'react';
import { Calendar, Trash2, MapPin, Euro, Users, Edit2, Check, X } from 'lucide-react';
import { evenementService } from '../../services/evenementService';
import { lieuService } from '../../services/lieuService';
import { Evenement, Lieu} from '../../types';

// Interface pour le formulaire d'édition
interface EditFormData {
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  prix: number;
  lieuId: number; // On stocke l'ID du lieu sélectionné
  utilisateurId: number;
}

const AdminEvents: React.FC = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ÉTATS D'ÉDITION ---
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({} as EditFormData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // On charge les événements ET les lieux pour le sélecteur
      const [eventsData, lieuxData] = await Promise.all([
        evenementService.getAll(),
        lieuService.getAll()
      ]);
      setEvenements(eventsData);
      setLieux(lieuxData);
    } catch (err) {
      console.error('Erreur lors du chargement des données', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nom: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${nom}" ?`)) { return; }
    try {
      await evenementService.delete(id);
      setEvenements(evenements.filter((e) => e.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };
  
  // --- FONCTIONS D'ÉDITION ---

  const handleEditClick = (event: Evenement) => {
    setEditingEventId(event.id);
    
    // Helper pour formater la date pour l'input datetime-local (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().slice(0, 16);
    };

    setEditFormData({
      nom: event.nom,
      description: event.description,
      dateDebut: formatDateForInput(event.dateDebut),
      dateFin: formatDateForInput(event.dateFin),
      prix: event.prix,
      lieuId: event.lieu?.id || 0,
      utilisateurId: event.utilisateur?.id || 0
    });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'prix' || name === 'lieuId' ? Number(value) : value,
    }));
  };

  const handleSave = async (eventId: number) => {
    try {
        // 1. Retrouver le lieu complet
        const selectedLieu = lieux.find(l => l.id === editFormData.lieuId);
        if (!selectedLieu) {
            alert("Veuillez sélectionner un lieu valide");
            return;
        }

        // 2. Construction du payload
        // Note: On utilise 'any' ou un type partiel pour coller au CreateEventRequest du backend
        const payload: any = {
            id: eventId, // ID requis pour l'update
            nom: editFormData.nom,
            description: editFormData.description,
            dateDebut: new Date(editFormData.dateDebut).toISOString(),
            dateFin: new Date(editFormData.dateFin).toISOString(),
            prix: editFormData.prix,
            
            // Backend : il faut envoyer l'objet Lieu complet
            lieu: selectedLieu, 
            ville: selectedLieu.ville, // On met à jour la ville pour l'affichage
            
            utilisateur: { id: editFormData.utilisateurId }
        };
        
        const updatedEvent = await evenementService.update(eventId, payload);

        setEvenements(evenements.map((e) =>
          e.id === eventId ? updatedEvent : e
        ));
        
        setEditingEventId(null);

    } catch (err) {
        console.error("Erreur de sauvegarde:", err);
        alert('Erreur lors de la modification de l\'événement');
    }
  };
  
  // --- FILTRAGE ET FORMATTAGE ---

  const getEventLocation = (event: Evenement) => {
    if (event.lieu?.ville) return event.lieu.ville;
    return '';
  };

  const filteredEvenements = evenements.filter(
    (event) =>
        event.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getEventLocation(event).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.utilisateur?.nom || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

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
                <h1 className="text-4xl font-bold text-white mb-2">Gestion des événements</h1>
                <p className="text-gray-400">Administrez tous les événements de la plateforme</p>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un événement (nom, ville, organisateur)..."
                    className="w-full md:w-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {filteredEvenements.length === 0 ? (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-xl">Aucun événement trouvé</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredEvenements.map((event) => {
                        const isEditing = editingEventId === event.id;

                        return (
                            <div
                                key={event.id}
                                className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-purple-500 transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        
                                        {/* --- NOM ET DESCRIPTION --- */}
                                        {isEditing ? (
                                            <div className='mb-4 space-y-2'>
                                                <input
                                                    name="nom"
                                                    value={editFormData.nom}
                                                    onChange={handleInputChange}
                                                    className="text-xl font-bold text-white bg-gray-700 border border-gray-600 rounded p-2 w-full"
                                                    placeholder="Nom de l'événement"
                                                />
                                                <textarea
                                                    name="description"
                                                    value={editFormData.description}
                                                    onChange={handleInputChange}
                                                    className="text-gray-300 bg-gray-700 border border-gray-600 rounded p-2 w-full h-20"
                                                    placeholder="Description"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-2xl font-bold text-white mb-2">{event.nom}</h3>
                                                <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                                            </>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                            
                                            {/* --- DATES --- */}
                                            <div className="col-span-1">
                                                <p className="text-gray-500 text-xs uppercase mb-1">Dates</p>
                                                {isEditing ? (
                                                    <div className='flex flex-col gap-2'>
                                                        <input
                                                            type="datetime-local"
                                                            name="dateDebut"
                                                            value={editFormData.dateDebut}
                                                            onChange={handleInputChange}
                                                            className="text-white bg-gray-700 rounded text-sm p-1 [color-scheme:dark]"
                                                        />
                                                        <input
                                                            type="datetime-local"
                                                            name="dateFin"
                                                            value={editFormData.dateFin}
                                                            onChange={handleInputChange}
                                                            className="text-white bg-gray-700 rounded text-sm p-1 [color-scheme:dark]"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-white text-sm">
                                                        <p>{formatDate(event.dateDebut)}</p>
                                                        <p className="text-gray-500">au {formatDate(event.dateFin)}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* --- LIEU --- */}
                                            <div className="col-span-1">
                                                <p className="text-gray-500 text-xs uppercase mb-1">Lieu</p>
                                                {isEditing ? (
                                                    <select
                                                        name="lieuId"
                                                        value={editFormData.lieuId}
                                                        onChange={handleInputChange}
                                                        className="text-white bg-gray-700 rounded text-sm p-2 w-full"
                                                    >
                                                        <option value={0}>Choisir un lieu</option>
                                                        {lieux.map(l => (
                                                            <option key={l.id} value={l.id}>
                                                                {l.nom} - {l.ville} ({l.capaciteMax}p)
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{event.lieu?.nom}</p>
                                                        <div className="flex items-center text-gray-400 text-xs">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {event.lieu?.ville}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* --- PRIX / CAPACITÉ --- */}
                                            <div className="col-span-1">
                                                <p className="text-gray-500 text-xs uppercase mb-1">Infos</p>
                                                {isEditing ? (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="number"
                                                            name="prix"
                                                            value={editFormData.prix}
                                                            onChange={handleInputChange}
                                                            className="text-green-400 bg-gray-700 border border-gray-600 rounded font-semibold p-1 w-20 mr-2"
                                                        />
                                                        <span className="text-green-400">€</span>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-green-400 font-semibold flex items-center text-sm">
                                                            <Euro className="w-3 h-3 mr-1" />
                                                            {event.prix > 0 ? `${event.prix} €` : 'Gratuit'}
                                                        </p>
                                                        <p className="text-gray-400 flex items-center text-xs mt-1">
                                                            <Users className="w-3 h-3 mr-1" />
                                                            {event.lieu?.capaciteMax} places
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* --- ORGANISATEUR --- */}
                                        <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs">Organisateur</p>
                                                <p className="text-white text-sm">
                                                    {event.utilisateur?.prenom} {event.utilisateur?.nom}
                                                    <span className="text-gray-500 ml-2">({event.utilisateur?.email})</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- ACTIONS --- */}
                                    <div className="flex flex-col gap-2 ml-4">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => handleSave(event.id)}
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
                                                    onClick={() => handleEditClick(event)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id, event.nom)}
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
                Total: {filteredEvenements.length} événement(s)
            </div>
        </div>
    </div>
  );
};

export default AdminEvents;