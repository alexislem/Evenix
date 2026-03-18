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
import { getEvenementById, getLieux, updateEvenement } from '../services/api';

export default function EditEventScreen({ route, navigation }) {
const { eventId } = route.params;

const [loadingData, setLoadingData] = useState(true);
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
chargerDonnees();
}, [eventId]);

const chargerDonnees = async () => {
try {
setLoadingData(true);

  const eventData = await getEvenementById(eventId);
  const lieuxData = await getLieux();
  
  setLieux(lieuxData);

  const formatPourMobile = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.substring(0, 16).replace('T', ' ');
  };

  setFormData({
    nom: eventData.nom || '',
    description: eventData.description || '',
    dateDebut: formatPourMobile(eventData.dateDebut),
    dateFin: formatPourMobile(eventData.dateFin),
    payant: eventData.prix > 0,
    prix: eventData.prix ? eventData.prix.toString() : '0',
    lieuId: eventData.lieu?.id || 0,
    imageUrl: eventData.imageUrl || '',
    ville: eventData.lieu?.ville || ''
  });

} catch (error) {
  console.error(error);
  Alert.alert('Erreur', 'Impossible de charger les données de l\'événement');
  navigation.goBack();
} finally {
  setLoadingData(false);
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

  await updateEvenement(token, eventId, payload);
  Alert.alert('Succès', 'Événement modifié avec succès');
  navigation.goBack();
} catch (error) {
  console.error(error);
  Alert.alert('Erreur', error.message || 'Impossible de modifier l\'événement');
} finally {
  setSaving(false);
}
};

if (loadingData) {
return (
<View style={styles.center}>
<ActivityIndicator size="large" color="#2196F3" />
<Text style={{ marginTop: 10 }}>Chargement des données...</Text>
</View>
);
}

return (
<ScrollView style={styles.container}>
<View style={styles.card}>
<Text style={styles.title}>Modifier l'événement</Text>

    <Text style={styles.label}>Nom de l'événement *</Text>
    <TextInput
      style={styles.input}
      value={formData.nom}
      onChangeText={(text) => handleChange('nom', text)}
    />

    <Text style={styles.label}>Description *</Text>
    <TextInput
      style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
      value={formData.description}
      onChangeText={(text) => handleChange('description', text)}
      multiline={true}
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
    />

    <View style={styles.switchContainer}>
      <Text style={styles.labelSwitch}>Cet événement est payant</Text>
      <Switch
        value={formData.payant}
        onValueChange={(value) => handleChange('payant', value)}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={formData.payant ? "#2196F3" : "#f4f3f4"}
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
        <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
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
container: {
flex: 1,
backgroundColor: '#f5f5f5',
padding: 15,
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
color: '#333',
marginBottom: 20,
},
label: {
fontSize: 14,
fontWeight: 'bold',
color: '#555',
marginBottom: 5,
marginTop: 10,
},
input: {
backgroundColor: '#f9f9f9',
borderWidth: 1,
borderColor: '#ddd',
borderRadius: 8,
paddingHorizontal: 15,
paddingVertical: 10,
fontSize: 14,
color: '#333',
},
switchContainer: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
marginTop: 20,
marginBottom: 10,
paddingVertical: 10,
borderTopWidth: 1,
borderBottomWidth: 1,
borderColor: '#eee',
},
labelSwitch: {
fontSize: 16,
fontWeight: 'bold',
color: '#333',
},
lieuxContainer: {
marginTop: 5,
marginBottom: 10,
},
lieuButton: {
padding: 12,
backgroundColor: '#f0f0f0',
borderRadius: 8,
marginBottom: 8,
borderWidth: 1,
borderColor: '#ddd',
},
lieuButtonActive: {
backgroundColor: '#e3f2fd',
borderColor: '#2196F3',
},
lieuText: {
color: '#555',
fontSize: 14,
},
lieuTextActive: {
color: '#1565c0',
fontWeight: 'bold',
},
saveButton: {
backgroundColor: '#2196F3',
paddingVertical: 14,
borderRadius: 8,
alignItems: 'center',
marginTop: 25,
},
saveButtonText: {
color: '#fff',
fontSize: 16,
fontWeight: 'bold',
},
cancelButton: {
backgroundColor: '#9e9e9e',
paddingVertical: 14,
borderRadius: 8,
alignItems: 'center',
marginTop: 10,
},
cancelButtonText: {
color: '#fff',
fontSize: 16,
fontWeight: 'bold',
}
});