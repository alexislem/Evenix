import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogIn, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin, isOrganisateur } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:text-blue-400 transition">
            <Calendar className="w-8 h-8" />
            <span>Evenix</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-400 transition">
              Accueil
            </Link>
            <Link to="/evenements" className="hover:text-blue-400 transition">
              Événements
            </Link>
            <Link to="/a-propos" className="hover:text-blue-400 transition">
              À propos
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    isAdmin
                      ? '/admin/dashboard'
                      : isOrganisateur
                      ? '/organisateur/dashboard'
                      : '/dashboard'
                  }
                  className="flex items-center space-x-2 hover:text-blue-400 transition"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <Link
                  to="/profil"
                  className="flex items-center space-x-2 hover:text-blue-400 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user?.prenom}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 hover:text-blue-400 transition"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden md:inline">Connexion</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
