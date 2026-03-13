// screens/MesReservationsScreen.js
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
import {
  getEvenements,
  getInscriptionsByUser,
  desinscrireEvenement,
} from '../services/api';

export default function MesReservationsScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    chargerReservations();
  }, []);

  const utilisateurEstInscrit = (eventData, userId) => {
    if (!eventData || !userId) return false;

    if (Array.isArray(eventData.inscriptions)) {
      return eventData.inscriptions.some((inscription) => {
        const idUtilisateur =
          inscription?.utilisateur?.id ??
          inscription?.user?.id ??
          inscription?.userId;

        return String(idUtilisateur) === String(userId);
      });
    }

    if (Array.isArray(eventData.participants)) {
      return eventData.participants.some((participant) => {
        const idParticipant = participant?.id ?? participant?.userId;
        return String(idParticipant) === String(userId);
      });
    }

    return false;
  };

  const chargerReservations = async () => {
    try {
      setLoading(true);
      setErreur(null);

      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        setErreur('Utilisateur non connecté');
        return;
      }

      const evenements = await getEvenements();

      const mesEvenements = evenements.filter((eventItem) =>
        utilisateurEstInscrit(eventItem, userId)
      );

      setReservations(mesEvenements);
      console.log('Mes réservations :', mesEvenements.length);
    } catch (error) {
      console.error('Erreur chargement réservations :', error.message);
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmerDesinscription = (eventId, nomEvenement) => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous vous désinscrire de "${nomEvenement}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: () => handleDesinscription(eventId),
        },
      ]
    );
  };

  const handleDesinscription = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Erreur', 'Session introuvable. Veuillez vous reconnecter.');
        navigation.replace('Login');
        return;
      }

      const inscriptions = await getInscriptionsByUser(token, userId);

      const inscription = inscriptions.find((item) => {
        const idEvenement =
          item?.evenementId ??
          item?.evenement?.id ??
          item?.eventId;

        return String(idEvenement) === String(eventId);
      });

      if (!inscription || !inscription.id) {
        Alert.alert('Erreur', 'Inscription introuvable pour cet événement.');
        return;
      }

      await desinscrireEvenement(token, inscription.id);

      Alert.alert('Succès', 'Vous êtes désinscrit de cet événement.');
      await chargerReservations();
    } catch (error) {
      console.error('Erreur désinscription :', error.message);
      Alert.alert('Erreur', error.message || 'Impossible de se désinscrire');
    }
  };

  const renderReservation = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.carte}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
      >
        <Text style={styles.titre}>{item.nom || item.titre}</Text>

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

        {item.lieu?.nom && (
          <Text style={styles.lieu}>{item.lieu.nom}</Text>
        )}

        {item.typeEvenement?.nom && (
          <Text style={styles.type}>{item.typeEvenement.nom}</Text>
        )}

        <TouchableOpacity
          style={styles.desinscrireButton}
          onPress={() =>
            confirmerDesinscription(
              item.id,
              item.nom || item.titre || 'cet événement'
            )
          }
        >
          <Text style={styles.desinscrireText}>Se désinscrire</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.infoText}>Chargement de vos réservations...</Text>
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erreur : {erreur}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={chargerReservations}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (reservations.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Aucune réservation</Text>
        <Text style={styles.emptyText}>
          Vous n’êtes inscrit à aucun événement pour le moment.
        </Text>

        <TouchableOpacity
          style={styles.goEventsButton}
          onPress={() => navigation.navigate('EventsList')}
        >
          <Text style={styles.goEventsButtonText}>Voir les événements</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservation}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  carte: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  titre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  date: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  lieu: {
    fontSize: 15,
    color: '#4CAF50',
    marginBottom: 4,
  },
  type: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  desinscrireButton: {
    marginTop: 10,
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  desinscrireText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  goEventsButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  goEventsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});