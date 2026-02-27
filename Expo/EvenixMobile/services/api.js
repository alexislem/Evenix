// services/api.js
// Configuration de l'API Evenix

// IMPORTANT : Remplacez par l'IP de VOTRE PC
// Pour trouver votre IP : ouvrez un terminal et tapez "ipconfig"
// Cherchez "Adresse IPv4" de votre carte Wi-Fi

const BASE_URL = 'http://172.20.10.2:8080';

// Fonction de connexion
// Envoie l'email et le mot de passe au backend
// Retourne le token + les infos utilisateur si succès
export async function login(email, motDePasse) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      motDePasse: motDePasse,
    }),
  });

  // Si le serveur répond avec une erreur (401, 500, etc.)
  if (!response.ok) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // On récupère le JSON de la réponse
  const data = await response.json();
  return data;
}

// Fonction pour récupérer tous les événements
export async function getEvenements() {
  const response = await fetch(`${BASE_URL}/api/evenement/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer les événements');
  }

  const data = await response.json();
  return data;
}

// Fonction pour récupérer un événement par son ID
export async function getEvenementById(id) {
  const response = await fetch(`${BASE_URL}/api/evenement/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer cet événement');
  }

  const data = await response.json();
  return data;
}

// Fonction pour participer (s'inscrire) à un événement
export async function participerEvenement(token, userId, eventId) {
  const response = await fetch(
    `${BASE_URL}/api/inscription?userId=${userId}&eventId=${eventId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Cas 401 : token invalide ou expiré
  if (response.status === 401) {
    throw new Error('SESSION_EXPIREE');
  }

  // Cas 404 : utilisateur ou événement introuvable
  if (response.status === 404) {
    throw new Error('Utilisateur ou événement introuvable');
  }

  // Cas 400 : erreur métier (déjà inscrit, complet, etc.)
  if (response.status === 400) {
    // Le backend renvoie le message d'erreur en texte
    const message = await response.text();
    throw new Error(message || 'Inscription impossible');
  }

  // Cas 200 : succès
  if (!response.ok) {
    throw new Error('Erreur lors de l\'inscription');
  }

  const data = await response.json();
  return data;
}

export default BASE_URL;