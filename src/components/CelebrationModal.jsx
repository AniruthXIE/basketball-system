import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const CelebrationModal = () => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);

  // Listen for celebration events (this would be triggered from game logic)
  useEffect(() => {
    const handleCelebration = (event) => {
      setCelebrationData(event.detail);
      setShowCelebration(true);
      
      // Auto close after 4 seconds
      setTimeout(() => {
        setShowCelebration(false);
        setCelebrationData(null);
      }, 4000);
    };

    window.addEventListener('showCelebration', handleCelebration);
    return () => window.removeEventListener('showCelebration', handleCelebration);
  }, []);

  const closeCelebration = () => {
    setShowCelebration(false);
    setCelebrationData(null);
  };

  if (!showCelebration || !celebrationData) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {celebrationData.isChampion && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {['🎊', '🎉', '✨', '🌟', '⭐'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className={`relative rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-scaleIn overflow-hidden border-2 ${
        celebrationData.isChampion 
          ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 border-yellow-400/50' 
          : 'bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 border-purple-400/50'
      }`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)] animate-pulse"></div>
        </div>

        <div className="relative p-8 text-center">
          <button
            onClick={closeCelebration}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 rounded-full p-2 backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-6">
            <div className={`text-8xl mb-4 ${celebrationData.isChampion ? 'animate-bounce' : 'animate-spin'}`}>
              {celebrationData.isChampion ? '🏆' : '🎯'}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white drop-shadow-lg">
                {celebrationData.isChampion ? '🎊 แชมป์เปี้ยน! 🎊' : '🎯 ชนะแล้ว! 🎯'}
              </h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 mx-4">
                <p className="text-2xl font-bold text-white drop-shadow-md">
                  {celebrationData.winner}
                </p>
              </div>
              {celebrationData.extraMessage && (
                <div className="bg-black/20 backdrop-blur-sm rounded-xl px-4 py-2 mx-2">
                  <p className="text-sm text-white/90 font-medium">
                    ✨ {celebrationData.extraMessage}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={closeCelebration}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/30"
            >
              <span className="text-lg">✨ เยี่ยมมาก! ✨</span>
            </button>
            
            {celebrationData.isChampion && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-bounce">🎊</div>
                  <span className="font-bold text-white text-lg">ยินดีด้วย! คุณคือแชมป์!</span>
                  <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</div>
                </div>
                <div className="mt-2 flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="text-yellow-300 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      ⭐
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility function to trigger celebration
export const showCelebration = (winner, isChampion, extraMessage = '') => {
  const event = new CustomEvent('showCelebration', {
    detail: { winner, isChampion, extraMessage }
  });
  window.dispatchEvent(event);
};

export default CelebrationModal;