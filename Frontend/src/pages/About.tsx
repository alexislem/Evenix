import React from 'react';
import { Calendar, Target, Users, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">À propos d'Evenix</h1>
          <p className="text-xl text-gray-400">
            Votre partenaire de confiance pour l'organisation d'événements professionnels
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Notre Mission</h2>
          <p className="text-gray-300 leading-relaxed text-lg mb-4">
            Evenix est né de la volonté de simplifier et de moderniser la gestion d'événements
            professionnels. Notre plateforme permet aux organisateurs de créer, gérer et promouvoir
            leurs événements avec efficacité et professionnalisme.
          </p>
          <p className="text-gray-300 leading-relaxed text-lg">
            Nous croyons que chaque événement mérite une organisation sans faille et une expérience
            participant exceptionnelle. C'est pourquoi nous mettons à disposition des outils
            puissants et intuitifs pour répondre à tous vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <Target className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Notre Vision</h3>
            <p className="text-gray-300">
              Devenir la référence incontournable en matière de gestion d'événements en France,
              en offrant une plateforme complète et innovante.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <Users className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Notre Équipe</h3>
            <p className="text-gray-300">
              Une équipe passionnée de développeurs et experts en événementiel, dédiée à
              améliorer constamment votre expérience.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 rounded-2xl p-8 border border-gray-700">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-white text-center mb-6">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Innovation</h4>
              <p className="text-gray-300">
                Nous innovons constamment pour vous offrir les meilleures fonctionnalités.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Qualité</h4>
              <p className="text-gray-300">
                Nous garantissons un service de qualité supérieure et une fiabilité exemplaire.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Écoute</h4>
              <p className="text-gray-300">
                Nous sommes à l'écoute de vos besoins pour améliorer continuellement Evenix.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Une question ?</h3>
          <p className="text-gray-400 mb-6">
            Notre équipe est là pour vous accompagner dans tous vos projets.
          </p>
          <a
            href="mailto:contact@evenix.fr"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
