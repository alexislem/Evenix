import React, { useState, useEffect } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
ActivityIndicator,
Alert,
ScrollView,
Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLieux, createEvenement } from '../services/api';

export default function CreateEventScreen({ navigation }) {
const [loadingLieux, setLoadingLieux] = useState(true);
const [saving, setSaving] = useState(false);
const [lieux, setLieux] = useState([]);

const [formData, setFormData] = useState({
nom: '',
description: '',
dateDebut: '',
dateFin: '',
payant: false,
prix: '0',
lieuId: 0,
imageUrl: '',
ville: ''
});

useEffect(() => {
chargerLieux();
}, []);

const chargerLieux = async () => {
try {
const lieuxData = await getLieux();
setLieux(lieuxData);
} catch (error) {
console.error(error);
Alert.alert('Erreur', 'Impossible de charger la liste des lieux');
} finally {
setLoadingLieux(false);
}
};

const handleChange = (name, value) => {
setFormData(prev => {
const updatedState = { ...prev, [name]: value };

  if (name === 'lieuId') {
    const selectedLieu = lieux.find(l => l.id === value);
    if (selectedLieu) {
      updatedState.ville = selectedLieu.ville || '';
    }
  }
  return updatedState;
});
};

const handleSubmit = async () => {
if (!formData.nom || !formData.dateDebut || !formData.dateFin || formData.lieuId === 0) {
Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires et sélectionner un lieu.');
return;
}

const selectedLieu = lieux.find(l => l.id === formData.lieuId);

try {
  setSaving(true);
  const token = await AsyncStorage.getItem('token');
  const userId = await AsyncStorage.getItem('userId');

  const payload = {
    nom: formData.nom,
    description: formData.description,
    dateDebut: formData.dateDebut.replace(' ', 'T') + ':00',
    dateFin: formData.dateFin.replace(' ', 'T') + ':00',
    prix: formData.payant ? parseFloat(formData.prix) : 0,
    ville: formData.ville,
    imageUrl: formData.imageUrl,
    lieu: selectedLieu,
    types: []
  };

  await createEvenement(token, userId, payload);
  Alert.alert('Succès', 'Événement créé avec succès !');
  navigation.goBack();
} catch (error) {
  console.error(error);
  Alert.alert('Erreur', error.message || 'Impossible de créer l\'événement');
} finally {
  setSaving(false);
}
};

if (loadingLieux) {
return (
<View style={styles.center}>
<ActivityIndicator size="large" color="#4CAF50" />
<Text style={{ marginTop: 10 }}>Chargement des lieux...</Text>
</View>
);
}

return (
<ScrollView style={styles.container}>
<View style={styles.card}>
<Text style={styles.title}>Créer un événement</Text>

    <Text style={styles.label}>Nom de l'événement *</Text>
    <TextInput
      style={styles.input}
      value={formData.nom}
      onChangeText={(text) => handleChange('nom', text)}
      placeholder="Ex: Conférence Tech 2026"
    />

    <Text style={styles.label}>Description *</Text>
    <TextInput
      style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
      value={formData.description}
      onChangeText={(text) => handleChange('description', text)}
      multiline={true}
      placeholder="Détails de l'événement..."
    />

    <Text style={styles.label}>Date de début (YYYY-MM-DD HH:mm) *</Text>
    <TextInput
      style={styles.input}
      value={formData.dateDebut}
      onChangeText={(text) => handleChange('dateDebut', text)}
      placeholder="Ex: 2026-05-15 14:00"
    />

    <Text style={styles.label}>Date de fin (YYYY-MM-DD HH:mm) *</Text>
    <TextInput
      style={styles.input}
      value={formData.dateFin}
      onChangeText={(text) => handleChange('dateFin', text)}
      placeholder="Ex: 2026-05-15 18:00"
    />

    <Text style={styles.label}>URL de l'image</Text>
    <TextInput
      style={styles.input}
      value={formData.imageUrl}
      onChangeText={(text) => handleChange('imageUrl', text)}
      autoCapitalize="none"
      placeholder="https://..."
    />

    <View style={styles.switchContainer}>
      <Text style={styles.labelSwitch}>Cet événement est payant</Text>
      <Switch
        value={formData.payant}
        onValueChange={(value) => handleChange('payant', value)}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={formData.payant ? "#4CAF50" : "#f4f3f4"}
      />
    </View>

    {formData.payant && (
      <View>
        <Text style={styles.label}>Prix (€) *</Text>
        <TextInput
          style={styles.input}
          value={formData.prix}
          onChangeText={(text) => handleChange('prix', text)}
          keyboardType="numeric"
        />
      </View>
    )}

    <Text style={styles.label}>Lieu *</Text>
    <View style={styles.lieuxContainer}>
      {lieux.map((lieu) => (
        <TouchableOpacity
          key={lieu.id}
          style={[
            styles.lieuButton,
            formData.lieuId === lieu.id && styles.lieuButtonActive
          ]}
          onPress={() => handleChange('lieuId', lieu.id)}
        >
          <Text style={[
            styles.lieuText,
            formData.lieuId === lieu.id && styles.lieuTextActive
          ]}>
            {lieu.nom} - {lieu.ville}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity 
      style={styles.saveButton} 
      onPress={handleSubmit} 
      disabled={saving}
    >
      {saving ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.saveButtonText}>Créer l'événement</Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.cancelButton} 
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.cancelButtonText}>Annuler</Text>
    </TouchableOpacity>
  </View>
  <View style={{ height: 40 }} />
</ScrollView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3 },
title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5, marginTop: 10 },
input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10, fontSize: 14, color: '#333' },
switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 10, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
labelSwitch: { fontSize: 16, fontWeight: 'bold', color: '#333' },
lieuxContainer: { marginTop: 5, marginBottom: 10 },
lieuButton: { padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
lieuButtonActive: { backgroundColor: '#e8f5e9', borderColor: '#4CAF50' },
lieuText: { color: '#555', fontSize: 14 },
lieuTextActive: { color: '#2e7d32', fontWeight: 'bold' },
saveButton: { backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 25 },
saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
cancelButton: { backgroundColor: '#9e9e9e', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
cancelButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});