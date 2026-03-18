import React, { useEffect, useState } from 'react';
import {
View,
Text,
StyleSheet,
ActivityIndicator,
TouchableOpacity,
Alert,
TextInput,
ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUtilisateurById, updateUtilisateur } from '../services/api';

export default function ProfileScreen({ navigation }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [isEditing, setIsEditing] = useState(false);

const [formData, setFormData] = useState({
nom: '',
prenom: '',
email: '',
telephone: '',
dateDeNaissance: ''
});

useEffect(() => {
chargerUtilisateur();
}, []);

const chargerUtilisateur = async () => {
try {
setLoading(true);
const token = await AsyncStorage.getItem('token');
const userId = await AsyncStorage.getItem('userId');

  if (!token || !userId) {
    navigation.replace('Login');
    return;
  }

  const utilisateur = await getUtilisateurById(token, userId);
  setUser(utilisateur);
  
  setFormData({
    nom: utilisateur.nom || '',
    prenom: utilisateur.prenom || '',
    email: utilisateur.email || '',
    telephone: utilisateur.telephone || '',
    dateDeNaissance: utilisateur.dateDeNaissance ? String(utilisateur.dateDeNaissance).split('T')[0] : ''
  });
  
} catch (error) {
  console.error('Erreur récupération utilisateur :', error);
  Alert.alert('Erreur', 'Impossible de récupérer le profil');
} finally {
  setLoading(false);
}
};

const handleUpdate = async () => {
try {
setLoading(true);
const token = await AsyncStorage.getItem('token');

  const updatedUser = await updateUtilisateur(token, user.id, formData);
  setUser(updatedUser);
  setIsEditing(false);
  Alert.alert('Succès', 'Profil mis à jour avec succès');
} catch (error) {
  console.error(error);
  Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le profil');
} finally {
  setLoading(false);
}
};

const handleLogout = async () => {
await AsyncStorage.removeItem('token');
await AsyncStorage.removeItem('userId');
navigation.replace('Login');
};

const handleChange = (name, value) => {
setFormData({ ...formData, [name]: value });
};

if (loading && !user) {
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
<ScrollView style={styles.container}>
<View style={styles.card}>
<View style={styles.headerRow}>
<Text style={styles.title}>Profil utilisateur</Text>
<TouchableOpacity
style={[styles.editButton, isEditing ? styles.editButtonCancel : null]}
onPress={() => setIsEditing(!isEditing)}
>
<Text style={styles.editButtonText}>{isEditing ? 'Annuler' : 'Modifier'}</Text>
</TouchableOpacity>
</View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Nom :</Text>
      {isEditing ? (
        <TextInput style={styles.input} value={formData.nom} onChangeText={(text) => handleChange('nom', text)} />
      ) : (
        <Text style={styles.value}>{user.nom || '-'}</Text>
      )}
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Prénom :</Text>
      {isEditing ? (
        <TextInput style={styles.input} value={formData.prenom} onChangeText={(text) => handleChange('prenom', text)} />
      ) : (
        <Text style={styles.value}>{user.prenom || '-'}</Text>
      )}
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Email :</Text>
      {isEditing ? (
        <TextInput style={styles.input} value={formData.email} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" autoCapitalize="none" />
      ) : (
        <Text style={styles.value}>{user.email || '-'}</Text>
      )}
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Téléphone :</Text>
      {isEditing ? (
        <TextInput style={styles.input} value={formData.telephone} onChangeText={(text) => handleChange('telephone', text)} keyboardType="phone-pad" />
      ) : (
        <Text style={styles.value}>{user.telephone || '-'}</Text>
      )}
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Naissance :</Text>
      {isEditing ? (
        <TextInput style={styles.input} value={formData.dateDeNaissance} onChangeText={(text) => handleChange('dateDeNaissance', text)} placeholder="YYYY-MM-DD" />
      ) : (
        <Text style={styles.value}>{formData.dateDeNaissance || '-'}</Text>
      )}
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Rôle :</Text>
      <Text style={styles.value}>
        {typeof user.role === 'object' ? user.role?.nom : user.role || '-'}
      </Text>
    </View>
    
    {isEditing && (
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Enregistrer</Text>}
      </TouchableOpacity>
    )}
  </View>

  <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
    <Text style={styles.profileButtonText}>Se déconnecter</Text>
  </TouchableOpacity>
  
  <View style={{ height: 40 }} />
</ScrollView>
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
headerRow: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 20,
},
title: {
fontSize: 22,
fontWeight: 'bold',
color: '#333',
},
editButton: {
backgroundColor: '#2196F3',
paddingHorizontal: 12,
paddingVertical: 6,
borderRadius: 6,
},
editButtonCancel: {
backgroundColor: '#9e9e9e',
},
editButtonText: {
color: '#fff',
fontWeight: 'bold',
fontSize: 12,
},
infoRow: {
flexDirection: 'row',
marginBottom: 15,
alignItems: 'center',
},
label: {
fontWeight: 'bold',
width: 90,
color: '#222',
},
value: {
color: '#555',
flex: 1,
},
input: {
flex: 1,
backgroundColor: '#f9f9f9',
borderWidth: 1,
borderColor: '#ddd',
borderRadius: 6,
paddingHorizontal: 10,
paddingVertical: 6,
color: '#333',
},
saveButton: {
marginTop: 15,
backgroundColor: '#ff9800',
paddingVertical: 12,
borderRadius: 8,
alignItems: 'center',
},
saveButtonText: {
color: '#fff',
fontWeight: 'bold',
fontSize: 16,
},
profileButton: {
marginTop: 30,
backgroundColor: '#e53935',
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