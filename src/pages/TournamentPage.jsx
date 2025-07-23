import React, { useState } from 'react';
import { GAME_MODES, GAME_RULES } from '../config/gameRules';
import TournamentMode from '../components/TournamentMode';

const TournamentPage = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [showTournament, setShowTournament] = useState(false);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setShowTournament(true);
  };

  const handleBackToSelection = () => {
    setShowTournament(false);
    setSelectedMode(null);
  };

  if (showTournament && selectedMode) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <button 
            onClick={handleBackToSelection}
            className="text-gray-300 hover:text-white mb-4 flex items-center gap-2 mx-auto transition-colors"
          >
            ← กลับไปเลือกโหมด
          </button>
          <h1 className="text-4xl font-bold gold-text mb-3 drop-shadow-lg">
            {GAME_RULES[selectedMode].name}
          </h1>
          <p className="text-gray-300 text-lg">{GAME_RULES[selectedMode].description}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <TournamentMode gameMode={selectedMode} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gold-text mb-3 drop-shadow-lg">🏆 เลือกรูปแบบการแข่งขัน</h1>
        <p className="text-gray-300 text-lg">เลือกกฎการแข่งขันที่ต้องการ</p>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      {/* Game Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(GAME_RULES).map(([mode, config]) => (
          <div 
            key={mode}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 cursor-pointer card-hover"
            onClick={() => handleModeSelect(mode)}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">
                {mode === GAME_MODES.CASUAL ? '🏀' : 
                 mode === GAME_MODES.THREE_X_THREE ? '🥇' : '🏆'}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{config.name}</h2>
              <p className="text-gray-300 text-sm mb-4">{config.description}</p>
            </div>

            {/* Game Rules Preview */}
            <div className="space-y-2 mb-6">
              {config.rules.slice(0, 3).map((rule, index) => (
                <div key={index} className="text-gray-400 text-xs flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>{rule}</span>
                </div>
              ))}
              {config.rules.length > 3 && (
                <div className="text-gray-500 text-xs">และอีก {config.rules.length - 3} กฎ...</div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-yellow-400 text-xs">เวลา</div>
                <div className="text-white font-bold text-sm">
                  {Math.floor(config.gameTime / 60)} นาที
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-yellow-400 text-xs">แต้มชนะ</div>
                <div className="text-white font-bold text-sm">
                  {config.maxScore || 'ไม่จำกัด'}
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              เลือกโหมดนี้
            </button>
          </div>
        ))}
      </div>
      
      {/* Additional Info */}
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 text-center">📋 คำแนะนำ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div className="text-center">
            <div className="text-2xl mb-2">🏀</div>
            <strong className="text-white">บาสเย็น</strong>
            <p>เหมาะสำหรับเล่นสบายๆ ไม่เครียด</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🥇</div>
            <strong className="text-white">3x3 Basketball</strong>
            <p>เกมเร็ว เข้มข้น เหมาะกับพื้นที่เล็ก</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🏆</div>
            <strong className="text-white">5x5 Basketball</strong>
            <p>มาตรฐานสากล เหมาะกับการแข่งขันจริงจัง</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;