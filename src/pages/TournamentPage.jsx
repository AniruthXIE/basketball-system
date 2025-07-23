import React from 'react';
import TournamentMode from '../components/TournamentMode';

const TournamentPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gold-text mb-3 drop-shadow-lg">🏆 ระบบทัวร์นาเมนต์</h1>
        <p className="text-gray-300 text-lg">จัดการการแข่งขันแบบ Tournament Bracket</p>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      <TournamentMode />
    </div>
  );
};

export default TournamentPage;