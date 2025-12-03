import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../pages/Home';
import EventsList from '../pages/EventsList';
import EventDetail from '../pages/EventDetail';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import UserDashboard from '../pages/UserDashboard';
import MyRegistrations from '../pages/MyRegistrations';

import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import OrganizerEventsList from '../pages/organizer/OrganizerEventsList';
import CreateEvent from '../pages/organizer/CreateEvent';
import EditEvent from '../pages/organizer/EditEvent';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminUserDetails from '../pages/admin/AdminUserDetails'; // Import de la nouvelle page
import AdminEntreprises from '../pages/admin/AdminEntreprises';
import AdminEvents from '../pages/admin/AdminEvents';
import InscriptionPage from '../pages/InscriptionPage';
import ForgotPassword from '../pages/ForgotPassword';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'evenements', element: <EventsList /> },
      { path: 'evenements/:id', element: <EventDetail /> },
      {
        path: 'evenements/:id/inscription',
        element: (
          <ProtectedRoute>
            <InscriptionPage />
          </ProtectedRoute>
        ),
      },
      { path: 'a-propos', element: <About /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
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
        path: 'organisateur/evenements/:id/edit',
        element: (
          <ProtectedRoute requiredRoles={['ORGANISATEUR', 'ADMIN']}>
            <EditEvent />
          </ProtectedRoute>
        ),
      },
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
      // --- NOUVELLE ROUTE DÉTAILS ---
      {
        path: 'admin/utilisateurs/:id',
        element: (
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminUserDetails />
          </ProtectedRoute>
        ),
      },
      // -----------------------------
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

      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
    ],
  },
]);