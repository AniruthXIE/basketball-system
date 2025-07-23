import { useGame } from '../contexts/GameContext';

const LoadingSpinner = () => {
  const { loading, error } = useGame();

  if (!loading && !error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        {loading && (
          <>
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">กำลังโหลด...</h3>
            <p className="text-gray-600">กำลังซิงค์ข้อมูลกับเซิร์ฟเวอร์</p>
          </>
        )}
        
        {error && (
          <>
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-600 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all"
            >
              🔄 ลองใหม่
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;