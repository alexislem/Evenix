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
import { getEvenements, getUtilisateurById } from '../services/api';

export default function EventsListScreen({ navigation, route }) {
const isGuest = route.params?.isGuest || false;

const [evenements, setEvenements] = useState([]);
const [loading, setLoading] = useState(true);
const [erreur, setErreur] = useState(null);
const [isOrganisateur, setIsOrganisateur] = useState(false);

useEffect(() => {
chargerDonnees();
}, []);

const chargerDonnees = async () => {
try {
setLoading(true);
setErreur(null);

  // 1. Charger les événements
  const data = await getEvenements();
  setEvenements(data);

  // 2. Vérifier le rôle si l'utilisateur est connecté
  if (!isGuest) {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    
    if (token && userId) {
      const utilisateur = await getUtilisateurById(token, userId);
      const roleNom = typeof utilisateur.role === 'object' ? utilisateur.role?.nom : utilisateur.role;
      if (roleNom === 'ORGANISATEUR' || roleNom === 'ADMIN') {
        setIsOrganisateur(true);
      }
    }
  }

} catch (error) {
  console.error('Erreur chargement :', error);
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
<Text style={styles.titre}>{item.nom}</Text>
{item.dateDebut && (
<Text style={styles.date}>
{new Date(item.dateDebut).toLocaleDateString('fr-FR', {
day: 'numeric', month: 'long', year: 'numeric',
hour: '2-digit', minute: '2-digit',
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
<Text style={{ color: 'red' }}>{erreur}</Text>
</View>
);
}

return (
<View style={styles.container}>
{/* Boutons du haut */}
<View style={styles.topActionsContainer}>
{isGuest ? (
<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#9e9e9e' }]} onPress={() => navigation.replace('Login')}>
<Text style={styles.actionButtonText}>Retour connexion</Text>
</TouchableOpacity>
) : (
<View style={styles.actionGrid}>
<TouchableOpacity style={[styles.actionButton, styles.btnBlue]} onPress={() => navigation.navigate('MesReservations')}>
<Text style={styles.actionButtonText}>Mes réservations</Text>
</TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.btnGreen]} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.actionButtonText}>Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.btnRed]} onPress={handleLogout}>
          <Text style={styles.actionButtonText}>Déconnexion</Text>
        </TouchableOpacity>

        {isOrganisateur && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.btnPurple, { width: '100%', marginTop: 5 }]} 
            onPress={() => navigation.navigate('MesEvenements')}
          >
            <Text style={styles.actionButtonText}>⚙️ Gérer mes événements</Text>
          </TouchableOpacity>
        )}
      </View>
    )}
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
container: { flex: 1, backgroundColor: '#f5f5f5' },
topActionsContainer: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 5 },
actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
actionButton: { width: '31%', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginBottom: 5 },
btnBlue: { backgroundColor: '#2196F3' },
btnGreen: { backgroundColor: '#4CAF50' },
btnRed: { backgroundColor: '#f44336' },
btnPurple: { backgroundColor: '#9C27B0' },
actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
list: { padding: 15 },
carte: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
titre: { fontSize: 18, fontWeight: 'bold', color: '#333' },
date: { color: '#666', marginTop: 4 },
lieu: { color: '#4CAF50', marginTop: 4 },
center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});