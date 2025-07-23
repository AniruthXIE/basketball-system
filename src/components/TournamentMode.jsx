import { useState } from 'react';
import { Trophy, Users, Play } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const TournamentMode = () => {
  const { updateGameState } = useGame();
  const [tournamentPlayers, setTournamentPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [tournamentType, setTournamentType] = useState('single'); // single, double
  const [isStarted, setIsStarted] = useState(false);
  const [bracket, setBracket] = useState([]);

  const addPlayer = () => {
    if (newPlayer.trim() && !tournamentPlayers.includes(newPlayer.trim())) {
      setTournamentPlayers([...tournamentPlayers, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const removePlayer = (index) => {
    setTournamentPlayers(tournamentPlayers.filter((_, i) => i !== index));
  };

  const generateBracket = () => {
    if (tournamentPlayers.length < 2) return;
    
    // Shuffle players
    const shuffled = [...tournamentPlayers].sort(() => Math.random() - 0.5);
    
    // Generate first round matches
    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        matches.push({
          id: `match-${i/2}`,
          player1: shuffled[i],
          player2: shuffled[i + 1],
          winner: null,
          completed: false,
          round: 1
        });
      } else {
        // Bye for odd number of players
        matches.push({
          id: `bye-${i/2}`,
          player1: shuffled[i],
          player2: 'BYE',
          winner: shuffled[i],
          completed: true,
          round: 1
        });
      }
    }
    
    setBracket(matches);
    setIsStarted(true);
  };

  const startMatch = (match) => {
    // Start this match in the main game
    updateGameState({
      currentGame: {
        teamA: match.player1,
        teamB: match.player2,
        teamAScore: 0,
        teamBScore: 0,
        isPlaying: false,
        timeLeft: 420
      },
      queue: [],
      champion: null,
      championDefenseStreak: 0,
      formerChampionName: null
    });
  };

  const completeMatch = (matchId, winner) => {
    setBracket(bracket.map(match => 
      match.id === matchId ? { ...match, winner, completed: true } : match
    ));
    
    // Generate next round if all matches in current round are complete
    const currentRound = Math.max(...bracket.map(m => m.round));
    const currentRoundMatches = bracket.filter(m => m.round === currentRound);
    const completedMatches = currentRoundMatches.filter(m => m.completed);
    
    if (completedMatches.length === currentRoundMatches.length && completedMatches.length > 1) {
      // Generate next round
      const winners = completedMatches.map(m => m.winner);
      const nextRoundMatches = [];
      
      for (let i = 0; i < winners.length; i += 2) {
        if (i + 1 < winners.length) {
          nextRoundMatches.push({
            id: `round${currentRound + 1}-match-${i/2}`,
            player1: winners[i],
            player2: winners[i + 1],
            winner: null,
            completed: false,
            round: currentRound + 1
          });
        }
      }
      
      setBracket([...bracket, ...nextRoundMatches]);
    }
  };

  const resetTournament = () => {
    setTournamentPlayers([]);
    setBracket([]);
    setIsStarted(false);
  };

  const getRoundName = (round) => {
    const totalPlayers = tournamentPlayers.length;
    const maxRounds = Math.ceil(Math.log2(totalPlayers));
    
    if (round === maxRounds) return 'รอบชิงชนะเลิศ';
    if (round === maxRounds - 1) return 'รอบรองชนะเลิศ';
    if (round === maxRounds - 2) return 'รอบ 8 คนสุดท้าย';
    return `รอบที่ ${round}`;
  };

  if (!isStarted) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            🏆
          </div>
          <h2 className="text-2xl font-bold text-gray-800">โหมดทัวร์นาเมนต์</h2>
        </div>

        {/* Tournament Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">ประเภททัวร์นาเมนต์:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="single"
                checked={tournamentType === 'single'}
                onChange={(e) => setTournamentType(e.target.value)}
                className="mr-2"
              />
              <span>Single Elimination</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="double"
                checked={tournamentType === 'double'}
                onChange={(e) => setTournamentType(e.target.value)}
                className="mr-2"
                disabled
              />
              <span className="text-gray-400">Double Elimination (Coming Soon)</span>
            </label>
          </div>
        </div>

        {/* Add Players */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">เพิ่มผู้เข้าแข่งขัน:</label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="ชื่อผู้เล่นหรือทีม..."
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
            />
            <button
              onClick={addPlayer}
              disabled={!newPlayer.trim()}
              className="bg-purple-500 disabled:bg-gray-300 text-white px-6 py-2 rounded-xl hover:bg-purple-600 disabled:hover:bg-gray-300 font-bold shadow-lg transform hover:scale-105 disabled:transform-none transition-all"
            >
              เพิ่ม
            </button>
          </div>

          {/* Players List */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tournamentPlayers.map((player, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                <span className="font-medium">{player}</span>
                <button
                  onClick={() => removePlayer(index)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Info */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>ผู้เข้าแข่งขัน: {tournamentPlayers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span>รอบทั้งหมด: {tournamentPlayers.length > 1 ? Math.ceil(Math.log2(tournamentPlayers.length)) : 0}</span>
            </div>
          </div>
        </div>

        {/* Start Tournament */}
        <button
          onClick={generateBracket}
          disabled={tournamentPlayers.length < 2}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:hover:from-gray-300 disabled:hover:to-gray-400 font-bold text-lg shadow-lg transform hover:scale-105 disabled:transform-none transition-all"
        >
          🚀 เริ่มทัวร์นาเมนต์
        </button>
        
        {tournamentPlayers.length < 2 && (
          <p className="text-center text-gray-500 text-sm mt-2">
            ต้องมีผู้เข้าแข่งขันอย่างน้อย 2 คน
          </p>
        )}
      </div>
    );
  }

  // Tournament Bracket View
  const rounds = [...new Set(bracket.map(m => m.round))].sort();
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            🏆
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ตารางทัวร์นาเมนต์</h2>
        </div>
        <button
          onClick={resetTournament}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all text-sm"
        >
          รีเซ็ตทัวร์นาเมนต์
        </button>
      </div>

      <div className="space-y-6">
        {rounds.map(round => (
          <div key={round} className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {getRoundName(round)}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {bracket.filter(m => m.round === round).map(match => (
                <div key={match.id} className={`p-4 rounded-lg border-2 ${
                  match.completed ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{match.player1}</span>
                    <span className="text-gray-500">VS</span>
                    <span className="font-medium">{match.player2}</span>
                  </div>
                  
                  {match.completed ? (
                    <div className="text-center">
                      <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        🏆 {match.winner}
                      </span>
                    </div>
                  ) : match.player2 !== 'BYE' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startMatch(match)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition-all"
                      >
                        <Play className="w-4 h-4 inline mr-1" />
                        เริ่มแมตช์
                      </button>
                      <button
                        onClick={() => completeMatch(match.id, match.player1)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition-all"
                      >
                        {match.player1} ชนะ
                      </button>
                      <button
                        onClick={() => completeMatch(match.id, match.player2)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-sm transition-all"
                      >
                        {match.player2} ชนะ
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tournament Winner */}
      {bracket.length > 0 && bracket[bracket.length - 1]?.completed && (
        <div className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">แชมป์ทัวร์นาเมนต์!</h3>
          <p className="text-xl">{bracket[bracket.length - 1].winner}</p>
        </div>
      )}
    </div>
  );
};

export default TournamentMode;