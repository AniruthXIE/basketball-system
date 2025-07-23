import React from 'react';
import ChampionBanner from '../components/ChampionBanner';
import GameBoard from '../components/GameBoard';
import QueueManager from '../components/QueueManager';
import GameStats from '../components/GameStats';

const HomePage = () => {
  return (
    <>
      {/* Live Status Banner */}
      <div className="relative bg-gradient-to-r from-red-500 via-pink-600 to-purple-700 text-white text-center py-4 rounded-2xl mb-6 shadow-2xl overflow-hidden animate-slideInUp border border-red-400/30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-400/20 to-purple-400/20 rounded-2xl"></div>
        <div className="relative flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full pulse-dot shadow-lg"></div>
          <span className="font-bold text-sm sm:text-lg drop-shadow-lg">🔴 LIVE - เกมกำลังดำเนินการ</span>
          <div className="w-3 h-3 bg-white rounded-full pulse-dot shadow-lg"></div>
        </div>
      </div>

      <ChampionBanner />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <GameBoard />
        <GameStats />
      </div>

      <QueueManager />
    </>
  );
};

export default HomePage;