import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { router } from './router';

/**
 * ============================================================================
 * COMPOSANT RACINE (ROOT COMPONENT)
 * ============================================================================
 * Le composant "App" est le tout premier composant React qui est affiché
 * à l'écran. C'est le "parent" de toute votre application.
 * * Son rôle n'est pas d'afficher du contenu (texte, images...), mais de
 * configurer les "super-pouvoirs" de l'application :
 * 1. L'Authentification (via AuthProvider)
 * 2. La Navigation (via RouterProvider)
 * ============================================================================
 */
function App() {
  return (
    // 1. LE FOURNISSEUR D'AUTHENTIFICATION (AUTH PROVIDER)
    // On entoure toute l'application avec ce composant.
    // Cela permet à n'importe quelle page (Home, Login, Dashboard...)
    // d'accéder aux infos de l'utilisateur (user, token) via "useAuth()".
    <AuthProvider>
      
      {/* 2. LE FOURNISSEUR DE ROUTAGE (ROUTER PROVIDER)
        C'est le système GPS de l'application.
        Il prend notre fichier de configuration "router" (qu'on a défini dans router.tsx)
        et décide quel composant afficher en fonction de l'URL dans la barre d'adresse.
        
        Exemple :
        - URL "/" -> Affiche <Home />
        - URL "/login" -> Affiche <Login />
      */}
      <RouterProvider router={router} />
      
    </AuthProvider>
  );
}

export default App;