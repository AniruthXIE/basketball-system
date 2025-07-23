import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { formatTime, isOvertime, getGameStatusText } from '../utils/gameUtils';
import { soundManager } from '../utils/soundUtils';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useScrollToGame } from '../hooks/useAutoScroll';
import { showCelebration } from './CelebrationModal';

const GameBoard = () => {
  const { 
    currentGame, 
    teamWins, 
    setCurrentGame, 
    updateGameState,
    handleGameEnd,
    isProcessingRef 
  } = useGame();
  
  const gameRef = useScrollToGame(currentGame);

  // Initialize sound manager
  useEffect(() => {
    soundManager.init();
  }, []);

  // Game control functions
  const startGame = () => {
    if (currentGame.teamA && currentGame.teamB) {
      setCurrentGame(prev => ({ ...prev, isPlaying: true }));
      soundManager.playStart();
    }
  };

  const pauseGame = () => {
    setCurrentGame(prev => ({ ...prev, isPlaying: false }));
  };

  const resetTimer = () => {
    setCurrentGame(prev => ({ 
      ...prev, 
      timeLeft: 420, 
      isPlaying: false,
      teamAScore: 0,
      teamBScore: 0 
    }));
  };

  const resetToOvertime = () => {
    setCurrentGame(prev => ({ 
      ...prev, 
      timeLeft: 60, 
      isPlaying: false
    }));
  };

  const setTeamNames = (teamA, teamB) => {
    setCurrentGame(prev => ({
      ...prev,
      teamA,
      teamB
    }));
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    toggleGame: () => {
      if (currentGame.teamA && currentGame.teamB) {
        if (currentGame.isPlaying) {
          pauseGame();
        } else {
          startGame();
        }
      }
    },
    resetGame: resetTimer,
    teamAScore: () => updateScore(1, 1),
    teamBScore: () => updateScore(2, 1)
  });

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (currentGame.isPlaying && currentGame.timeLeft > 0) {
      interval = setInterval(() => {
        setCurrentGame(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (currentGame.timeLeft === 0 && currentGame.isPlaying) {
      // Time's up - determine winner and stop the game
      setCurrentGame(prev => ({ ...prev, isPlaying: false }));
      soundManager.playBuzzer();
      // Use setTimeout to prevent multiple calls
      setTimeout(() => handleGameEnd(), 100);
    }
    return () => clearInterval(interval);
  }, [currentGame.isPlaying, currentGame.timeLeft, setCurrentGame, handleGameEnd]);

  // Score management with sound effects
  const updateScore = (team, increment) => {
    setCurrentGame(prev => {
      const newScore = Math.max(0, prev[team === 1 ? 'teamAScore' : 'teamBScore'] + increment);
      const updatedGame = {
        ...prev,
        [team === 1 ? 'teamAScore' : 'teamBScore']: newScore
      };
      
      // Play sound for scoring
      if (increment > 0) {
        soundManager.playScore();
      }
      
      // Check if someone reached 15 points - instant win
      if (newScore >= 15) {
        const finalGame = { ...updatedGame, isPlaying: false };
        
        // Use setTimeout to prevent multiple calls and ensure state is updated
        setTimeout(() => {
          setCurrentGame(finalGame);
          // Call handleGameEnd only once after state update
          setTimeout(() => handleGameEnd(), 200);
        }, 100);
        
        return finalGame;
      }
      
      return updatedGame;
    });
  };

  if (!currentGame.teamA || !currentGame.teamB) {
    return (
      <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              🏀
            </div>
            <h2 className="text-3xl font-bold">เกมปัจจุบัน</h2>
          </div>
        </div>

        <div className="text-center py-12 bg-gray-800 rounded-xl border-2 border-dashed border-gray-600">
          <div className="mb-6">
            <div className="text-6xl mb-4">⚡</div>
            <p className="text-xl text-gray-300 mb-6">พร้อมเริ่มเกมใหม่!</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="ทีม A"
              className="px-4 py-3 border rounded-xl text-white bg-gray-700 placeholder-gray-300 font-medium text-center text-lg"
              id="teamA-input"
            />
            <div className="text-2xl font-bold text-orange-400 self-center">VS</div>
            <input
              type="text"
              placeholder="ทีม B"
              className="px-4 py-3 border rounded-xl text-white bg-gray-700 placeholder-gray-300 font-medium text-center text-lg"
              id="teamB-input"
            />
          </div>
          <button
            onClick={() => {
              const teamA = document.getElementById('teamA-input').value;
              const teamB = document.getElementById('teamB-input').value;
              if (teamA && teamB) setTeamNames(teamA, teamB);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
          >
            🚀 เริ่มเกม!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={gameRef} className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 text-white">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            🏀
          </div>
          <h2 className="text-3xl font-bold">เกมปัจจุบัน</h2>
        </div>
      </div>

      {/* Timer Display */}
      <div className="mb-4">
        <div className={`bg-gradient-to-br ${isOvertime(currentGame.timeLeft) ? 'from-orange-600 to-orange-700' : 'from-red-600 to-red-700'} rounded-xl p-4 shadow-inner ${isOvertime(currentGame.timeLeft) ? 'animate-pulse' : ''}`}>
          <div className="text-center">
            <div className="text-sm text-red-200 mb-1">
              {isOvertime(currentGame.timeLeft) ? '⚡ ต่อเวลา!' : '⏰ เวลาที่เหลือ'}
            </div>
            <div className="text-4xl font-mono font-bold text-white drop-shadow-lg">
              {formatTime(currentGame.timeLeft)}
            </div>
            <div className="text-red-200 mt-1 text-sm">
              {getGameStatusText(currentGame.isPlaying, currentGame.timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* Team Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center mb-4">
        {/* Team A */}
        <div className="text-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 shadow-lg">
          <h3 className="text-lg font-bold mb-2 text-blue-100 truncate">{currentGame.teamA}</h3>
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{currentGame.teamAScore}</div>
          <div className="flex items-center justify-center gap-1 text-blue-200 mb-2">
            <span className="text-sm">🏆 {teamWins[currentGame.teamA]?.size || 0}/2 ทีม</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => updateScore(1, 1)}
              className="bg-green-500 text-white px-3 py-3 rounded-lg hover:bg-green-600 font-bold shadow-md transform hover:scale-105 transition-all text-sm"
            >
              +1
            </button>
            <button
              onClick={() => updateScore(1, 2)}
              className="bg-green-600 text-white px-3 py-3 rounded-lg hover:bg-green-700 font-bold shadow-md transform hover:scale-105 transition-all text-sm"
            >
              +2 🔥
            </button>
            <button
              onClick={() => updateScore(1, 3)}
              className="bg-purple-600 text-white px-3 py-3 rounded-lg hover:bg-purple-700 font-bold shadow-md transform hover:scale-105 transition-all text-sm"
            >
              +3 ⭐
            </button>
            <button
              onClick={() => updateScore(1, -1)}
              className="bg-red-500 text-white px-3 py-3 rounded-lg hover:bg-red-600 font-bold shadow-md text-sm"
            >
              -1
            </button>
          </div>
        </div>

        {/* VS & Controls */}
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400 mb-3 drop-shadow-lg">⚡ VS ⚡</div>
          <div className="space-y-2">
            {!currentGame.isPlaying ? (
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center gap-1 mx-auto font-bold shadow-lg transform hover:scale-105 transition-all text-sm"
              >
                <Play className="w-4 h-4" />
                🚀 เริ่ม
              </button>
            ) : (
              <button
                onClick={pauseGame}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 flex items-center gap-1 mx-auto font-bold shadow-lg transform hover:scale-105 transition-all text-sm"
              >
                <Pause className="w-4 h-4" />
                ⏸️ หยุด
              </button>
            )}
            <button
              onClick={resetTimer}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center gap-1 mx-auto font-bold shadow-lg transform hover:scale-105 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              🔄 รีเซ็ต
            </button>
            {(currentGame.teamAScore === currentGame.teamBScore && currentGame.timeLeft === 0 && !isOvertime(currentGame.timeLeft)) && (
              <button
                onClick={resetToOvertime}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 flex items-center gap-1 mx-auto font-bold shadow-lg transform hover:scale-105 transition-all text-sm mt-2"
              >
                ⚡ เริ่ม Overtime
              </button>
            )}
          </div>
        </div>

        {/* Team B */}
        <div className="text-center bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 shadow-lg">
          <h3 className="text-lg font-bold mb-2 text-red-100 truncate">{currentGame.teamB}</h3>
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{currentGame.teamBScore}</div>
          <div className="flex items-center justify-center gap-1 text-red-200 mb-2">
            <span className="text-sm">🏆 {teamWins[currentGame.teamB]?.size || 0}/2 ทีม</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => updateScore(2, 1)}
              className="bg-green-500 text-white px-3 py-3 rounded-lg hover:bg-green-600 font-bold shadow-md transform hover:scale-105 transition-all text-sm"
            >
              +1
            </button>
            <button
              onClick={() => updateScore(2, 2)}
              className="bg-green-600 text-white px-3 py-3 rounded-lg hover:bg-green-700 font-bold shadow-md transform hover:scale-105 transition-all text-sm"
            >
              +2 🔥
            </button>
            <button
              onClick={() => updateScore(2, 3)}
              className="bg-purple-600 text-white px-3 py-3 rounded-lg hover:bg-purple-700 font-bold shadow-md transform hover:scale-105 transition-all text-sm"
            >
              +3 ⭐
            </button>
            <button
              onClick={() => updateScore(2, -1)}
              className="bg-red-500 text-white px-3 py-3 rounded-lg hover:bg-red-600 font-bold shadow-md text-sm"
            >
              -1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;