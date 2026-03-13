// screens/EventDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEvenementById, participerEvenement } from '../services/api';

export default function EventDetailScreen({ route, navigation }) {
  const { eventId } = route.params;

  const [evenement, setEvenement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [participation, setParticipation] = useState(false);
  const [loadingParticipation, setLoadingParticipation] = useState(false);

  useEffect(() => {
    chargerEvenement();
  }, [eventId]);

  const verifierSiDejaInscrit = async (eventData) => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId || !eventData) {
        setParticipation(false);
        return;
      }

      let dejaInscrit = false;

      // Cas 1 : le backend renvoie une liste d'inscriptions
      if (Array.isArray(eventData.inscriptions)) {
        dejaInscrit = eventData.inscriptions.some((inscription) => {
          const idUtilisateur =
            inscription?.utilisateur?.id ??
            inscription?.user?.id ??
            inscription?.userId;

          return String(idUtilisateur) === String(userId);
        });
      }

      // Cas 2 : le backend renvoie une liste de participants
      else if (Array.isArray(eventData.participants)) {
        dejaInscrit = eventData.participants.some((participant) => {
          const idParticipant = participant?.id ?? participant?.userId;
          return String(idParticipant) === String(userId);
        });
      }

      setParticipation(dejaInscrit);

      console.log('Participation détectée au chargement :', dejaInscrit);
    } catch (error) {
      console.log('Erreur vérification inscription :', error);
      setParticipation(false);
    }
  };

  const chargerEvenement = async () => {
    try {
      setLoading(true);
      setErreur(null);

      const data = await getEvenementById(eventId);

      console.log('Objet événement complet :', JSON.stringify(data, null, 2));
      console.log('inscriptions =', data?.inscriptions);
      console.log('participants =', data?.participants);

      setEvenement(data);
      navigation.setOptions({
        title: data.nom || data.titre || 'Détail événement',
      });

      await verifierSiDejaInscrit(data);

      console.log('Événement chargé :', data.nom || data.titre);
    } catch (error) {
      console.error('Erreur chargement détail :', error.message);
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParticiper = async () => {
    try {
      setLoadingParticipation(true);

      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert(
          'Session expirée',
          'Veuillez vous reconnecter.',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
        return;
      }

      await participerEvenement(token, userId, eventId);

      setParticipation(true);
      Alert.alert('Inscription confirmée', 'Vous êtes inscrit à cet événement !');
    } catch (error) {
  console.error('Erreur participation:', error.message);

  if (error.message === 'SESSION_EXPIREE') {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');

    Alert.alert(
      'Session expirée',
      'Votre session a expiré. Veuillez vous reconnecter.',
      [{ text: 'OK', onPress: () => navigation.replace('Login') }]
    );
    return;
  }

  if (
    error.message?.toLowerCase().includes('déjà inscrit') ||
    error.message?.toLowerCase().includes('deja inscrit')
  ) {
    setParticipation(true);
    return;
  }

  Alert.alert('Erreur', error.message);
} finally {
  setLoadingParticipation(false);
}
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingTexte}>Chargement de l'événement...</Text>
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={styles.center}>
        <Text style={styles.erreurTexte}>Erreur : {erreur}</Text>
        <TouchableOpacity style={styles.boutonReessayer} onPress={chargerEvenement}>
          <Text style={styles.boutonReessayerTexte}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!evenement) {
    return (
      <View style={styles.center}>
        <Text style={styles.erreurTexte}>Événement introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contenu}>
        <Text style={styles.titre}>{evenement.nom || evenement.titre}</Text>

        {evenement.typeEvenement && evenement.typeEvenement.nom && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>{evenement.typeEvenement.nom}</Text>
          </View>
        )}

        {evenement.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitre}>Description</Text>
            <Text style={styles.sectionTexte}>{evenement.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Date et heure</Text>

          {evenement.dateDebut && (
            <Text style={styles.sectionTexte}>
              Début :{' '}
              {new Date(evenement.dateDebut).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}

          {evenement.dateFin && (
            <Text style={styles.sectionTexte}>
              Fin :{' '}
              {new Date(evenement.dateFin).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>

        {evenement.lieu && (
          <View style={styles.section}>
            <Text style={styles.sectionTitre}>Lieu</Text>

            {evenement.lieu.nom && (
              <Text style={styles.sectionTexte}>{evenement.lieu.nom}</Text>
            )}

            {evenement.lieu.adresse && (
              <Text style={styles.sectionTexteSecondaire}>
                {evenement.lieu.adresse}
              </Text>
            )}

            {evenement.lieu.capaciteMax && (
              <Text style={styles.sectionTexteSecondaire}>
                Capacité max : {evenement.lieu.capaciteMax} personnes
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.boutonParticiper,
            participation && styles.boutonDesactive,
          ]}
          onPress={handleParticiper}
          disabled={participation || loadingParticipation}
        >
          {loadingParticipation ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.boutonParticiperTexte}>
              {participation ? 'Déjà inscrit' : 'Participer'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  contenu: {
    padding: 20,
  },
  titre: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  badgeTexte: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionTexte: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 4,
  },
  sectionTexteSecondaire: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  boutonParticiper: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  boutonParticiperTexte: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  boutonDesactive: {
    backgroundColor: '#9E9E9E',
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
});