import React, { useEffect, useState } from 'react';
import {
View,
Text,
FlatList,
TouchableOpacity,
StyleSheet,
ActivityIndicator,
Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEvenements, deleteEvenement } from '../services/api';
// Assure-toi d'avoir une fonction deleteEvenement dans ton api.js si tu veux gérer la suppression !

export default function OrganizerEventsListScreen({ navigation }) {
const [mesEvenements, setMesEvenements] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
// Recharger la liste quand on revient sur cet écran
const unsubscribe = navigation.addListener('focus', () => {
loadMesEvenements();
});
return unsubscribe;
}, [navigation]);

const loadMesEvenements = async () => {
try {
setLoading(true);
const userId = await AsyncStorage.getItem('userId');

  const allEvents = await getEvenements();
  // On filtre pour ne garder que ceux créés par l'utilisateur connecté
  const filteredEvents = allEvents.filter(e => e.utilisateur?.id?.toString() === userId);
  
  setMesEvenements(filteredEvents);
} catch (error) {
  console.error('Erreur :', error);
  Alert.alert('Erreur', 'Impossible de charger vos événements');
} finally {
  setLoading(false);
}
};

const confirmerSuppression = (id, nom) => {
Alert.alert(
"Suppression", `Voulez-vous vraiment supprimer "${nom}" ?`,
[
{ text: "Annuler", style: "cancel" },
{
text: "Supprimer",
style: "destructive",
onPress: () => executerSuppression(id)
}
]
);
};

const executerSuppression = async (id) => {
try {
const token = await AsyncStorage.getItem('token');

// Appel à l'API pour supprimer en base de données
await deleteEvenement(token, id);

// Si la suppression a réussi, on recharge la liste
loadMesEvenements();
Alert.alert('Succès', 'L\'événement a bien été supprimé.');
} catch (err) {
console.error(err);
Alert.alert('Erreur', err.message || 'Impossible de supprimer cet événement.');
}
};

const renderCard = ({ item }) => (
<View style={styles.card}>
<Text style={styles.titre}>{item.nom}</Text>
<Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

  <View style={styles.infoRow}>
    <Text style={styles.infoText}>📍 {item.lieu?.ville}</Text>
    <Text style={styles.infoText}>💰 {item.prix} €</Text>
    <Text style={styles.infoText}>👥 {item.lieu?.capaciteMax} pl.</Text>
  </View>

  <View style={styles.actionRow}>
    <TouchableOpacity
        style={[styles.btnAction, styles.btnEdit]}
        onPress={() => navigation.navigate('EditEvenement', { eventId: item.id })}
        >
        <Text style={styles.btnText}>Modifier</Text>
    </TouchableOpacity>
        
    <TouchableOpacity 
      style={[styles.btnAction, styles.btnDelete]}
      onPress={() => confirmerSuppression(item.id, item.nom)}
    >
      <Text style={styles.btnText}>Supprimer</Text>
    </TouchableOpacity>
  </View>
</View>
);

if (loading) {
return (
<View style={styles.center}>
<ActivityIndicator size="large" color="#9C27B0" />
</View>
);
}

return (
<View style={styles.container}>
<TouchableOpacity
style={styles.btnAdd}
onPress={() => navigation.navigate('CreateEventScreen')}
>
<Text style={styles.btnAddText}>+ Nouvel événement</Text>
</TouchableOpacity>

  {mesEvenements.length === 0 ? (
    <View style={styles.center}>
      <Text style={styles.emptyText}>Vous n'avez créé aucun événement.</Text>
    </View>
  ) : (
    <FlatList
      data={mesEvenements}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCard}
      contentContainerStyle={styles.list}
    />
  )}
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#f5f5f5' },
center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
list: { padding: 15 },
btnAdd: { backgroundColor: '#4CAF50', margin: 15, padding: 15, borderRadius: 8, alignItems: 'center' },
btnAddText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
emptyText: { color: '#666', fontSize: 16, marginTop: 50 },
card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
titre: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
desc: { color: '#666', marginBottom: 10 },
infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 8, borderRadius: 5 },
infoText: { fontSize: 12, color: '#555', fontWeight: 'bold' },
actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
btnAction: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
btnEdit: { backgroundColor: '#2196F3' },
btnDelete: { backgroundColor: '#f44336' },
btnText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});