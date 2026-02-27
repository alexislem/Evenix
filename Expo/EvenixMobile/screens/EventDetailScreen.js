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
  // --- RÉCUPÉRATION DU PARAMÈTRE ---
  const { eventId } = route.params;

  // --- ÉTATS ---
  const [evenement, setEvenement] = useState(null);  // L'événement chargé
  const [loading, setLoading] = useState(true);       // Indicateur de chargement
  const [erreur, setErreur] = useState(null);          // Message d'erreur
const [participation, setParticipation] = useState(false);  // true si déjà inscrit
    const [loadingParticipation, setLoadingParticipation] = useState(false); // chargement du bouton
  // --- CHARGEMENT AU DÉMARRAGE ---
  useEffect(() => {
    chargerEvenement();
  }, [eventId]);

  // --- FONCTION DE CHARGEMENT ---
  const chargerEvenement = async () => {
    try {
      setLoading(true);
      setErreur(null);

      // Appel à l'API avec l'ID
      const data = await getEvenementById(eventId);
      setEvenement(data);
      navigation.setOptions({ title: data.nom });

      console.log('Événement chargé:', data.nom);

    } catch (error) {
      console.error('Erreur chargement détail:', error.message);
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- FONCTION PARTICIPER ---
  const handleParticiper = async () => {
    try {
      setLoadingParticipation(true);

      // 1. Lire le token et le userId depuis AsyncStorage
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      // Vérification : token et userId doivent exister
      if (!token || !userId) {
        Alert.alert(
          'Session expirée',
          'Veuillez vous reconnecter.',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
        return;
      }

      // 2. Appel à l'API d'inscription
      const resultat = await participerEvenement(token, userId, eventId);

      // 3. Succès !
      setParticipation(true);
      Alert.alert('Inscription confirmée', 'Vous êtes inscrit à cet événement !');
      console.log('Inscription réussie:', resultat);

    } catch (error) {
      console.error('Erreur participation:', error.message);

      // Cas spécial : session expirée (code 401)
      if (error.message === 'SESSION_EXPIREE') {
        // On supprime le token invalide
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userId');
        Alert.alert(
          'Session expirée',
          'Votre session a expiré. Veuillez vous reconnecter.',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
        return;
      }

      // Autres erreurs (400, 404, réseau, etc.)
      Alert.alert('Erreur', error.message);

    } finally {
      setLoadingParticipation(false);
    }
  };

  // --- AFFICHAGE ---

  // Cas 1 : Chargement
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingTexte}>Chargement de l'événement...</Text>
      </View>
    );
  }

  // Cas 2 : Erreur
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

  // Cas 3 : Événement non trouvé
  if (!evenement) {
    return (
      <View style={styles.center}>
        <Text style={styles.erreurTexte}>Événement introuvable</Text>
      </View>
    );
  }

  // Cas 4 : Affichage normal
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contenu}>

        {/* TITRE */}
        <Text style={styles.titre}>{evenement.titre}</Text>

        {/* TYPE D'ÉVÉNEMENT */}
        {evenement.typeEvenement && evenement.typeEvenement.nom && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>{evenement.typeEvenement.nom}</Text>
          </View>
        )}

        {/* DESCRIPTION */}
        {evenement.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitre}>Description</Text>
            <Text style={styles.sectionTexte}>{evenement.description}</Text>
          </View>
        )}

        {/* DATE ET HEURE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Date et heure</Text>

          {evenement.dateDebut && (
            <Text style={styles.sectionTexte}>
              Début : {new Date(evenement.dateDebut).toLocaleDateString('fr-FR', {
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
              Fin : {new Date(evenement.dateFin).toLocaleDateString('fr-FR', {
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

        {/* LIEU */}
        {evenement.lieu && (
          <View style={styles.section}>
            <Text style={styles.sectionTitre}>Lieu</Text>
            <Text style={styles.sectionTexte}>{evenement.lieu.nom}</Text>
            {evenement.lieu.adresse && (
              <Text style={styles.sectionTexteSecondaire}>{evenement.lieu.adresse}</Text>
            )}
            {evenement.lieu.capaciteMax && (
              <Text style={styles.sectionTexteSecondaire}>
                Capacité max : {evenement.lieu.capaciteMax} personnes
              </Text>
            )}
          </View>
        )}

        {/* BOUTON PARTICIPER */}
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