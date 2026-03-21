import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { getEvenements, getUtilisateurById } from '../services/api';

export default function EventsListScreen({ navigation, route }) {
  const isGuest = route.params?.isGuest || false;

  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [isOrganisateur, setIsOrganisateur] = useState(false);

  const [dateDebutRecherche, setDateDebutRecherche] = useState(null);
  const [dateFinRecherche, setDateFinRecherche] = useState(null);

  // Utilisé seulement sur iOS
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('start'); // "start" | "end"

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setErreur(null);

      const data = await getEvenements();
      setEvenements(data);

      if (!isGuest) {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        if (token && userId) {
          const utilisateur = await getUtilisateurById(token, userId);
          const roleNom =
            typeof utilisateur.role === 'object'
              ? utilisateur.role?.nom
              : utilisateur.role;

          if (roleNom === 'ORGANISATEUR' || roleNom === 'ADMIN') {
            setIsOrganisateur(true);
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement :', error);
      setErreur(error.message || 'Erreur inconnue');
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

  const normaliserDateSansHeure = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const formaterDateAffichage = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR');
  };

  const appliquerDateSelectionnee = (mode, selectedDate) => {
    if (!selectedDate) return;

    const dateNormalisee = normaliserDateSansHeure(selectedDate);

    if (mode === 'start') {
      if (dateFinRecherche && dateNormalisee > normaliserDateSansHeure(dateFinRecherche)) {
        Alert.alert(
          'Date invalide',
          'La date de début ne peut pas être après la date de fin.'
        );
        return;
      }
      setDateDebutRecherche(dateNormalisee);
      return;
    }

    if (mode === 'end') {
      if (dateDebutRecherche && dateNormalisee < normaliserDateSansHeure(dateDebutRecherche)) {
        Alert.alert(
          'Date invalide',
          'La date de fin ne peut pas être avant la date de début.'
        );
        return;
      }
      setDateFinRecherche(dateNormalisee);
    }
  };

  const ouvrirPicker = (mode) => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value:
          mode === 'start'
            ? dateDebutRecherche || new Date()
            : dateFinRecherche || new Date(),
        mode: 'date',
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (event.type === 'dismissed') return;
          appliquerDateSelectionnee(mode, selectedDate);
        },
      });
      return;
    }

    // iOS
    setPickerMode(mode);
    setShowIOSPicker(true);
  };

  const reinitialiserFiltres = () => {
    setDateDebutRecherche(null);
    setDateFinRecherche(null);
  };

  const evenementsFiltres = evenements.filter((event) => {
    if (!event.dateDebut) return false;

    const dateEvent = new Date(event.dateDebut);
    if (isNaN(dateEvent.getTime())) return false;

    const eventSansHeure = normaliserDateSansHeure(dateEvent);

    const dateMin = dateDebutRecherche
      ? normaliserDateSansHeure(dateDebutRecherche)
      : null;

    const dateMax = dateFinRecherche
      ? normaliserDateSansHeure(dateFinRecherche)
      : null;

    if (dateMin && eventSansHeure < dateMin) return false;
    if (dateMax && eventSansHeure > dateMax) return false;

    return true;
  });

  const renderEvenement = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.carte}
        onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
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

        {item.lieu && <Text style={styles.lieu}>{item.lieu.nom}</Text>}
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
        <Text style={styles.errorText}>{erreur}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topActionsContainer}>
        {isGuest ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.btnGrey]}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.actionButtonText}>Retour connexion</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionButton, styles.btnBlue]}
              onPress={() => navigation.navigate('MesReservations')}
            >
              <Text style={styles.actionButtonText}>Mes réservations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.btnGreen]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.actionButtonText}>Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.btnRed]}
              onPress={handleLogout}
            >
              <Text style={styles.actionButtonText}>Déconnexion</Text>
            </TouchableOpacity>

            {isOrganisateur && (
              <TouchableOpacity
                style={[styles.actionButton, styles.btnPurple, styles.fullWidthButton]}
                onPress={() => navigation.navigate('MesEvenements')}
              >
                <Text style={styles.actionButtonText}>⚙️ Gérer mes événements</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.filtresContainer}>
        <Text style={styles.filtresTitre}>Rechercher par date</Text>

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => ouvrirPicker('start')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.dateLabel}>Date de début</Text>
            <Text
              style={
                dateDebutRecherche ? styles.dateValue : styles.datePlaceholder
              }
            >
              {dateDebutRecherche
                ? formaterDateAffichage(dateDebutRecherche)
                : 'Sélectionner une date'}
            </Text>
          </View>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => ouvrirPicker('end')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.dateLabel}>Date de fin</Text>
            <Text
              style={dateFinRecherche ? styles.dateValue : styles.datePlaceholder}
            >
              {dateFinRecherche
                ? formaterDateAffichage(dateFinRecherche)
                : 'Sélectionner une date'}
            </Text>
          </View>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={reinitialiserFiltres}>
          <Text style={styles.resetButtonText}>Réinitialiser les dates</Text>
        </TouchableOpacity>

        <Text style={styles.resultatTexte}>
          {evenementsFiltres.length} événement(s) trouvé(s)
        </Text>
      </View>

      {Platform.OS === 'ios' && showIOSPicker && (
        <View style={styles.iosPickerContainer}>
          <DateTimePicker
            value={
              pickerMode === 'start'
                ? dateDebutRecherche || new Date()
                : dateFinRecherche || new Date()
            }
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                appliquerDateSelectionnee(pickerMode, selectedDate);
              }
            }}
          />

          <TouchableOpacity
            style={styles.iosCloseButton}
            onPress={() => setShowIOSPicker(false)}
          >
            <Text style={styles.iosCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={evenementsFiltres}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEvenement}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun événement trouvé pour cette période.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  topActionsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },

  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  actionButton: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 5,
  },

  fullWidthButton: {
    width: '100%',
    marginTop: 5,
  },

  btnBlue: { backgroundColor: '#2196F3' },
  btnGreen: { backgroundColor: '#4CAF50' },
  btnRed: { backgroundColor: '#f44336' },
  btnPurple: { backgroundColor: '#9C27B0' },
  btnGrey: { backgroundColor: '#9e9e9e' },

  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },

  filtresContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  filtresTitre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },

  datePickerButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },

  dateLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },

  dateValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },

  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },

  calendarIcon: {
    fontSize: 22,
  },

  resetButton: {
    backgroundColor: '#757575',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },

  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  resultatTexte: {
    marginTop: 10,
    color: '#555',
    fontStyle: 'italic',
  },

  list: {
    padding: 15,
    paddingTop: 5,
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

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },

  errorText: {
    color: 'red',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iosPickerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 10,
  },

  iosCloseButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  iosCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});