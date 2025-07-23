import { soundManager } from '../utils/soundUtils';
import { showCelebration } from '../components/CelebrationModal';

export class GameLogic {
  constructor(gameState, updateGameState) {
    this.gameState = gameState;
    this.updateGameState = updateGameState;
    this.isProcessingRef = gameState.isProcessingRef;
  }

  // Enhanced game end logic with champion defense system
  handleGameEnd = () => {
    // Prevent multiple executions using ref
    if (this.isProcessingRef.current) {
      console.log('⚠️ Already processing game end, skipping...');
      return;
    }
    
    this.isProcessingRef.current = true;
    
    const { teamA, teamB, teamAScore, teamBScore } = this.gameState.currentGame;
    
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
      this.updateGameState({
        currentGame: {
          ...this.gameState.currentGame,
          timeLeft: 60,
          isPlaying: false
        }
      });
      this.isProcessingRef.current = false;
      return;
    }

    console.log(`🎯 Game ended: ${winner} beats ${loser}`);
    
    // Add game to history
    const gameRecord = {
      winner,
      loser,
      score: `${teamAScore}-${teamBScore}`,
      duration: 420 - this.gameState.currentGame.timeLeft,
      timestamp: Date.now(),
      type: 'win'
    };

    // Check if this is a former champion defending their title
    const isFormerChampionDefending = this.gameState.champion === null && 
                                     this.gameState.formerChampionName && 
                                     winner === this.gameState.formerChampionName;
    
    if (isFormerChampionDefending) {
      console.log(`🛡️ Former champion ${winner} defending! Current streak: ${this.gameState.championDefenseStreak}`);
      
      const newStreak = this.gameState.championDefenseStreak + 1;
      
      if (newStreak >= 2) {
        // Former champion reclaims title!
        console.log(`👑 ${winner} reclaims CHAMPION title after 2 consecutive wins!`);
        
        gameRecord.type = 'championship';
        gameRecord.streak = newStreak;
        
        this.updateGameState({
          champion: winner,
          championDefenseStreak: 0,
          formerChampionName: null,
          gameHistory: [...this.gameState.gameHistory, gameRecord]
        });
        
        soundManager.playChampion();
        
        // Show celebration
        setTimeout(() => {
          showCelebration(winner, true, `กลับมาเป็นแชมป์อีกครั้ง! (${newStreak} ชนะติด)`);
        }, 500);
        
        // Start next match after celebration
        setTimeout(() => {
          this.startNextMatch(winner, loser);
          this.isProcessingRef.current = false;
        }, 3000);
        
        return;
      } else {
        // Continue defense streak
        gameRecord.streak = newStreak;
        
        this.updateGameState({
          championDefenseStreak: newStreak,
          gameHistory: [...this.gameState.gameHistory, gameRecord]
        });
        
        soundManager.playWin();
        
        setTimeout(() => {
          showCelebration(winner, false, `ป้องกันตำแหน่ง ${newStreak}/2`);
        }, 500);
        
        setTimeout(() => {
          this.continueMatch(winner, loser);
          this.isProcessingRef.current = false;
        }, 3000);
        
        return;
      }
    } else if (this.gameState.champion === null && 
               this.gameState.formerChampionName && 
               loser === this.gameState.formerChampionName) {
      // Former champion lost - reset tracking
      console.log(`💔 Former champion ${loser} lost! Defense attempt failed.`);
      this.updateGameState({
        formerChampionName: null,
        championDefenseStreak: 0,
        gameHistory: [...this.gameState.gameHistory, gameRecord]
      });
    }

    // Normal game logic - update wins tracking
    const newWins = { ...this.gameState.teamWins };
    if (!newWins[winner]) {
      newWins[winner] = new Set();
    }
    newWins[winner].add(loser);
    
    // Check if winner becomes NEW champion (beat 2 different teams)
    if (newWins[winner].size >= 2) {
      console.log(`🏆 ${winner} becomes CHAMPION!`);
      
      gameRecord.type = 'championship';
      
      this.updateGameState({
        champion: winner,
        championDefenseStreak: 0,
        formerChampionName: null,
        teamWins: newWins,
        gameHistory: [...this.gameState.gameHistory, gameRecord]
      });
      
      soundManager.playChampion();
      
      // Show celebration
      setTimeout(() => {
        showCelebration(winner, true);
      }, 500);
      
      // Start next match after celebration
      setTimeout(() => {
        this.startNextMatch(winner, loser);
        this.isProcessingRef.current = false;
      }, 3000);
    } else {
      console.log(`🎮 ${winner} wins but not champion yet (${newWins[winner].size}/2)`);
      
      this.updateGameState({
        teamWins: newWins,
        gameHistory: [...this.gameState.gameHistory, gameRecord]
      });
      
      soundManager.playWin();
      
      // Show regular win celebration
      setTimeout(() => {
        showCelebration(winner, false);
      }, 500);
      
      // Check if there's a waiting champion FIRST
      setTimeout(() => {
        if (this.gameState.champion) {
          // There's a champion waiting - they should come back and challenge the winner
          console.log(`👑 Champion ${this.gameState.champion} returns to challenge winner ${winner}!`);
          this.championReturns(winner, loser);
        } else {
          // No champion waiting, continue normal flow
          this.continueMatch(winner, loser);
        }
        this.isProcessingRef.current = false;
      }, 3000);
    }
  };

  // Start next match when someone becomes champion
  startNextMatch = (champion, defeated) => {
    console.log(`🔄 Champion ${champion} sits out, starting next match`);
    console.log(`📋 Current queue before: [${this.gameState.queue.join(', ')}]`);
    
    // Add defeated player to back of queue
    const newQueue = [...this.gameState.queue, defeated];
    console.log(`📋 Queue after adding defeated: [${newQueue.join(', ')}]`);
    
    if (newQueue.length >= 2) {
      // Start match with next 2 in queue
      const team1 = newQueue[0];
      const team2 = newQueue[1];
      
      console.log(`🆚 Next match: ${team1} vs ${team2}`);
      
      // Remove the 2 who are now playing
      const remainingQueue = newQueue.slice(2);
      console.log(`📋 Remaining queue after match starts: [${remainingQueue.join(', ')}]`);
      
      setTimeout(() => {
        this.updateGameState({
          queue: remainingQueue,
          currentGame: {
            teamA: team1,
            teamB: team2,
            teamAScore: 0,
            teamBScore: 0,
            isPlaying: false,
            timeLeft: 420
          }
        });
      }, 50);
      
    } else if (newQueue.length === 1) {
      // Only 1 person left, champion comes back to play them
      console.log(`👑 ${champion} comes back to play ${newQueue[0]} (only 1 left)`);
      
      setTimeout(() => {
        this.updateGameState({
          queue: [],
          champion: null,
          currentGame: {
            teamA: champion,
            teamB: newQueue[0],
            teamAScore: 0,
            teamBScore: 0,
            isPlaying: false,
            timeLeft: 420
          }
        });
      }, 50);
      
    } else {
      // No one left, champion waits alone
      console.log(`😴 No one left, champion ${champion} waits`);
      
      setTimeout(() => {
        this.updateGameState({
          queue: [],
          currentGame: {
            teamA: champion,
            teamB: '',
            teamAScore: 0,
            teamBScore: 0,
            isPlaying: false,
            timeLeft: 420
          }
        });
      }, 50);
    }
  };

  // Enhanced champion returns with defense streak
  championReturns = (winner, loser) => {
    const currentChampion = this.gameState.champion;
    console.log(`🎯 Champion ${currentChampion} returns to challenge ${winner}!`);

    const newQueue = [...this.gameState.queue, loser];

    setTimeout(() => {
      this.updateGameState({
        queue: newQueue,
        formerChampionName: currentChampion,
        champion: null,
        championDefenseStreak: 0,
        currentGame: {
          teamA: currentChampion,
          teamB: winner,
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        }
      });

      console.log(`🛡️ Former champion ${currentChampion} must win 2 consecutive games to reclaim title!`);
    }, 50);
  };

  // Continue match when winner is not champion yet
  continueMatch = (winner, loser) => {
    console.log(`➡️ ${winner} continues playing`);
    console.log(`📋 Current queue before: [${this.gameState.queue.join(', ')}]`);
    
    // Add loser to back of queue first
    const newQueue = [...this.gameState.queue, loser];
    console.log(`📋 Queue after adding loser: [${newQueue.join(', ')}]`);
    
    if (newQueue.length > 0) {
      // Winner plays next person in queue
      const nextOpponent = newQueue[0];
      console.log(`🎮 ${winner} vs ${nextOpponent} (next opponent)`);
      
      // Remove the opponent from queue (they're now playing)
      const remainingQueue = newQueue.slice(1);
      console.log(`📋 Remaining queue: [${remainingQueue.join(', ')}]`);
      
      setTimeout(() => {
        this.updateGameState({
          queue: remainingQueue,
          currentGame: {
            teamA: winner,
            teamB: nextOpponent,
            teamAScore: 0,
            teamBScore: 0,
            isPlaying: false,
            timeLeft: 420
          }
        });
      }, 50);
    } else {
      // No one left, winner waits
      console.log(`😴 No one in queue, ${winner} waits`);
      setTimeout(() => {
        this.updateGameState({
          queue: newQueue,
          currentGame: {
            teamA: winner,
            teamB: '',
            teamAScore: 0,
            teamBScore: 0,
            isPlaying: false,
            timeLeft: 420
          }
        });
      }, 50);
    }
  };
}