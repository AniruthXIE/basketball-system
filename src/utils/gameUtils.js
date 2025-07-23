/**
 * Format time from seconds to MM:SS
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Check if game is in overtime
 */
export const isOvertime = (timeLeft) => {
  return timeLeft <= 60 && timeLeft > 0;
};

/**
 * Get game status text
 */
export const getGameStatusText = (isPlaying, timeLeft) => {
  if (isOvertime(timeLeft)) {
    return '🔥 OVERTIME';
  }
  return isPlaying ? '⚡ กำลังเล่น' : '⏸️ หยุดชั่วคราว';
};

/**
 * Calculate total game time played
 */
export const getGameTimeElapsed = (timeLeft, isOvertime = false) => {
  const normalTime = 420 - Math.max(timeLeft, 60);
  const overtimeElapsed = isOvertime && timeLeft < 60 ? (60 - timeLeft) : 0;
  return normalTime + overtimeElapsed;
};

/**
 * Check if team can become champion
 */
export const canBecomeChampion = (teamWins, teamName) => {
  return teamWins[teamName]?.size >= 2;
};

/**
 * Get next player from queue
 */
export const getNextFromQueue = (queue) => {
  return queue.length > 0 ? queue[0] : null;
};

/**
 * Generate celebration message
 */
export const getCelebrationMessage = (winner, isChampion, extraMessage = '') => {
  if (isChampion) {
    return {
      emoji: '🏆',
      title: '🎉 แชมป์เปี้ยน!',
      subtitle: winner,
      message: extraMessage
    };
  }
  
  return {
    emoji: '🎯',
    title: '🎯 ชนะแล้ว!',
    subtitle: winner,
    message: extraMessage
  };
};