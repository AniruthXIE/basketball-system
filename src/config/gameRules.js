// Game rules configuration for different basketball modes

export const GAME_MODES = {
  CASUAL: 'casual',      // บาสเย็น
  THREE_X_THREE: '3x3',  // 3v3 Basketball
  FIVE_X_FIVE: '5x5'     // 5v5 Basketball
};

export const GAME_RULES = {
  [GAME_MODES.CASUAL]: {
    name: 'บาสเย็น 🏀',
    description: 'เล่นสบายๆ ไม่มีกฎเข้มงวด',
    maxScore: null,        // ไม่จำกัดแต้ม
    gameTime: 420,         // 7 นาที
    overtimeTime: 60,      // 1 นาที
    shotClock: null,       // ไม่มี shot clock
    timeouts: 0,           // ไม่มี timeout
    quarters: 1,           // 1 ครั้ง
    scoringSystem: [1, 2, 3], // 1, 2, 3 แต้ม
    rules: [
      '⏰ เวลาแข่งขัน 7 นาทีต่อเกม',
      '🏆 ชนะ 2 ทีมติดต่อกันเป็นแชมป์',
      '⚡ ได้คะแนนทันที 15 แต้ม = ชนะ',
      '🔄 หากเสมอ ต่อเวลา 1 นาที'
    ]
  },
  
  [GAME_MODES.THREE_X_THREE]: {
    name: '3x3 Basketball 🏀',
    description: 'กฎ FIBA 3x3 อย่างเป็นทางการ',
    maxScore: 21,          // 21 แต้มชนะ
    gameTime: 600,         // 10 นาที
    overtimeTime: null,    // ไม่มี overtime (เล่นจนมีคนได้ 21)
    shotClock: 12,         // 12 วินาที
    timeouts: 1,           // 1 ครั้งต่อเกม
    timeoutDuration: 30,   // 30 วินาที
    quarters: 1,           // 1 ครั้ง
    scoringSystem: [1, 2], // 1, 2 แต้มเท่านั้น
    rules: [
      '🎯 21 แต้มชนะ หรือ 10 นาทีหมดเวลา',
      '⏱️ Shot Clock 12 วินาที',
      '⏸️ เวลานอกได้ 1 ครั้งต่อเกม (30 วินาที)',
      '🏀 ได้แต้ม 1 และ 2 เท่านั้น',
      '🚀 ทีมแรกที่ได้ 21 แต้มชนะทันที'
    ]
  },
  
  [GAME_MODES.FIVE_X_FIVE]: {
    name: '5x5 Basketball 🏀',
    description: 'กฎ FIBA 5x5 มาตรฐานสากล',
    maxScore: null,        // ไม่จำกัดแต้ม
    gameTime: 1200,        // 20 นาที (2 ครึ่ง x 10 นาที)
    halftimeTime: 300,     // พักครึ่ง 5 นาที
    overtimeTime: 300,     // ต่อเวลา 5 นาที
    shotClock: 24,         // 24 วินาที
    timeouts: 2,           // 2 ครั้งต่อครึ่ง
    timeoutDuration: 60,   // 1 นาที
    quarters: 2,           // 2 ครึ่ง
    quarterTime: 600,      // 10 นาทีต่อครึ่ง
    scoringSystem: [1, 2, 3], // 1, 2, 3 แต้ม
    rules: [
      '🕐 2 ครึ่ง ครึ่งละ 10 นาที',
      '⏱️ Shot Clock 24 วินาที',
      '⏸️ เวลานอกได้ครึ่งละ 2 ครั้ง (1 นาที)',
      '🏀 ได้แต้ม 1, 2, 3 แต้ม',
      '🔄 หากเสมอ ต่อเวลา 5 นาที'
    ]
  }
};

export const getGameConfig = (mode) => {
  return GAME_RULES[mode] || GAME_RULES[GAME_MODES.CASUAL];
};

export const isGameComplete = (mode, teamAScore, teamBScore, timeLeft) => {
  const config = getGameConfig(mode);
  
  // Check max score win condition
  if (config.maxScore) {
    if (teamAScore >= config.maxScore || teamBScore >= config.maxScore) {
      return true;
    }
  }
  
  // Check time up
  if (timeLeft <= 0) {
    return true;
  }
  
  return false;
};

export const getWinner = (teamAScore, teamBScore) => {
  if (teamAScore > teamBScore) return 'A';
  if (teamBScore > teamAScore) return 'B';
  return null; // Tie
};

export const formatGameTime = (seconds, mode) => {
  const config = getGameConfig(mode);
  
  if (mode === GAME_MODES.FIVE_X_FIVE) {
    // Show quarter info for 5x5
    const currentQuarter = seconds > config.quarterTime ? 1 : 2;
    const quarterTime = seconds > config.quarterTime ? 
      seconds - config.quarterTime : seconds;
    
    const minutes = Math.floor(quarterTime / 60);
    const secs = quarterTime % 60;
    
    return {
      display: `${minutes}:${secs.toString().padStart(2, '0')}`,
      quarter: currentQuarter,
      isHalftime: false
    };
  }
  
  // Regular time format for other modes
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return {
    display: `${minutes}:${secs.toString().padStart(2, '0')}`,
    quarter: 1,
    isHalftime: false
  };
};