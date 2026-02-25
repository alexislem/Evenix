import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';

const RegisterSelection = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-10">
          Bienvenue sur Evenix <br />
          <span className="text-blue-500 text-xl font-normal">Vous souhaitez...</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* CARTE PARTICIPANT -> Envoie vers /register?role=PARTICIPANT */}
          <Link to="/register?role=PARTICIPANT" className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition group text-center hover:bg-gray-750 cursor-pointer">
            <div className="bg-blue-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
              <User className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Participer</h3>
            <p className="text-gray-400">Je veux découvrir des événements et réserver mes places.</p>
          </Link>

          {/* CARTE ORGANISATEUR -> Envoie vers /register?role=ORGANISATEUR */}
          <Link to="/register?role=ORGANISATEUR" className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition group text-center hover:bg-gray-750 cursor-pointer">
            <div className="bg-purple-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
              <Calendar className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Organiser</h3>
            <p className="text-gray-400">Je veux créer, publier et gérer mes propres événements.</p>
          </Link>
        </div>
        
        <div className="text-center mt-12">
            <Link to="/login" className="text-gray-400 hover:text-white underline">J'ai déjà un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelection;