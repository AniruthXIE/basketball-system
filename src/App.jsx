// Add at the top level with ref to prevent React re-render issues
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, X, Trophy, Clock, Users } from 'lucide-react';
import './App.css';

// Remove global variable and use React ref instead
const BasketballQueueSystem = () => {
  // Processing guard using useRef to persist across re-renders
  const isProcessingRef = useRef(false);
  
  // Simplified game state
  const [currentGame, setCurrentGame] = useState({
    teamA: '',
    teamB: '',
    teamAScore: 0,
    teamBScore: 0,
    isPlaying: false,
    timeLeft: 420, // 7 minutes in seconds
  });

  // Simplified queue management
  const [queue, setQueue] = useState([]);
  const [champion, setChampion] = useState(null);
  const [championDefenseStreak, setChampionDefenseStreak] = useState(0); // Track consecutive wins for returning champion
  const [formerChampionName, setFormerChampionName] = useState(null); // Track who the former champion is
  const [teamWins, setTeamWins] = useState({}); // Track how many different teams each team has defeated
  
  // UI state
  const [newPlayer, setNewPlayer] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);

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
      // Use setTimeout to prevent multiple calls
      setTimeout(() => handleGameEnd(), 100);
    }
    return () => clearInterval(interval);
  }, [currentGame.isPlaying, currentGame.timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOvertime = () => {
    return currentGame.timeLeft <= 60 && currentGame.timeLeft > 0;
  };

  // Enhanced game end logic with champion defense system
  const handleGameEnd = () => {
    // Prevent multiple executions using ref
    if (isProcessingRef.current) {
      console.log('⚠️ Already processing game end, skipping...');
      return;
    }
    
    isProcessingRef.current = true;
    
    const { teamA, teamB, teamAScore, teamBScore } = currentGame;
    
    // Determine winner
    let winner, loser;
    if (teamAScore > teamBScore) {
      winner = teamA;
      loser = teamB;
    } else if (teamBScore > teamAScore) {
      winner = teamB;
      loser = teamA;
    } else {
      // Tie - go to overtime
      setCurrentGame(prev => ({
        ...prev,
        timeLeft: 60,
        isPlaying: false
      }));
      isProcessingRef.current = false;
      return;
    }

    console.log(`🎯 Game ended: ${winner} beats ${loser}`);
    
    // Check if this is a former champion defending their title
    const isFormerChampionDefending = champion === null && formerChampionName && (winner === formerChampionName);
    
    if (isFormerChampionDefending) {
      // Former champion won and is trying to reclaim title
      console.log(`🛡️ Former champion ${winner} defending! Current streak: ${championDefenseStreak}`);
      
      const newStreak = championDefenseStreak + 1;
      
      if (newStreak >= 2) {
        // Former champion reclaims title!
        console.log(`👑 ${winner} reclaims CHAMPION title after 2 consecutive wins!`);
        setChampion(winner);
        setChampionDefenseStreak(0); // Reset defense streak to 0 when becoming champion
        setFormerChampionName(null); // Clear former champion name
        
        // Show celebration
        setTimeout(() => {
          showWinCelebration(winner, true, `กลับมาเป็นแชมป์อีกครั้ง! (${newStreak} ชนะติด)`);
        }, 500);
        
        // Start next match after celebration
        setTimeout(() => {
          startNextMatch(winner, loser);
          isProcessingRef.current = false;
        }, 3000);
        
        return;
      } else {
        // Continue defense streak
        setChampionDefenseStreak(newStreak);
        
        setTimeout(() => {
          showWinCelebration(winner, false, `ป้องกันตำแหน่ง ${newStreak}/2`);
        }, 500);
        
        setTimeout(() => {
          continueMatch(winner, loser);
          isProcessingRef.current = false;
        }, 3000);
        
        return;
      }
    } else if (champion === null && formerChampionName && loser === formerChampionName) {
      // Former champion lost - reset tracking
      console.log(`💔 Former champion ${loser} lost! Defense attempt failed.`);
      setFormerChampionName(null);
      setChampionDefenseStreak(0);
    }

    // Normal game logic - update wins tracking
    setTeamWins(prev => {
      const newWins = { ...prev };
      if (!newWins[winner]) {
        newWins[winner] = new Set();
      }
      newWins[winner].add(loser);
      
      // Check if winner becomes NEW champion (beat 2 different teams)
      if (newWins[winner].size >= 2) {
        console.log(`🏆 ${winner} becomes CHAMPION!`);
        setChampion(winner);
        setChampionDefenseStreak(0); // Reset defense streak to 0 for new champion
        setFormerChampionName(null); // Clear former champion name
        
        // Show celebration
        setTimeout(() => {
          showWinCelebration(winner, true);
        }, 500);
        
        // Start next match after celebration
        setTimeout(() => {
          startNextMatch(winner, loser);
          isProcessingRef.current = false;
        }, 3000);
      } else {
        console.log(`🎮 ${winner} wins but not champion yet (${newWins[winner].size}/2)`);
        
        // Show regular win celebration
        setTimeout(() => {
          showWinCelebration(winner, false);
        }, 500);
        
        // Check if there's a waiting champion FIRST
        setTimeout(() => {
          if (champion) {
            // There's a champion waiting - they should come back and challenge the winner
            console.log(`👑 Champion ${champion} returns to challenge winner ${winner}!`);
            championReturns(winner, loser);
          } else {
            // No champion waiting, continue normal flow
            continueMatch(winner, loser);
          }
          isProcessingRef.current = false;
        }, 3000);
      }
      
      return newWins;
    });
  };

  // Start next match when someone becomes champion - FIXED queue logic  
  const startNextMatch = (champion, defeated) => {
    console.log(`🔄 Champion ${champion} sits out, starting next match`);
    console.log(`📋 Current queue before: [${queue.join(', ')}]`);
    
    // Add defeated player to back of queue
    const newQueue = [...queue, defeated];
    console.log(`📋 Queue after adding defeated: [${newQueue.join(', ')}]`);
    
    if (newQueue.length >= 2) {
      // Start match with next 2 in queue
      const team1 = newQueue[0];
      const team2 = newQueue[1];
      
      console.log(`🆚 Next match: ${team1} vs ${team2}`);
      
      // Remove the 2 who are now playing
      const remainingQueue = newQueue.slice(2);
      console.log(`📋 Remaining queue after match starts: [${remainingQueue.join(', ')}]`);
      
      // Use setTimeout to prevent duplicate execution
      setTimeout(() => {
        setQueue(remainingQueue);
        setCurrentGame({
          teamA: team1,
          teamB: team2,
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        });
      }, 50);
      
    } else if (newQueue.length === 1) {
      // Only 1 person left, champion comes back to play them
      console.log(`👑 ${champion} comes back to play ${newQueue[0]} (only 1 left)`);
      
      setTimeout(() => {
        setQueue([]); // Clear queue since both are playing
        setChampion(null); // Champion is no longer waiting
        setCurrentGame({
          teamA: champion,
          teamB: newQueue[0],
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        });
      }, 50);
      
    } else {
      // No one left, champion waits alone
      console.log(`😴 No one left, champion ${champion} waits`);
      
      setTimeout(() => {
        setQueue([]);
        setCurrentGame({
          teamA: champion,
          teamB: '',
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        });
      }, 50);
    }
  };

  // Enhanced champion returns with defense streak
  // 🔁 championReturns: รีเซ็ตแชมป์ทันทีเมื่อลงแข่ง
const championReturns = (winner, loser) => {
  const currentChampion = champion;
  console.log(`🎯 Champion ${currentChampion} returns to challenge ${winner}!`);

  const newQueue = [...queue, loser];

  setTimeout(() => {
    setQueue(newQueue);
    setFormerChampionName(currentChampion); // Track who the former champion is
    setChampion(null); // ⛔️ รีเซ็ตแชมป์ที่รอให้กลายเป็น null
    setChampionDefenseStreak(0); // Start fresh defense streak when champion returns
    setCurrentGame({
      teamA: currentChampion,
      teamB: winner,
      teamAScore: 0,
      teamBScore: 0,
      isPlaying: false,
      timeLeft: 420
    });

    console.log(`🛡️ Former champion ${currentChampion} must win 2 consecutive games to reclaim title!`);
  }, 50);
};


  // Continue match when winner is not champion yet - FIXED queue logic
  const continueMatch = (winner, loser) => {
    console.log(`➡️ ${winner} continues playing`);
    console.log(`📋 Current queue before: [${queue.join(', ')}]`);
    
    // Add loser to back of queue first
    const newQueue = [...queue, loser];
    console.log(`📋 Queue after adding loser: [${newQueue.join(', ')}]`);
    
    if (newQueue.length > 0) {
      // Winner plays next person in queue
      const nextOpponent = newQueue[0];
      console.log(`🎮 ${winner} vs ${nextOpponent} (next opponent)`);
      
      // Remove the opponent from queue (they're now playing)
      const remainingQueue = newQueue.slice(1);
      console.log(`📋 Remaining queue: [${remainingQueue.join(', ')}]`);
      
      // Use setTimeout to prevent duplicate execution
      setTimeout(() => {
        setQueue(remainingQueue);
        setCurrentGame({
          teamA: winner,
          teamB: nextOpponent,
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        });
      }, 50);
    } else {
      // No one left, winner waits (shouldn't happen in normal flow)
      console.log(`😴 No one in queue, ${winner} waits`);
      setTimeout(() => {
        setQueue(newQueue);
        setCurrentGame({
          teamA: winner,
          teamB: '',
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        });
      }, 50);
    }
  };

  // Score management with debounce to prevent multiple calls
  const updateScore = (team, increment) => {
    setCurrentGame(prev => {
      const newScore = Math.max(0, prev[team === 1 ? 'teamAScore' : 'teamBScore'] + increment);
      const updatedGame = {
        ...prev,
        [team === 1 ? 'teamAScore' : 'teamBScore']: newScore
      };
      
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

  const startGame = () => {
    if (currentGame.teamA && currentGame.teamB) {
      setCurrentGame(prev => ({ ...prev, isPlaying: true }));
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

  // Queue management
  const addToQueue = () => {
    if (newPlayer.trim() && !queue.includes(newPlayer.trim())) {
      setQueue(prev => [...prev, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  const startNewMatch = () => {
    if (queue.length >= 2) {
      setCurrentGame({
        teamA: queue[0],
        teamB: queue[1],
        teamAScore: 0,
        teamBScore: 0,
        isPlaying: false,
        timeLeft: 420
      });
      setQueue(prev => prev.slice(2));
      
      // Reset all game state including defense streak
      setChampion(null);
      setChampionDefenseStreak(0);
      setFormerChampionName(null);
      setTeamWins({});
    }
  };

  const setTeamNames = (teamA, teamB) => {
    setCurrentGame(prev => ({
      ...prev,
      teamA,
      teamB
    }));
  };

  // Enhanced celebration function
  const showWinCelebration = (winner, isChampion, extraMessage = '') => {
    setCelebrationData({
      winner,
      isChampion,
      extraMessage
    });
    setShowCelebration(true);
    
    // Auto close after 4 seconds
    setTimeout(() => {
      setShowCelebration(false);
      setCelebrationData(null);
    }, 4000);
  };

  const closeCelebration = () => {
    setShowCelebration(false);
    setCelebrationData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-amber-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3 drop-shadow-lg">
            🏀 ระบบจัดคิวเล่นบาส
          </h1>
          <p className="text-white text-lg opacity-90">Real-time Basketball Queue & Scoreboard</p>
        </div>

        {/* Live Status Banner */}
        <div className="bg-red-600 text-white text-center py-3 rounded-xl mb-6 shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold text-lg">🔴 LIVE - เกมกำลังดำเนินการ</span>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

                    {/* Champion Defense Streak Display */}
            {championDefenseStreak > 0 && (
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-xl p-4 mb-6 shadow-lg animate-pulse">
                <div className="flex items-center justify-center gap-3">
                  <div className="text-2xl">🛡️</div>
                  <div className="text-center">
                    <span className="font-bold text-xl block">อดีตแชมป์กำลังป้องกัน!</span>
                    <span className="text-purple-200 text-sm">ชนะ {championDefenseStreak}/2 เกม (ต้องชนะ 2 เกมติดกันเพื่อกลับมาเป็นแชมป์)</span>
                  </div>
                  <div className="text-2xl">⚔️</div>
                </div>
              </div>
            )}

        {/* Champion Banner */}
        {champion && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-xl p-4 mb-6 shadow-lg animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-800" />
              <span className="font-bold text-2xl">🏆 แชมป์เปี้ยน: {champion}</span>
              <Trophy className="w-8 h-8 text-yellow-800" />
              <div className="text-3xl animate-bounce">🎆</div>
            </div>
            <div className="text-center mt-2 text-yellow-800 text-sm">
              กำลังพักรอ - รอคู่ถัดไปจบแล้วจึงกลับมาเล่น
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Current Game - Main Display */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 text-white">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  🏀
                </div>
                <h2 className="text-3xl font-bold">เกมปัจจุบัน</h2>
              </div>
            </div>

            {!currentGame.teamA || !currentGame.teamB ? (
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
            ) : (
              <>
                {/* Timer Display */}
                <div className="mb-4">
                  <div className={`bg-gradient-to-br ${isOvertime() ? 'from-orange-600 to-orange-700' : 'from-red-600 to-red-700'} rounded-xl p-4 shadow-inner ${isOvertime() ? 'animate-pulse' : ''}`}>
                    <div className="text-center">
                      <div className="text-sm text-red-200 mb-1">
                        {isOvertime() ? '⚡ ต่อเวลา!' : '⏰ เวลาที่เหลือ'}
                      </div>
                      <div className="text-4xl font-mono font-bold text-white drop-shadow-lg">
                        {formatTime(currentGame.timeLeft)}
                      </div>
                      <div className="text-red-200 mt-1 text-sm">
                        {isOvertime() ? '🔥 OVERTIME' : (currentGame.isPlaying ? '⚡ กำลังเล่น' : '⏸️ หยุดชั่วคราว')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Scores */}
                <div className="grid grid-cols-3 gap-3 items-center mb-4">
                  {/* Team A */}
                  <div className="text-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 shadow-lg">
                    <h3 className="text-lg font-bold mb-2 text-blue-100">{currentGame.teamA}</h3>
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
                      {(currentGame.teamAScore === currentGame.teamBScore && currentGame.timeLeft === 0 && !isOvertime()) && (
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
                    <h3 className="text-lg font-bold mb-2 text-red-100">{currentGame.teamB}</h3>
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
              </>
            )}
          </div>

          {/* Side Panel - Queue & Stats */}
          <div className="space-y-6">
            
            {/* Live Stats */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  📊
                </div>
                <h3 className="text-xl font-bold text-gray-800">สถิติสด</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">⏱️ เวลาที่เล่นแล้ว:</span>
                  <span className="font-bold text-blue-600">
                    {formatTime(420 - currentGame.timeLeft)}
                    {isOvertime() && <span className="text-orange-600 ml-1">(+OT)</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">🎯 คะแนนรวม:</span>
                  <span className="font-bold text-purple-600">{currentGame.teamAScore + currentGame.teamBScore}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">👥 คนรอ:</span>
                  <span className="font-bold text-orange-600">{queue.length} คน</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">🏆 การแข่งขัน:</span>
                  <span className="font-bold text-green-600">ชนะ 2 ทีมเป็นแชมป์</span>
                </div>
              </div>
            </div>

            {/* Next Up */}
            {queue.length > 0 && (
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    ⏭️
                  </div>
                  <h3 className="text-xl font-bold">คิวถัดไป</h3>
                </div>
                <div className="text-center py-4 bg-purple-700 rounded-lg">
                  <div className="text-2xl font-bold mb-2">🎮 {queue[0]}</div>
                  <div className="text-purple-200">พร้อมเข้าสู่สนาม!</div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Queue Management */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              👥
            </div>
            <h2 className="text-2xl font-bold text-gray-800">จัดการคิว</h2>
          </div>

          {/* Add to Queue */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">เพิ่มผู้เล่นเข้าคิว:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addToQueue()}
                placeholder="ชื่อผู้เล่นหรือทีม..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-gray-900"
              />
              <button
                onClick={addToQueue}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 flex items-center gap-2 font-bold shadow-lg transform hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                เพิ่ม
              </button>
            </div>
          </div>

          {/* Queue Display */}
          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              📋 รายชื่อคิว ({queue.length} คน)
            </h3>
            
            {queue.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-4xl mb-2">😴</div>
                <p className="text-gray-500 text-lg">ยังไม่มีคนเข้าคิว</p>
                <p className="text-gray-400 text-sm">เพิ่มชื่อเพื่อเข้าคิว!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((player, index) => (
                  <div key={index} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                          {index + 1}
                        </span>
                        {index === 0 && (
                          <span className="bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                            ⭐ คิวแรก
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-lg text-gray-800">{player}</span>
                        {index === 0 && (
                          <div className="text-sm text-orange-600 font-medium">พร้อมเข้าเล่น!</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromQueue(index)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all hover:scale-110"
                      title="ลบออกจากคิว"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start New Match */}
          {(!currentGame.teamA || !currentGame.teamB) && queue.length >= 2 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <button
                onClick={startNewMatch}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-green-700 font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
              >
                🚀 เริ่มแมตช์ใหม่: {queue[0]} VS {queue[1]}
              </button>
              <p className="text-center text-green-700 text-sm mt-2">
                พร้อมเริ่มเกมด้วยสองคนแรกในคิว!
              </p>
            </div>
          )}
        </div>

        {/* Game Rules */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              📜
            </div>
            <h2 className="text-2xl font-bold text-gray-800">กฎการเล่น</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⏰</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">เวลาการเล่น</h3>
                  <p className="text-gray-600 text-sm mb-2">แต่ละเกมใช้เวลา 7 นาที</p>
                  <p className="text-gray-600 text-xs">• เสมอ = ต่อเวลา 1 นาที</p>
                  <p className="text-gray-600 text-xs">• หมดเวลา = ทีมแต้มมากชนะ</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🏆</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">เงื่อนไขชนะ</h3>
                  <p className="text-gray-600 text-sm mb-2">• ได้ 15 แต้มก่อน = ชนะทันที</p>
                  <p className="text-gray-600 text-sm">• ชนะ 2 ทีมต่างกัน = แชมป์</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">👑</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">ระบบแชมป์</h3>
                  <p className="text-gray-600 text-sm mb-2">• แชมป์พักรอ ทีมอื่นเล่นก่อน</p>
                  <p className="text-gray-600 text-sm">• หลังจบคู่ แชมป์กลับมาเล่น</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📝</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">การให้คะแนน</h3>
                  <p className="text-gray-600 text-xs">• +1, +2, +3 และ -1 คะแนน</p>
                  <p className="text-gray-600 text-xs">• ใช้ปุ่มบนหน้าจอ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🔥</div>
              <h3 className="font-bold mb-1">พร้อมเล่นแล้ว?</h3>
              <p className="text-sm opacity-90">เพิ่มชื่อเข้าคิวและเริ่มเล่นบาสกันเถอะ!</p>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="text-center bg-gray-800 text-white py-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">เชื่อมต่อแล้ว</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">อัพเดทแบบ Real-time</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">ใครก็ดูได้</span>
            </div>
          </div>
        </div>

        {/* Celebration Popup */}
        {showCelebration && celebrationData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-bounce">
              <div className="p-6 text-center">
                <div className="mb-4">
                  <div className="text-6xl mb-3">
                    {celebrationData.isChampion ? '🏆' : '🎯'}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {celebrationData.isChampion ? '🎉 แชมป์เปี้ยน!' : '🎯 ชนะแล้ว!'}
                  </h2>
                  <p className="text-xl font-bold text-orange-600 mb-3">
                    {celebrationData.winner}
                  </p>
                  {celebrationData.extraMessage && (
                    <p className="text-sm text-gray-600 mb-3">
                      ✨ {celebrationData.extraMessage}
                    </p>
                  )}
                </div>

                <button
                  onClick={closeCelebration}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  ✨ เยี่ยมมาก!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return <BasketballQueueSystem />;
}

export default App;