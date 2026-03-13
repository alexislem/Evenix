import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUtilisateurById } from '../services/api';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerUtilisateur();
  }, []);

  const chargerUtilisateur = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        navigation.replace('Login');
        return;
      }

      const utilisateur = await getUtilisateurById(token, userId);
      console.log('Utilisateur profil =', utilisateur);
      setUser(utilisateur);
    } catch (error) {
      console.error('Erreur récupération utilisateur :', error);
      Alert.alert('Erreur', 'Impossible de récupérer le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Impossible de charger le profil</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profil utilisateur</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nom :</Text>
          <Text style={styles.value}>{user.nom || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Prénom :</Text>
          <Text style={styles.value}>{user.prenom || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{user.email || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Rôle :</Text>
          <Text style={styles.value}>
            {typeof user.role === 'object' ? user.role?.nom : user.role || '-'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
        <Text style={styles.profileButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },

  label: {
    fontWeight: 'bold',
    width: 80,
    color: '#222',
  },

  value: {
    color: '#555',
    flex: 1,
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  profileButton: {
  marginTop: 30,
  backgroundColor: '#4CAF50',
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: 'center',
  elevation: 2,
},

profileButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
}
});