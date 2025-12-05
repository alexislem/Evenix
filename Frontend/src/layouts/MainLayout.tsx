import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * ==============================================================================
 * MAIN LAYOUT (GABARIT PRINCIPAL)
 * ==============================================================================
 * Ce composant définit la structure "squelette" de toutes les pages de notre site.
 * * Il contient les éléments qui ne changent JAMAIS, peu importe la page :
 * 1. La Navbar (en haut)
 * 2. Le Footer (en bas)
 * * Entre les deux, il y a une zone dynamique gérée par <Outlet />.
 */
const MainLayout: React.FC = () => {
  return (
    // "min-h-screen" : Le site prend au moins toute la hauteur de l'écran
    // "flex-col" : On empile les éléments verticalement (Haut -> Bas)
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100 font-sans">
      
      {/* La barre de navigation, toujours visible en haut */}
      <Navbar />

      {/* LE CONTENU PRINCIPAL
         "flex-grow" : C'est magique ! Cela dit à cette div de prendre 
         tout l'espace disponible restant.
         Si le contenu est court, cela pousse le Footer tout en bas de l'écran.
      */}
      <main className="flex-grow">
        
        {/* <Outlet /> est un composant spécial de React Router.
           C'est ici que sera injecté le contenu de la page actuelle.
           Exemple : 
           - Si l'URL est "/", <Outlet /> sera remplacé par <Home />
           - Si l'URL est "/login", <Outlet /> sera remplacé par <Login />
        */}
        <Outlet />
        
      </main>

      {/* Le pied de page, toujours visible en bas */}
      <Footer />
      
    </div>
  );
};

export default MainLayout;