import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { soundManager } from '../utils/soundUtils';

const GameHeader = () => {
  const { updateGameState } = useGame();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const resetAllSystem = () => {
    if (confirm('🏀 รีเซ็ตระบบทั้งหมด?\n\n- ลบเกมปัจจุบัน\n- ลบคิวทั้งหมด\n- รีเซ็ตแชมป์\n- รีเซ็ตสถิติ\n\nแน่ใจไหม?')) {
      updateGameState({
        currentGame: {
          teamA: '',
          teamB: '',
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        },
        queue: [],
        champion: null,
        championDefenseStreak: 0,
        formerChampionName: null,
        teamWins: {},
        gameHistory: []
      });
      
      console.log('🔄 System reset completed!');
    }
  };

  const toggleSound = () => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
  };

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`${
              soundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
            } text-white px-3 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all text-sm`}
            title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-3 drop-shadow-lg">
          🏀 ระบบจัดคิวเล่นบาส
        </h1>
        
        <button
          onClick={resetAllSystem}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all text-sm"
          title="รีเซ็ตระบบทั้งหมด"
        >
          🔄 Reset
        </button>
      </div>
      <p className="text-white text-lg opacity-90">Real-time Basketball Queue & Scoreboard</p>
    </div>
  );
};

export default GameHeader;