import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Mail, Phone, Building, Map as MapIcon, Navigation, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Utilisateur } from '../types';

// REMPLACEZ CECI PAR VOTRE VRAIE CLÉ API
const GOOGLE_MAPS_API_KEY = "AIzaSyDjS8znkaMw0N1JM3YXT7QrcsxPkHLwS9I";

declare global {
  interface Window {
    google: any;
  }
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<Utilisateur | null>(user);
  
  // États pour la carte
  const mapRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // 1. Chargement des données fraîches utilisateur
  useEffect(() => {
    const fetchFreshData = async () => {
      if (user?.id) {
        try {
          const response = await api.get<Utilisateur>(`/api/utilisateur/${user.id}`);
          setUserData(response.data);
        } catch (error) {
          console.error("Erreur dashboard", error);
        }
      }
    };
    fetchFreshData();
  }, [user?.id]);

  // 2. Chargement du script Google Maps
  useEffect(() => {
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }
    if (document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
        setScriptLoaded(true);
        return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 3. Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 48.8566, lng: 2.3522 }); // Paris par défaut
        }
      );
    } else {
      setUserLocation({ lat: 48.8566, lng: 2.3522 });
    }
  }, []);

  // 4. Initialisation de la carte
  useEffect(() => {
    if (scriptLoaded && userLocation && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        disableDefaultUI: true,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "poi.business", stylers: [{ visibility: "off" }] },
            { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
        ],
      });

      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Vous êtes ici",
        icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
        }
      });

      const service = new window.google.maps.places.PlacesService(map);
      
      const request = {
        location: userLocation,
        radius: 5000, 
        type: 'tourist_attraction', 
        keyword: 'museum OR art gallery OR culture' 
      };

      service.nearbySearch(request, (results: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            results.forEach((place) => {
              const marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png" 
              });

              const infowindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="color: black; padding: 5px; max-width: 200px;">
                    <strong style="font-size: 14px;">${place.name}</strong><br/>
                    <span style="font-size: 12px; color: #666;">${place.vicinity}</span><br/>
                    <div style="margin-top: 5px;">
                        <span style="background: purple; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Culture</span>
                    </div>
                  </div>
                `,
              });

              marker.addListener("click", () => {
                infowindow.open(map, marker);
              });
            });
          }
        }
      );
    }
  }, [scriptLoaded, userLocation]);

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tableau de bord</h1>
          <p className="text-gray-400">
            Bienvenue, {userData?.prenom} {userData?.nom}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* --- CARTE "MES ÉVÉNEMENTS" DEVENUE CLIQUABLE --- */}
          <Link to="/mes-inscriptions" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white hover:scale-105 transition transform shadow-lg group">
            <div className="flex justify-between items-start">
                <Calendar className="w-10 h-10 mb-4" />
                <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Mes Inscriptions</h3>
            <p className="text-blue-100">Voir mes événements à venir et mon historique</p>
          </Link>
          {/* ---------------------------------------------- */}

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <User className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Mon Profil</h3>
            <Link to="/profil" className="text-green-100 hover:underline">
              Modifier mes informations
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <Calendar className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Explorer</h3>
            <Link to="/evenements" className="text-purple-100 hover:underline">
              Découvrir les événements
            </Link>
          </div>
        </div>

        {/* --- SECTION INFO & MAP --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1 bg-gray-800 rounded-xl p-8 border border-gray-700 h-fit">
            <h2 className="text-2xl font-bold text-white mb-6">Mes Informations</h2>
            <div className="space-y-6">
                <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-blue-400" />
                    <div>
                    <p className="text-gray-400 text-sm">Nom complet</p>
                    <p className="text-white font-medium">
                        {userData?.prenom} {userData?.nom}
                    </p>
                    </div>
                </div>

                <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-green-400" />
                    <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{userData?.email}</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-yellow-400" />
                    <div>
                    <p className="text-gray-400 text-sm">Téléphone</p>
                    <p className="text-white font-medium">{userData?.telephone || 'Non renseigné'}</p>
                    </div>
                </div>

                {userData?.entreprise && (
                    <div className="flex items-center">
                        <Building className="w-5 h-5 mr-3 text-purple-400" />
                        <div>
                        <p className="text-gray-400 text-sm">Entreprise</p>
                        <p className="text-white font-medium">{userData.entreprise.nom}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                        <p className="text-gray-400 text-sm">Rôle</p>
                        {userData?.role && (
                        <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full inline-block mt-1">
                            {userData.role.nom}
                        </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
                <Link
                to="/profil"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                Modifier mon profil
                </Link>
            </div>
            </div>

            <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <MapIcon className="w-6 h-6 mr-2 text-purple-400" />
                            Culture à proximité
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Musées, galeries et lieux touristiques autour de vous</p>
                    </div>
                    {userLocation && (
                        <div className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full flex items-center">
                            <Navigation className="w-3 h-3 mr-1" />
                            Localisé
                        </div>
                    )}
                </div>
                
                <div className="relative flex-1 min-h-[500px] w-full bg-gray-900">
                    {!scriptLoaded ? (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            Chargement de Google Maps...
                        </div>
                    ) : (
                        <div ref={mapRef} className="w-full h-full" />
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;