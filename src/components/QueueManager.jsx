import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const QueueManager = () => {
  const { currentGame, queue, setQueue, updateGameState } = useGame();
  const [newPlayer, setNewPlayer] = useState('');

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
      updateGameState({
        currentGame: {
          teamA: queue[0],
          teamB: queue[1],
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        },
        queue: queue.slice(2),
        champion: null,
        championDefenseStreak: 0,
        formerChampionName: null,
        teamWins: {}
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addToQueue();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
          👥
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">จัดการคิว</h2>
      </div>

      {/* Add to Queue */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
          เพิ่มผู้เล่นเข้าคิว:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="ชื่อผู้เล่นหรือทีม..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-lg text-gray-900"
            maxLength={20}
          />
          <button
            onClick={addToQueue}
            disabled={!newPlayer.trim() || queue.includes(newPlayer.trim())}
            className="bg-gradient-to-r from-orange-500 to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:hover:from-gray-300 disabled:hover:to-gray-400 flex items-center gap-2 font-bold shadow-lg transform hover:scale-105 disabled:transform-none transition-all text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">เพิ่ม</span>
          </button>
        </div>
        {newPlayer.trim() && queue.includes(newPlayer.trim()) && (
          <p className="text-red-500 text-sm mt-1">มีชื่อนี้ในคิวแล้ว</p>
        )}
      </div>

      {/* Queue Display */}
      <div className="space-y-3 mb-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-700 flex items-center gap-2">
          📋 รายชื่อคิว ({queue.length} คน)
        </h3>
        
        {queue.length === 0 ? (
          <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-3xl sm:text-4xl mb-2">😴</div>
            <p className="text-gray-500 text-base sm:text-lg">ยังไม่มีคนเข้าคิว</p>
            <p className="text-gray-400 text-xs sm:text-sm">เพิ่มชื่อเพื่อเข้าคิว!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((player, index) => (
              <div key={index} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 px-3 sm:px-4 py-3 sm:py-4 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-md">
                      {index + 1}
                    </span>
                    {index === 0 && (
                      <span className="bg-yellow-400 text-yellow-800 px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ คิวแรก
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-lg text-gray-800 break-all">{player}</span>
                    {index === 0 && (
                      <div className="text-xs sm:text-sm text-orange-600 font-medium">พร้อมเข้าเล่น!</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFromQueue(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all hover:scale-110 flex-shrink-0"
                  title="ลบออกจากคิว"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
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
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 sm:py-4 rounded-xl hover:from-green-600 hover:to-green-700 font-bold text-sm sm:text-lg shadow-lg transform hover:scale-105 transition-all"
          >
            🚀 เริ่มแมตช์ใหม่: {queue[0]} VS {queue[1]}
          </button>
          <p className="text-center text-green-700 text-xs sm:text-sm mt-2">
            พร้อมเริ่มเกมด้วยสองคนแรกในคิว!
          </p>
        </div>
      )}
    </div>
  );
};

export default QueueManager;