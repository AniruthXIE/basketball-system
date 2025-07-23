import { Clock, Users } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { formatTime, isOvertime, getGameTimeElapsed } from '../utils/gameUtils';

const GameStats = () => {
  const { currentGame, queue, champion } = useGame();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Live Stats */}
      <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            📊
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">สถิติสด</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600 text-sm sm:text-base">⏱️ เวลาที่เล่นแล้ว:</span>
            <span className="font-bold text-blue-600 text-sm sm:text-base">
              {formatTime(getGameTimeElapsed(currentGame.timeLeft, isOvertime(currentGame.timeLeft)))}
              {isOvertime(currentGame.timeLeft) && <span className="text-orange-600 ml-1">(+OT)</span>}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600 text-sm sm:text-base">🎯 คะแนนรวม:</span>
            <span className="font-bold text-purple-600 text-sm sm:text-base">
              {currentGame.teamAScore + currentGame.teamBScore}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600 text-sm sm:text-base">👥 คนรอ:</span>
            <span className="font-bold text-orange-600 text-sm sm:text-base">{queue.length} คน</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm sm:text-base">🏆 การแข่งขัน:</span>
            <span className="font-bold text-green-600 text-xs sm:text-sm">ชนะ 2 ทีมเป็นแชมป์</span>
          </div>
        </div>
      </div>

      {/* Next Up */}
      {queue.length > 0 && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl p-4 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              ⏭️
            </div>
            <h3 className="text-lg sm:text-xl font-bold">คิวถัดไป</h3>
          </div>
          <div className="text-center py-4 bg-purple-700 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold mb-2">🎮 {queue[0]}</div>
            <div className="text-purple-200 text-sm">พร้อมเข้าสู่สนาม!</div>
          </div>
        </div>
      )}

      {/* Championship Status */}
      {champion && (
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-xl p-4 sm:p-6 text-gray-900">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-yellow-700 rounded-full flex items-center justify-center text-white">
              👑
            </div>
            <h3 className="text-lg sm:text-xl font-bold">สถานะแชมป์</h3>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold mb-2">🏆 {champion}</div>
            <div className="text-yellow-800 text-sm">กำลังพักรอคู่ถัดไป</div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="bg-gray-800 text-white py-3 px-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">เชื่อมต่อแล้ว</span>
          </div>
          <div className="text-gray-300">|</div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>อัพเดท Real-time</span>
          </div>
          <div className="text-gray-300">|</div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>ใครก็ดูได้</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;