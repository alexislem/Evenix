import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, CheckCircle, Clock, Filter, ArrowUpDown } from 'lucide-react';
import { evenementService } from '../services/evenementService';
import { inscriptionService } from '../services/inscriptionService';
import { typeEvenementService } from '../services/typeEvenementService';
import { useAuth } from '../context/AuthContext';
import { Evenement, TypeEvenement } from '../types';

// Types pour les options de tri
type SortOption = 'date' | 'places_asc' | 'places_desc' | 'proximity' | 'prix_asc';

const EventsList: React.FC = () => {
  const { user } = useAuth();

  // Données
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [types, setTypes] = useState<TypeEvenement[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

  // États de chargement et erreur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtres et Recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('date');

  // ✅ Nouveau : filtre par intervalle de dates (sur dateDebut)
  const [dateStart, setDateStart] = useState<string>(''); // format input: YYYY-MM-DD
  const [dateEnd, setDateEnd] = useState<string>('');     // format input: YYYY-MM-DD

  // Géolocalisation utilisateur
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadData();
    // On demande la position dès le chargement pour activer le tri par proximité
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => console.warn("Géolocalisation refusée ou impossible", err)
      );
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Chargement parallèle des événements et des types
      const [eventsData, typesData] = await Promise.all([
        evenementService.getAll(),
        typeEvenementService.getAll()
      ]);

      setEvenements(eventsData);
      setTypes(typesData);

      if (user) {
        try {
          const inscriptions = await inscriptionService.getByUser(user.id);
          if (Array.isArray(inscriptions)) {
            const ids = inscriptions
              .filter(ins => ins.evenement && !ins.dateAnnulation)
              .map(ins => ins.evenement.id);
            setRegisteredEventIds(ids);
          }
        } catch (err) {
          console.error("Erreur chargement inscriptions", err);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE DE TRI ET FILTRAGE ---

  // Formule de Haversine pour calculer la distance en km entre deux points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getEventLocation = (event: Evenement) => {
    if (event.lieu?.ville) return event.lieu.ville;
    if (event.lieu?.adresse) return event.lieu.adresse.split(',').pop()?.trim();
    return 'Lieu à définir';
  };

  // ✅ Helpers pour le filtre date (on compare sur dateDebut)
  const toStartOfDay = (yyyyMmDd: string) => new Date(`${yyyyMmDd}T00:00:00`);
  const toEndOfDay = (yyyyMmDd: string) => new Date(`${yyyyMmDd}T23:59:59`);

  const processedEvents = evenements
    // 1. Filtrage (Recherche + Type + Dates)
    .filter((event) => {
      const matchesSearch =
        (event.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        getEventLocation(event).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'all' || event.types?.some(t => t.id === selectedType);

      // ✅ Filtre entre 2 dates (sur dateDebut)
      const eventStartDate = new Date(event.dateDebut);
      const matchesDateRange = (() => {
        if (!dateStart && !dateEnd) return true;

        if (dateStart) {
          const start = toStartOfDay(dateStart);
          if (eventStartDate < start) return false;
        }
        if (dateEnd) {
          const end = toEndOfDay(dateEnd);
          if (eventStartDate > end) return false;
        }
        return true;
      })();

      return matchesSearch && matchesType && matchesDateRange;
    })
    // 2. Tri
    .sort((a, b) => {
      switch (sortOption) {
        case 'date':
          return new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime();

        case 'places_asc':
          return (a.lieu?.capaciteMax || 0) - (b.lieu?.capaciteMax || 0);

        case 'places_desc':
          return (b.lieu?.capaciteMax || 0) - (a.lieu?.capaciteMax || 0);

        case 'prix_asc':
          return a.prix - b.prix;

        case 'proximity':
          if (!userLocation) return 0; // Si pas de loc, on ne bouge pas l'ordre
          // On récupère les coords du lieu A et B
          const latA = a.lieu?.latitude;
          const lngA = a.lieu?.longitude;
          const latB = b.lieu?.latitude;
          const lngB = b.lieu?.longitude;

          // Si un lieu n'a pas de coordonnées, on le met à la fin
          if (!latA || !lngA) return 1;
          if (!latB || !lngB) return -1;

          const distA = calculateDistance(userLocation.lat, userLocation.lng, latA, lngA);
          const distB = calculateDistance(userLocation.lat, userLocation.lng, latB, lngB);

          return distA - distB;

        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSortOption('date');
    setDateStart('');
    setDateEnd('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Chargement des événements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4">

        {/* EN-TÊTE */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tous nos événements
          </h1>
          <p className="text-gray-400 text-lg">
            Découvrez les événements à venir et réservez votre place
          </p>
        </div>

        {/* BARRE DE FILTRES ET RECHERCHE */}
        <div className="mb-8 bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">

          {/* Recherche */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher (nom, ville...)"
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

            {/* ✅ Filtre Dates (entre deux dates) */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                  aria-label="Date de début"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                  aria-label="Date de fin"
                />
              </div>
            </div>

            {/* Sélecteur de Type */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer w-full sm:w-auto"
              >
                <option value="all">Tous les types</option>
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>
            </div>

            {/* Sélecteur de Tri */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer w-full sm:w-auto"
              >
                <option value="date">Date (Prochainement)</option>
                <option value="prix_asc">Prix (Croissant)</option>
                <option value="places_desc">Places (Décroissant)</option>
                <option value="places_asc">Places (Croissant)</option>
                <option value="proximity" disabled={!userLocation}>
                  {userLocation ? 'Proximité (GPS)' : 'Proximité (GPS introuvable)'}
                </option>
              </select>
            </div>

            {/* ✅ Reset rapide */}
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white hover:border-blue-500 hover:text-blue-200 transition w-full sm:w-auto"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* LISTE DES RÉSULTATS */}
        {processedEvents.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">Aucun événement ne correspond à vos critères</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedEvents.map((event) => {
              const isInscrit = registeredEventIds.includes(event.id);

              // Calcul de la distance pour l'affichage (optionnel)
              let distanceStr = null;
              if (userLocation && event.lieu?.latitude && event.lieu?.longitude) {
                const dist = calculateDistance(userLocation.lat, userLocation.lng, event.lieu.latitude, event.lieu.longitude);
                distanceStr = dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
              }

              return (
                <Link
                  key={event.id}
                  to={`/evenements/${event.id}`}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105 relative group flex flex-col"
                >
                  {/* BADGE INSCRIT */}
                  {isInscrit && (
                    <div className="absolute top-3 right-3 z-10 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Inscrit
                    </div>
                  )}

                  {/* IMAGE */}
                  {event.imageUrl ? (
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.nom}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-white" />
                    </div>
                  )}

                  {/* CONTENU */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white line-clamp-2">{event.nom}</h3>
                    </div>

                    {/* BADGES TYPES */}
                    {event.types && event.types.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.types.map(t => (
                          <span key={t.id} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                            {t.nom}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm flex-1">{event.description}</p>

                    <div className="space-y-2 text-sm mt-auto">
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{formatDate(event.dateDebut)}</span>
                      </div>

                      <div className="flex items-center justify-between text-gray-300">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-green-400" />
                          <span>{getEventLocation(event)}</span>
                        </div>
                        {distanceStr && (
                          <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                            {distanceStr}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                        <div className="flex items-center text-gray-300">
                          <Users className="w-4 h-4 mr-2 text-yellow-400" />
                          <span>{event.lieu?.capaciteMax || 0} places</span>
                        </div>
                        <span className={`font-bold ${event.prix > 0 ? 'text-green-400' : 'text-blue-400'}`}>
                          {event.prix > 0 ? `${event.prix} €` : 'Gratuit'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
