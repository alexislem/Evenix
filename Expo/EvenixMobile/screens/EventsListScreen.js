// screens/EventsListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getEvenements } from '../services/api';

export default function EventsListScreen({ navigation }) {
  // --- ÉTATS ---
  const [evenements, setEvenements] = useState([]);   // La liste des événements
  const [loading, setLoading] = useState(true);        // Indicateur de chargement
  const [erreur, setErreur] = useState(null);          // Message d'erreur éventuel

  // --- CHARGEMENT AU DÉMARRAGE ---
  useEffect(() => {
    chargerEvenements();
  }, []);

  // --- FONCTION DE CHARGEMENT ---
  const chargerEvenements = async () => {
    try {
      setLoading(true);
      setErreur(null);

      // 1. Appel à l'API
      const data = await getEvenements();

      // 2. Stocker les événements dans le state
      setEvenements(data);

      console.log(`${data.length} événement(s) chargé(s)`);

    } catch (error) {
      console.error('Erreur chargement événements:', error.message);
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- AFFICHAGE D'UN ÉVÉNEMENT (dans la FlatList) ---
  const renderEvenement = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.carte}
        onPress={() => {
          // Navigation vers le détail avec l'id de l'événement
          navigation.navigate('EventDetail', { eventId: item.id });
        }}
      >
        {/* Titre */}
        <Text style={styles.carteTitre}>{item.nom}</Text>

        {/* Date */}
        {item.dateDebut && (
          <Text style={styles.carteDate}>
            {new Date(item.dateDebut).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}

        {/* Lieu */}
        {item.lieu && item.lieu.nom && (
          <Text style={styles.carteLieu}>{item.lieu.nom}</Text>
        )}

        {/* Type */}
        {item.typeEvenement && item.typeEvenement.nom && (
          <Text style={styles.carteType}>{item.typeEvenement.nom}</Text>
        )}
      </TouchableOpacity>
    );
  };

  // --- AFFICHAGE PRINCIPAL ---

  // Cas 1 : Chargement en cours
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingTexte}>Chargement des événements...</Text>
      </View>
    );
  }

  // Cas 2 : Erreur
  if (erreur) {
    return (
      <View style={styles.center}>
        <Text style={styles.erreurTexte}>Erreur : {erreur}</Text>
        <TouchableOpacity style={styles.boutonReessayer} onPress={chargerEvenements}>
          <Text style={styles.boutonReessayerTexte}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Cas 3 : Liste vide
  if (evenements.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.videTexte}>Aucun événement disponible</Text>
      </View>
    );
  }

  // Cas 4 : Affichage normal de la liste
  return (
    <View style={styles.container}>
      <FlatList
        data={evenements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEvenement}
        contentContainerStyle={styles.liste}
      />
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  liste: {
    padding: 15,
  },
  carte: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  carteTitre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  carteDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  carteLieu: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 3,
  },
  carteType: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  loadingTexte: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  erreurTexte: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  boutonReessayer: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  boutonReessayerTexte: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videTexte: {
    fontSize: 16,
    color: '#999',
  },
});