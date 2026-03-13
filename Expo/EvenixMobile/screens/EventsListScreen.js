import React, { useEffect, useState } from 'react';
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

      console.log(data.length + ' événement(s) chargé(s)');
    } catch (error) {
      console.error('Erreur chargement événements :', error);
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
        onPress={() =>
          navigation.navigate('EventDetail', { eventId: item.id })
        }
      >
        <Text style={styles.titre}>{item.nom}</Text>

        {item.dateDebut && (
          <Text style={styles.date}>
            {new Date(item.dateDebut).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}

        {item.lieu && (
          <Text style={styles.lieu}>{item.lieu.nom}</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Chargement des événements...</Text>
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{erreur}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Boutons du haut */}
      <View style={styles.topActions}>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MesReservations')}
        >
          <Text style={styles.secondaryButtonText}>
            Mes réservations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            Déconnexion
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonText}>
            Profil
          </Text>
        </TouchableOpacity>

      </View>

      <FlatList
        data={evenements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEvenement}
        contentContainerStyle={styles.list}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  topActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 5,
  },

  secondaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  logoutButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },

  logoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  profileButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 5,
  },

  profileButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  list: {
    padding: 15,
  },

  carte: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  titre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  date: {
    color: '#666',
    marginTop: 4,
  },

  lieu: {
    color: '#4CAF50',
    marginTop: 4,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});