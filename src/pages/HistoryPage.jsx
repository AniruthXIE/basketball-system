import React from 'react';
import GameHistory from '../components/GameHistory';
import GameRules from '../components/GameRules';

const HistoryPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gold-text mb-3 drop-shadow-lg">📊 ประวัติและกฎการแข่งขัน</h1>
        <p className="text-gray-300 text-lg">ดูประวัติการแข่งขันและกฎของเกม</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      <GameHistory />
      <GameRules />
    </div>
  );
};

export default HistoryPage;