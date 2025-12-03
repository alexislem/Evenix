import React from 'react';
import { Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Evenix</span>
            </div>
            <p className="text-sm">
              La plateforme de gestion d'événements professionnels pour toutes vos occasions.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/evenements" className="hover:text-blue-400 transition">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-blue-400 transition">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Compte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-blue-400 transition">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-400 transition">
                  Inscription
                </Link>
              </li>
              <li>
                <Link to="/profil" className="hover:text-blue-400 transition">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@evenix.fr</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Evenix. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
