// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
  // --- ÉTAT (state) ---
  // Chaque useState crée une variable + une fonction pour la modifier
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);

  // --- FONCTION DE CONNEXION ---
  const handleLogin = async () => {
    // Vérification : les champs ne doivent pas être vides
    if (!email || !motDePasse) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true); // On affiche le chargement

    try {
      // 1. Appel au backend
const responseJson = await login(email, motDePasse);

// 2. Récupérer le token (il est dans responseJson.data.token)
const token = responseJson.data?.token;

// 3. Récupérer le userId (il est dans responseJson.data.utilisateur.id)
const userId = responseJson.data?.utilisateur?.id?.toString();

console.log("Token extrait :", token ? "OUI" : "NON");
console.log("UserId extrait :", userId);

if (!token) {
  Alert.alert('Erreur', 'Token non trouvé dans la réponse du serveur');
  setLoading(false);
  return;
}

// 4. Stocker en local
await AsyncStorage.setItem('token', token);
if (userId) {
  await AsyncStorage.setItem('userId', userId);
}

// 5. Navigation
navigation.replace('EventsList');
    } catch (error) {
      // En cas d'erreur (mauvais identifiants, réseau, etc.)
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false); // On arrête le chargement
    }
  };

  // --- AFFICHAGE (JSX) ---
  return (
    <View style={styles.container}>
      <Text style={styles.titre}>EvenixMobile</Text>
      <Text style={styles.sousTitre}>Connectez-vous</Text>

      {/* Champ Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Champ Mot de passe */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#999"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry={true}
      />

      {/* Bouton Se connecter */}
      <TouchableOpacity
        style={styles.bouton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.boutonTexte}>Se connecter</Text>
        )}
      </TouchableOpacity>

      {/* Bouton Créer un compte */}
      <TouchableOpacity
        style={[styles.bouton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#4CAF50', marginTop: 15 }]}
        onPress={() => navigation.navigate('RegisterScreen')}
        >
        <Text style={[styles.boutonTexte, { color: '#4CAF50' }]}>Créer un compte</Text>
      </TouchableOpacity>

<TouchableOpacity
        style={[styles.bouton, { backgroundColor: '#607D8B', marginTop: 15 }]}
        onPress={() => navigation.navigate('EventsList', { isGuest: true })}
      >
        <Text style={styles.boutonTexte}>Continuer sans se connecter</Text>
      </TouchableOpacity>
    </View>
    
  );
  
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  titre: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  sousTitre: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  bouton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  boutonTexte: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});