import { Trophy } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const ChampionBanner = () => {
  const { champion, championDefenseStreak } = useGame();

  if (!champion && championDefenseStreak === 0) return null;

  return (
    <>
      {/* Champion Defense Streak Display */}
      {championDefenseStreak > 0 && (
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-xl p-4 mb-6 shadow-lg animate-pulse">
          <div className="flex items-center justify-center gap-3">
            <div className="text-2xl">🛡️</div>
            <div className="text-center">
              <span className="font-bold text-xl block">อดีตแชมป์กำลังป้องกัน!</span>
              <span className="text-purple-200 text-sm">
                ชนะ {championDefenseStreak}/2 เกม (ต้องชนะ 2 เกมติดกันเพื่อกลับมาเป็นแชมป์)
              </span>
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
    </>
  );
};

export default ChampionBanner;