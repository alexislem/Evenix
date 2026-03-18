import React, { useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
ActivityIndicator,
Alert,
ScrollView
} from 'react-native';
import { registerUtilisateur } from '../services/api';

export default function RegisterScreen({ navigation }) {
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

const [formData, setFormData] = useState({
nom: '',
prenom: '',
email: '',
motDePasse: '',
telephone: '',
dateDeNaissance: '',
questionSecurite: '',
reponseSecurite: '',
role: 'PARTICIPANT' // Rôle par défaut
});

const handleChange = (name, value) => {
if (name === 'telephone') {
const numericValue = value.replace(/\D/g, '');
setFormData({ ...formData, [name]: numericValue });
} else {
setFormData({ ...formData, [name]: value });
}
};

const validatePassword = (password) => {
if (password.length < 12) return "Le mot de passe doit contenir au moins 12 caractères.";

const lowerCount = (password.match(/[a-z]/g) || []).length;
const specialCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
const upperCount = (password.match(/[A-Z]/g) || []).length;
const numberCount = (password.match(/[0-9]/g) || []).length;

const isValidComposition = password.length === (lowerCount + specialCount + upperCount + numberCount);

if (lowerCount !== 1) return "Le mot de passe doit contenir exactement 1 minuscule.";
if (specialCount < 1) return "Le mot de passe doit contenir au moins 1 caractère spécial.";
if (!isValidComposition) return "Le mot de passe contient des caractères interdits.";
if (upperCount < 1) return "Le mot de passe doit contenir au moins une majuscule.";

return null;
};

const handleSubmit = async () => {
if (!formData.nom || !formData.prenom || !formData.email || !formData.motDePasse) {
Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires.');
return;
}

const passwordError = validatePassword(formData.motDePasse);
if (passwordError) {
  Alert.alert('Mot de passe non conforme', passwordError);
  return;
}

try {
  setLoading(true);
  await registerUtilisateur(formData);
  Alert.alert('Succès', 'Votre compte a été créé avec succès !');
  navigation.navigate('Login'); // Retour à la page de connexion
} catch (error) {
  console.error(error);
  Alert.alert('Erreur', error.message || 'Impossible de créer le compte');
} finally {
  setLoading(false);
}
};

const isOrga = formData.role === 'ORGANISATEUR';

return (
<ScrollView style={styles.container}>
<View style={styles.card}>
<Text style={styles.title}>Créer un compte</Text>

    <Text style={styles.label}>Je suis un :</Text>
    <View style={styles.roleContainer}>
      <TouchableOpacity 
        style={[styles.roleButton, !isOrga && styles.roleButtonActivePart]}
        onPress={() => handleChange('role', 'PARTICIPANT')}
      >
        <Text style={[styles.roleText, !isOrga && styles.roleTextActive]}>Participant</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.roleButton, isOrga && styles.roleButtonActiveOrga]}
        onPress={() => handleChange('role', 'ORGANISATEUR')}
      >
        <Text style={[styles.roleText, isOrga && styles.roleTextActive]}>Organisateur</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.label}>Identité *</Text>
    <View style={styles.row}>
      <TextInput
        style={[styles.input, { flex: 1, marginRight: 5 }]}
        placeholder="Nom"
        value={formData.nom}
        onChangeText={(text) => handleChange('nom', text)}
      />
      <TextInput
        style={[styles.input, { flex: 1, marginLeft: 5 }]}
        placeholder="Prénom"
        value={formData.prenom}
        onChangeText={(text) => handleChange('prenom', text)}
      />
    </View>

    <Text style={styles.label}>Email *</Text>
    <TextInput
      style={styles.input}
      placeholder="exemple@email.com"
      value={formData.email}
      onChangeText={(text) => handleChange('email', text)}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <Text style={styles.label}>Téléphone & Naissance</Text>
    <View style={styles.row}>
      <TextInput
        style={[styles.input, { flex: 1, marginRight: 5 }]}
        placeholder="Téléphone"
        value={formData.telephone}
        onChangeText={(text) => handleChange('telephone', text)}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={[styles.input, { flex: 1, marginLeft: 5 }]}
        placeholder="YYYY-MM-DD"
        value={formData.dateDeNaissance}
        onChangeText={(text) => handleChange('dateDeNaissance', text)}
      />
    </View>

    <Text style={styles.label}>Mot de passe *</Text>
    <TextInput
      style={styles.input}
      placeholder="12 carac., 1 min., 1 maj., 1 spé."
      value={formData.motDePasse}
      onChangeText={(text) => handleChange('motDePasse', text)}
      secureTextEntry={!showPassword}
    />
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      <Text style={styles.showPasswordText}>
        {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
      </Text>
    </TouchableOpacity>

    <Text style={styles.label}>Sécurité (Récupération)</Text>
    <TextInput
      style={styles.input}
      placeholder="Votre question secrète"
      value={formData.questionSecurite}
      onChangeText={(text) => handleChange('questionSecurite', text)}
    />
    <TextInput
      style={[styles.input, { marginTop: 10 }]}
      placeholder="Votre réponse"
      value={formData.reponseSecurite}
      onChangeText={(text) => handleChange('reponseSecurite', text)}
    />

    <TouchableOpacity 
      style={[styles.submitButton, isOrga ? styles.bgPurple : styles.bgGreen]} 
      onPress={handleSubmit} 
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.submitButtonText}>S'inscrire</Text>
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
card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3 },
title: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 },
label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 15, marginBottom: 5 },
row: { flexDirection: 'row', justifyContent: 'space-between' },
input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10, fontSize: 14, color: '#333' },
roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
roleButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center', marginHorizontal: 2 },
roleButtonActivePart: { backgroundColor: '#e8f5e9', borderColor: '#4CAF50' },
roleButtonActiveOrga: { backgroundColor: '#f3e5f5', borderColor: '#9C27B0' },
roleText: { color: '#666', fontWeight: 'bold' },
roleTextActive: { color: '#333' },
showPasswordText: { color: '#2196F3', fontSize: 12, marginTop: 5, textAlign: 'right' },
submitButton: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 25 },
bgGreen: { backgroundColor: '#4CAF50' },
bgPurple: { backgroundColor: '#9C27B0' },
submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
cancelButton: { marginTop: 15, paddingVertical: 10, alignItems: 'center' },
cancelButtonText: { color: '#757575', fontSize: 14, fontWeight: 'bold' }
});