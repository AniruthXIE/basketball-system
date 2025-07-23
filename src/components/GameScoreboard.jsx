import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Users, Trophy } from 'lucide-react';
import { GAME_MODES, getGameConfig, isGameComplete, getWinner, formatGameTime } from '../config/gameRules';
import { soundManager } from '../utils/soundUtils';

const GameScoreboard = ({ gameMode = GAME_MODES.CASUAL, onGameEnd, initialTeamA = '', initialTeamB = '' }) => {
  const config = getGameConfig(gameMode);
  
  const [currentGame, setCurrentGame] = useState({
    teamA: initialTeamA,
    teamB: initialTeamB,
    teamAScore: 0,
    teamBScore: 0,
    isPlaying: false,
    timeLeft: config.gameTime,
    quarter: 1,
    isHalftime: false
  });

  const [shotClock, setShotClock] = useState(config.shotClock || 0);
  const [timeouts, setTimeouts] = useState({
    teamA: config.timeouts || 0,
    teamB: config.timeouts || 0
  });

  // Initialize sound manager
  useEffect(() => {
    soundManager.init();
  }, []);

  // Game timer
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
      setCurrentGame(prev => ({ ...prev, isPlaying: false }));
      soundManager.playBuzzer();
      setTimeout(() => handleGameEnd(), 100);
    }
    return () => clearInterval(interval);
  }, [currentGame.isPlaying, currentGame.timeLeft]);

  // Shot clock timer
  useEffect(() => {
    let interval = null;
    if (currentGame.isPlaying && shotClock > 0 && config.shotClock) {
      interval = setInterval(() => {
        setShotClock(prev => {
          if (prev <= 1) {
            soundManager.playBuzzer();
            return config.shotClock; // Reset shot clock
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentGame.isPlaying, shotClock, config.shotClock]);

  // Check game completion
  useEffect(() => {
    if (isGameComplete(gameMode, currentGame.teamAScore, currentGame.teamBScore, currentGame.timeLeft)) {
      if (currentGame.isPlaying) {
        handleGameEnd();
      }
    }
  }, [currentGame.teamAScore, currentGame.teamBScore, currentGame.timeLeft, gameMode]);

  const handleGameEnd = () => {
    const winner = getWinner(currentGame.teamAScore, currentGame.teamBScore);
    if (winner && onGameEnd) {
      onGameEnd({
        winner: winner === 'A' ? currentGame.teamA : currentGame.teamB,
        loser: winner === 'A' ? currentGame.teamB : currentGame.teamA,
        score: `${currentGame.teamAScore}-${currentGame.teamBScore}`,
        mode: gameMode
      });
    }
  };

  const updateScore = (team, increment) => {
    setCurrentGame(prev => {
      const newScore = Math.max(0, prev[team === 'A' ? 'teamAScore' : 'teamBScore'] + increment);
      const updatedGame = {
        ...prev,
        [team === 'A' ? 'teamAScore' : 'teamBScore']: newScore
      };
      
      if (increment > 0) {
        soundManager.playScore();
        // Reset shot clock on score
        if (config.shotClock) {
          setShotClock(config.shotClock);
        }
      }
      
      return updatedGame;
    });
  };

  const startGame = () => {
    if (currentGame.teamA && currentGame.teamB) {
      setCurrentGame(prev => ({ ...prev, isPlaying: true }));
      soundManager.playStart();
    }
  };

  const pauseGame = () => {
    setCurrentGame(prev => ({ ...prev, isPlaying: false }));
  };

  const resetGame = () => {
    setCurrentGame({
      teamA: '',
      teamB: '',
      teamAScore: 0,
      teamBScore: 0,
      isPlaying: false,
      timeLeft: config.gameTime,
      quarter: 1,
      isHalftime: false
    });
    setShotClock(config.shotClock || 0);
    setTimeouts({
      teamA: config.timeouts || 0,
      teamB: config.timeouts || 0
    });
  };

  const useTimeout = (team) => {
    if (timeouts[team] > 0) {
      setTimeouts(prev => ({
        ...prev,
        [team]: prev[team] - 1
      }));
      
      // Pause game for timeout duration
      setCurrentGame(prev => ({ ...prev, isPlaying: false }));
      
      // Auto resume after timeout (or manual)
      if (config.timeoutDuration) {
        setTimeout(() => {
          // Could add timeout timer here
        }, config.timeoutDuration * 1000);
      }
    }
  };

  const setTeamNames = (teamA, teamB) => {
    setCurrentGame(prev => ({
      ...prev,
      teamA,
      teamB
    }));
  };

  const timeDisplay = formatGameTime(currentGame.timeLeft, gameMode);

  if (!currentGame.teamA || !currentGame.teamB) {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white border border-white/10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
              {gameMode === GAME_MODES.THREE_X_THREE ? '🥇' : 
               gameMode === GAME_MODES.FIVE_X_FIVE ? '🏆' : '🏀'}
            </div>
            <h2 className="text-3xl font-bold">{config.name}</h2>
          </div>
          <p className="text-gray-300 mb-4">{config.description}</p>
        </div>

        {/* Game Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold text-yellow-400 mb-2">⚡ กฎสำคัญ</h3>
            <div className="space-y-1 text-sm text-gray-300">
              {config.rules.slice(0, 3).map((rule, index) => (
                <div key={index}>{rule}</div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold text-yellow-400 mb-2">📊 ข้อมูลเกม</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <div>⏰ เวลา: {Math.floor(config.gameTime / 60)} นาที</div>
              <div>🎯 แต้มชนะ: {config.maxScore || 'ไม่จำกัด'}</div>
              {config.shotClock && <div>⏱️ Shot Clock: {config.shotClock} วินาที</div>}
              {config.timeouts > 0 && <div>⏸️ Timeout: {config.timeouts} ครั้ง</div>}
            </div>
          </div>
        </div>

        <div className="text-center py-8 bg-white/5 rounded-xl">
          <div className="mb-6">
            <div className="text-4xl mb-4">⚡</div>
            <p className="text-xl text-gray-300 mb-6">พร้อมเริ่มเกม!</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="ทีม A"
              className="px-4 py-3 border rounded-xl text-white bg-black/40 placeholder-gray-300 font-medium text-center text-lg backdrop-blur-sm border-white/20"
              id="teamA-input"
            />
            <div className="text-2xl font-bold text-yellow-400 self-center">VS</div>
            <input
              type="text"
              placeholder="ทีม B"
              className="px-4 py-3 border rounded-xl text-white bg-black/40 placeholder-gray-300 font-medium text-center text-lg backdrop-blur-sm border-white/20"
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
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white border border-white/10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
            {gameMode === GAME_MODES.THREE_X_THREE ? '🥇' : 
             gameMode === GAME_MODES.FIVE_X_FIVE ? '🏆' : '🏀'}
          </div>
          <h2 className="text-3xl font-bold">{config.name}</h2>
        </div>
      </div>

      {/* Timer Display */}
      <div className="mb-4">
        <div className={`bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 shadow-inner ${currentGame.timeLeft <= 60 ? 'animate-pulse' : ''}`}>
          <div className="text-center">
            <div className="text-sm text-red-200 mb-1">
              {gameMode === GAME_MODES.FIVE_X_FIVE ? `Quarter ${timeDisplay.quarter}` : '⏰ เวลาที่เหลือ'}
            </div>
            <div className="text-4xl font-mono font-bold text-white drop-shadow-lg">
              {timeDisplay.display}
            </div>
            {config.shotClock && (
              <div className="text-yellow-300 mt-2 text-lg font-bold">
                Shot Clock: {shotClock}s
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center mb-4">
        {/* Team A */}
        <div className="text-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 shadow-lg">
          <h3 className="text-lg font-bold mb-2 text-blue-100 truncate">{currentGame.teamA}</h3>
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{currentGame.teamAScore}</div>
          
          {/* Timeout display */}
          {config.timeouts > 0 && (
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: timeouts.teamA }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-blue-200 rounded-full"></div>
              ))}
              {Array.from({ length: config.timeouts - timeouts.teamA }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-blue-800 rounded-full"></div>
              ))}
            </div>
          )}
          
          {/* Score buttons */}
          <div className="grid grid-cols-2 gap-1">
            {config.scoringSystem.map(points => (
              <button
                key={points}
                onClick={() => updateScore('A', points)}
                className={`text-white px-3 py-2 rounded-lg font-bold shadow-md transform hover:scale-105 transition-all text-sm ${
                  points === 1 ? 'bg-green-500 hover:bg-green-600' :
                  points === 2 ? 'bg-green-600 hover:bg-green-700' :
                  'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                +{points}{points === 2 ? ' 🔥' : points === 3 ? ' ⭐' : ''}
              </button>
            ))}
            <button
              onClick={() => updateScore('A', -1)}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-bold shadow-md text-sm"
            >
              -1
            </button>
            {config.timeouts > 0 && timeouts.teamA > 0 && (
              <button
                onClick={() => useTimeout('teamA')}
                className="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-600 font-bold shadow-md text-sm"
              >
                TO
              </button>
            )}
          </div>
        </div>

        {/* VS & Controls */}
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-3 drop-shadow-lg">⚡ VS ⚡</div>
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
              onClick={resetGame}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center gap-1 mx-auto font-bold shadow-lg transform hover:scale-105 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              🔄 รีเซ็ต
            </button>
          </div>
        </div>

        {/* Team B */}
        <div className="text-center bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 shadow-lg">
          <h3 className="text-lg font-bold mb-2 text-red-100 truncate">{currentGame.teamB}</h3>
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{currentGame.teamBScore}</div>
          
          {/* Timeout display */}
          {config.timeouts > 0 && (
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: timeouts.teamB }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-red-200 rounded-full"></div>
              ))}
              {Array.from({ length: config.timeouts - timeouts.teamB }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-red-800 rounded-full"></div>
              ))}
            </div>
          )}
          
          {/* Score buttons */}
          <div className="grid grid-cols-2 gap-1">
            {config.scoringSystem.map(points => (
              <button
                key={points}
                onClick={() => updateScore('B', points)}
                className={`text-white px-3 py-2 rounded-lg font-bold shadow-md transform hover:scale-105 transition-all text-sm ${
                  points === 1 ? 'bg-green-500 hover:bg-green-600' :
                  points === 2 ? 'bg-green-600 hover:bg-green-700' :
                  'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                +{points}{points === 2 ? ' 🔥' : points === 3 ? ' ⭐' : ''}
              </button>
            ))}
            <button
              onClick={() => updateScore('B', -1)}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-bold shadow-md text-sm"
            >
              -1
            </button>
            {config.timeouts > 0 && timeouts.teamB > 0 && (
              <button
                onClick={() => useTimeout('teamB')}
                className="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-600 font-bold shadow-md text-sm"
              >
                TO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScoreboard;