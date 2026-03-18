// services/api.js
// Configuration de l'API Evenix

// IMPORTANT : Remplacez par l'IP de VOTRE PC
// Pour trouver votre IP : ouvrez un terminal et tapez "ipconfig"
// Cherchez "Adresse IPv4" de votre carte Wi-Fi

const BASE_URL = 'http://192.168.1.169:8080';

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

export async function checkParticipation(token, userId, eventId) {
  const response = await fetch(
    `${BASE_URL}/inscriptions/utilisateur/${userId}/evenement/${eventId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.participe === true;
} 

export async function getInscriptionsByUser(token, userId) {
  const response = await fetch(`${BASE_URL}/api/inscription/user/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Impossible de récupérer les inscriptions');
  }

  return await response.json();
}

export async function desinscrireEvenement(token, inscriptionId) {
  const response = await fetch(`${BASE_URL}/api/inscription/${inscriptionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Impossible de se désinscrire');
  }

  return true;
}

export async function getUtilisateurById(token, userId) {
  const response = await fetch(`${BASE_URL}/api/utilisateur/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Impossible de récupérer le profil');
  }

  return await response.json();
}

export async function updateUtilisateur(token, id, data) {
const response = await fetch(`${BASE_URL}/api/utilisateur/${id}`, {
method: 'PUT',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify(data),
});

if (!response.ok) {
const message = await response.text();
throw new Error(message || 'Impossible de mettre à jour le profil');
}

return await response.json();
}

export async function getLieux() {
const response = await fetch(`${BASE_URL}/api/lieu/all`, {
method: 'GET',
headers: {
'Content-Type': 'application/json',
},
});

if (!response.ok) {
throw new Error('Impossible de récupérer les lieux');
}

return await response.json();
}

export async function updateEvenement(token, id, data) {
const response = await fetch(`${BASE_URL}/api/evenement/${id}`, {
method: 'PUT',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify(data),
});

if (!response.ok) {
const message = await response.text();
throw new Error(message || `Impossible de modifier l'événement`);
}

return await response.json();
}

export async function deleteEvenement(token, id) {
const response = await fetch(`${BASE_URL}/api/evenement/${id}`, {
method: 'DELETE',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
});

if (!response.ok) {
const message = await response.text();
throw new Error(message || `Impossible de supprimer l'événement`);
}

// Certains backends ne renvoient rien (204 No Content) lors d'une suppression
// On retourne true pour confirmer que la requête a réussi
return true;
}

export async function createEvenement(token, userId, data) {
// Note : Adapte l'URL selon comment ton backend Spring Boot gère l'ID de l'organisateur.
// Souvent c'est passé en paramètre d'URL (?userId=...) ou directement extrait du Token.
const response = await fetch(`${BASE_URL}/api/evenement?utilisateurId=${userId}`, {
method: 'POST',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify(data),
});

if (!response.ok) {
const message = await response.text();
throw new Error(message || `Impossible de créer l'événement`);
}

return await response.json();
}

export async function registerUtilisateur(data) {
const response = await fetch(`${BASE_URL}/api/auth/register`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(data),
});

if (!response.ok) {
const message = await response.text();
throw new Error(message || `Erreur lors de l'inscription`);
}

// Le backend renvoie peut-être juste un texte ou rien pour l'inscription,
// on utilise .text() au cas où ce ne soit pas du JSON pur.
return await response.text();
}
export default BASE_URL;