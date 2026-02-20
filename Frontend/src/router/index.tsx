import { createBrowserRouter } from 'react-router-dom';

// --- IMPORTS DES LAYOUTS (Mise en page globale) ---
// Le MainLayout contient la Navbar et le Footer qui s'affichent sur toutes les pages.
import MainLayout from '../layouts/MainLayout';

// --- IMPORTS DES COMPOSANTS DE SÉCURITÉ ---
// Ce composant sert de "gardien". Il vérifie si l'utilisateur a le droit d'accéder à la page.
import ProtectedRoute from '../components/ProtectedRoute';

// --- IMPORTS DES PAGES PUBLIQUES ---
import Home from '../pages/Home';
import EventsList from '../pages/EventsList';
import EventDetail from '../pages/EventDetail';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import InscriptionPage from '../pages/InscriptionPage';
import ForgotPassword from '../pages/ForgotPassword';

// --- IMPORTS DES PAGES CONNECTÉES (UTILISATEUR) ---
import Profile from '../pages/Profile';
import UserDashboard from '../pages/UserDashboard';
import MyRegistrations from '../pages/MyRegistrations';

// --- IMPORTS DES PAGES ORGANISATEUR ---
import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import OrganizerEventsList from '../pages/organizer/OrganizerEventsList';
import CreateEvent from '../pages/organizer/CreateEvent';
import EditEvent from '../pages/organizer/EditEvent';

// --- IMPORTS DES PAGES ADMIN ---
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminUserDetails from '../pages/admin/AdminUserDetails';
import AdminEntreprises from '../pages/admin/AdminEntreprises';
import AdminEvents from '../pages/admin/AdminEvents';

/**
 * ==============================================================================
 * DÉFINITION DU ROUTEUR (ROUTER)
 * ==============================================================================
 * C'est ici que nous définissons l'arborescence de navigation de notre site.
 * Chaque objet dans le tableau représente une "Route" (une URL accessible).
 */
export const router = createBrowserRouter([
  {
    // --- ROUTE RACINE "/" ---
    path: '/',
    
    // "element" définit quel composant afficher pour cette route.
    // Ici, on met MainLayout (Navbar + Footer) comme parent de toutes les pages.
    // Les pages enfants s'afficheront à la place du composant <Outlet /> dans MainLayout.
    element: <MainLayout />,
    
    // "children" contient toutes les sous-routes.
    children: [
      
      // --- PAGE D'ACCUEIL ---
      {
        index: true, // Signifie que c'est la page par défaut quand on est sur "/"
        element: <Home />,
      },

      // --- CATALOGUE ÉVÉNEMENTS ---
      {
        path: 'evenements', // URL: /evenements
        element: <EventsList />,
      },
      {
        // ":id" est un paramètre dynamique.
        // Exemple: /evenements/123 -> Dans la page, on récupère l'ID "123".
        path: 'evenements/:id', 
        element: <EventDetail />,
      },
      {
        path: 'evenements/:id/inscription',
        element: (
          // Cette route est PROTÉGÉE.
          // Si l'utilisateur n'est pas connecté, il sera redirigé vers /login.
          <ProtectedRoute>
            <InscriptionPage />
          </ProtectedRoute>
        ),
      },

      // --- PAGES STATIQUES & AUTHENTIFICATION ---
      {
        path: 'a-propos',
        element: <About />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },

      // --- ESPACE MEMBRE (Pour tout utilisateur connecté) ---
      {
        path: 'profil',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'mes-inscriptions',
        element: (
          <ProtectedRoute>
            <MyRegistrations />
          </ProtectedRoute>
        ),
      },

      // --- ESPACE ORGANISATEUR (Restreint par Rôle) ---
      // Ici, on ajoute la propriété "requiredRoles".
      // Seuls les utilisateurs ayant le rôle ORGANISATEUR ou ADMIN peuvent entrer.
      {
        path: 'organisateur/dashboard',
        element: (
          <ProtectedRoute requiredRoles={['ORGANISATEUR', 'ADMIN']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'organisateur/evenements',
        element: (
          <ProtectedRoute requiredRoles={['ORGANISATEUR', 'ADMIN']}>
            <OrganizerEventsList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'organisateur/evenements/nouveau',
        element: (
          <ProtectedRoute requiredRoles={['ORGANISATEUR', 'ADMIN']}>
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: 'organisateur/evenements/:id/edit', // Édition d'un événement spécifique
        element: (
          <ProtectedRoute requiredRoles={['ORGANISATEUR', 'ADMIN']}>
            <EditEvent />
          </ProtectedRoute>
        ),
      },

      // --- ESPACE ADMINISTRATION (Restreint ADMIN uniquement) ---
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/utilisateurs',
        element: (
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/utilisateurs/:id', // Vue détaillée d'un utilisateur
        element: (
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminUserDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/entreprises',
        element: (
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminEntreprises />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/evenements',
        element: (
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminEvents />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);