import { StrictMode } from 'react';
// "createRoot" est la fonction qui permet à React 18+ de prendre le contrôle d'une partie de la page HTML
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { router } from './router';

// Import des styles globaux (Tailwind CSS est chargé ici)
import './index.css';

/**
 * ============================================================================
 * L'INITIALISATION DE REACT
 * ============================================================================
 * 1. On cherche l'élément HTML avec l'id "root" (situé dans index.html).
 * C'est le seul point de contact entre le HTML classique et React.
 * * 2. On crée une "racine" React à cet endroit avec createRoot().
 * * 3. On demande à React d'afficher (.render) toute notre structure de composants dedans.
 */
const rootElement = document.getElementById('root');

// Le "!" sert à dire à TypeScript : "T'inquiète pas, je sais que cet élément existe dans le HTML".
createRoot(rootElement!).render(
  
  // <StrictMode> : C'est un outil de sécurité pour le développement.
  // Il vérifie que votre code suit les bonnes pratiques.
  // Note : Il peut provoquer un double affichage des composants en mode DEV (c'est normal).
  <StrictMode>
    
    {/* L'ORDRE EST IMPORTANT ICI :
      1. AuthProvider est tout en haut : Il fournit les infos "Utilisateur" à tout le monde.
      2. RouterProvider est dedans : Il gère la navigation.
      
      Ainsi, le Router peut vérifier si l'utilisateur est connecté avant d'afficher une page.
    */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    
  </StrictMode>
);