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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEvenements } from '../services/api';

export default function EventsListScreen({ navigation }) {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    chargerEvenements();
  }, []);

  const chargerEvenements = async () => {
    try {
      setLoading(true);
      setErreur(null);

      const data = await getEvenements();
      setEvenements(data);

      console.log(`${data.length} événement(s) chargé(s)`);
    } catch (error) {
      console.error('Erreur chargement événements:', error.message);
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const renderEvenement = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.carte}
        onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
      >
        <Text style={styles.carteTitre}>{item.nom || item.titre}</Text>

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

        {item.lieu && item.lieu.nom && (
          <Text style={styles.carteLieu}>{item.lieu.nom}</Text>
        )}

        {item.typeEvenement && item.typeEvenement.nom && (
          <Text style={styles.carteType}>{item.typeEvenement.nom}</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingTexte}>Chargement des événements...</Text>
      </View>
    );
  }

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

  if (evenements.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.videTexte}>Aucun événement disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MesReservations')}
        >
          <Text style={styles.secondaryButtonText}>Mes réservations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>

        <TouchableOpacity
  onPress={() => navigation.navigate('Profile')}
>
  <Text>Profil</Text>
</TouchableOpacity>

      </View>

      <FlatList
        data={evenements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEvenement}
        contentContainerStyle={styles.liste}
      />
    </View>
  );
}

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
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
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
  secondaryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 6,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
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