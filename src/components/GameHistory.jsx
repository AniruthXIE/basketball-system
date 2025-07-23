import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, Clock } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { formatTime } from '../utils/gameUtils';

const GameHistory = () => {
  const { gameHistory = [] } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, wins, championships

  if (!gameHistory || gameHistory.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            📈
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ประวัติการแข่งขัน</h2>
        </div>
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">ยังไม่มีประวัติการแข่งขัน</p>
          <p className="text-gray-400 text-sm">เกมจะถูกบันทึกหลังจากจบแมตช์</p>
        </div>
      </div>
    );
  }

  const filteredHistory = gameHistory.filter(game => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'wins') return game.type === 'win';
    if (selectedFilter === 'championships') return game.type === 'championship';
    return true;
  });

  const displayedHistory = isExpanded ? filteredHistory : filteredHistory.slice(0, 5);

  const getGameIcon = (game) => {
    if (game.type === 'championship') return '👑';
    if (game.type === 'win') return '🏆';
    return '🎮';
  };

  const getGameTypeText = (game) => {
    if (game.type === 'championship') return 'แชมป์เปี้ยน';
    if (game.type === 'win') return 'ชนะเกม';
    return 'จบเกม';
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            📈
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ประวัติการแข่งขัน</h2>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setSelectedFilter('championships')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === 'championships' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            แชมป์
          </button>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">{gameHistory.length}</div>
          <div className="text-xs text-blue-800">เกมทั้งหมด</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-xl font-bold text-yellow-600">
            {gameHistory.filter(g => g.type === 'championship').length}
          </div>
          <div className="text-xs text-yellow-800">แชมป์เปี้ยน</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">
            {[...new Set(gameHistory.map(g => g.winner))].length}
          </div>
          <div className="text-xs text-green-800">ผู้เล่นต่างกัน</div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {displayedHistory.map((game, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-2xl">{getGameIcon(game)}</div>
              <div>
                <div className="font-bold text-gray-800">
                  {game.winner} ชนะ {game.loser}
                </div>
                <div className="text-sm text-gray-600">
                  {getGameTypeText(game)} • {game.score} • {formatTime(game.duration || 420)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">
                {new Date(game.timestamp).toLocaleString('th-TH', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              {game.streak && (
                <div className="text-xs text-orange-600 font-medium">
                  {game.streak} ชนะติด
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {filteredHistory.length > 5 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 font-medium transition-all"
          >
            {isExpanded ? (
              <>
                แสดงน้อยลง <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                แสดงเพิ่มเติม ({filteredHistory.length - 5}) <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameHistory;