// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import des écrans
import LoginScreen from '../screens/LoginScreen';
import EventsListScreen from '../screens/EventsListScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import MesReservationsScreen from '../screens/MesReservationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Création du Stack Navigator
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Écran 1 : Login (pas de header) */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* Écran 2 : Liste des événements */}
      <Stack.Screen
        name="EventsList"
        component={EventsListScreen}
        options={{ title: 'Événements' }}
      />

      {/* Écran 3 : Détail d'un événement */}
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Détail' }}
      />
      {/* Écran 4 : Mes réservations */}
      <Stack.Screen
        name="MesReservations"
        component={MesReservationsScreen}
        options={{ title: 'Mes réservations' }}
      />

      {/* Écran 5 : Profil utilisateur */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Stack.Navigator>
  );
}