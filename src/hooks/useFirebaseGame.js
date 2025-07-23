import { useState, useEffect, useRef } from 'react';
import { ref, set, onValue, off } from 'firebase/database';
import { database } from '../services/firebase';

export const useFirebaseGame = (gameId = 'default-game') => {
  // Game state
  const [currentGame, setCurrentGame] = useState({
    teamA: '',
    teamB: '',
    teamAScore: 0,
    teamBScore: 0,
    isPlaying: false,
    timeLeft: 420, // 7 minutes in seconds
  });

  const [queue, setQueue] = useState([]);
  const [champion, setChampion] = useState(null);
  const [championDefenseStreak, setChampionDefenseStreak] = useState(0);
  const [formerChampionName, setFormerChampionName] = useState(null);
  const [teamWins, setTeamWins] = useState({});
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isProcessingRef = useRef(false);
  const lastUpdateRef = useRef(0);
  const gameRef = ref(database, `games/${gameId}`);

  // Write data to Firebase
  const updateFirebaseGame = (updates) => {
    const gameData = {
      currentGame,
      queue,
      champion,
      championDefenseStreak,
      formerChampionName,
      teamWins: Object.fromEntries(
        Object.entries(teamWins).map(([key, value]) => [
          key,
          Array.from(value || [])
        ])
      ),
      lastUpdated: Date.now(),
      ...updates
    };

    set(gameRef, gameData).catch(console.error);
  };

  // Listen to Firebase updates
  useEffect(() => {
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.lastUpdated) {
        // Only update if this is newer than our last update (avoid overriding our own changes)
        if (data.lastUpdated > lastUpdateRef.current) {
          console.log('🔄 Syncing from Firebase:', data.lastUpdated);
          
          // Use default values instead of current state to avoid loops
          setCurrentGame(data.currentGame || {
            teamA: '',
            teamB: '',
            teamAScore: 0,
            teamBScore: 0,
            isPlaying: false,
            timeLeft: 420
          });
          setQueue(data.queue || []);
          setChampion(data.champion || null);
          setChampionDefenseStreak(data.championDefenseStreak || 0);
          setFormerChampionName(data.formerChampionName || null);
          setGameHistory(data.gameHistory || []);
          
          // Convert teamWins arrays back to Sets
          const wins = {};
          if (data.teamWins) {
            Object.entries(data.teamWins).forEach(([key, value]) => {
              wins[key] = new Set(value || []);
            });
          }
          setTeamWins(wins);
          
          setLoading(false);
          setError(null);
        } else {
          console.log('⏭️ Skipping Firebase sync - local is newer');
        }
      } else {
        // No data yet, set loading to false
        setLoading(false);
      }
    }, (error) => {
      console.error('🚨 Firebase Error:', error);
      setError(`เชื่อมต่อฐานข้อมูลไม่ได้: ${error.message}`);
      setLoading(false);
    });

    return () => off(gameRef);
  }, [gameId]);

  // Batch update function for multiple state changes
  const updateGameState = (updates) => {
    // Build complete state object with current values + updates
    const newState = {
      currentGame: updates.currentGame !== undefined ? 
        (typeof updates.currentGame === 'function' ? updates.currentGame(currentGame) : updates.currentGame) : 
        currentGame,
      queue: updates.queue !== undefined ? updates.queue : queue,
      champion: updates.champion !== undefined ? updates.champion : champion,
      championDefenseStreak: updates.championDefenseStreak !== undefined ? updates.championDefenseStreak : championDefenseStreak,
      formerChampionName: updates.formerChampionName !== undefined ? updates.formerChampionName : formerChampionName,
      teamWins: updates.teamWins !== undefined ? updates.teamWins : teamWins,
      gameHistory: updates.gameHistory !== undefined ? updates.gameHistory : gameHistory
    };

    // Update local state
    if (updates.currentGame !== undefined) setCurrentGame(newState.currentGame);
    if (updates.queue !== undefined) setQueue(newState.queue);
    if (updates.champion !== undefined) setChampion(newState.champion);
    if (updates.championDefenseStreak !== undefined) setChampionDefenseStreak(newState.championDefenseStreak);
    if (updates.formerChampionName !== undefined) setFormerChampionName(newState.formerChampionName);
    if (updates.teamWins !== undefined) setTeamWins(newState.teamWins);
    if (updates.gameHistory !== undefined) setGameHistory(newState.gameHistory);
    
    // Update Firebase with complete state
    setTimeout(() => {
      const timestamp = Date.now();
      lastUpdateRef.current = timestamp; // Track our own updates
      
      const gameData = {
        ...newState,
        teamWins: Object.fromEntries(
          Object.entries(newState.teamWins).map(([key, value]) => [
            key,
            Array.from(value || [])
          ])
        ),
        gameHistory: newState.gameHistory || [],
        lastUpdated: timestamp
      };
      
      console.log('📤 Updating Firebase:', timestamp, updates);
      set(gameRef, gameData).catch(console.error);
    }, 50);
  };

  // Individual setters for backward compatibility
  const setCurrentGameWithSync = (newGame) => {
    updateGameState({ currentGame: newGame });
  };

  const setQueueWithSync = (newQueue) => {
    updateGameState({ queue: newQueue });
  };

  const setChampionWithSync = (newChampion) => {
    updateGameState({ champion: newChampion });
  };

  const setChampionDefenseStreakWithSync = (newStreak) => {
    updateGameState({ championDefenseStreak: newStreak });
  };

  const setFormerChampionNameWithSync = (newName) => {
    updateGameState({ formerChampionName: newName });
  };

  const setTeamWinsWithSync = (newWins) => {
    updateGameState({ teamWins: newWins });
  };

  return {
    // State
    currentGame,
    queue,
    champion,
    championDefenseStreak,
    formerChampionName,
    teamWins,
    gameHistory,
    loading,
    error,
    isProcessingRef,
    
    // Setters with Firebase sync
    setCurrentGame: setCurrentGameWithSync,
    setQueue: setQueueWithSync,
    setChampion: setChampionWithSync,
    setChampionDefenseStreak: setChampionDefenseStreakWithSync,
    setFormerChampionName: setFormerChampionNameWithSync,
    setTeamWins: setTeamWinsWithSync,
    setGameHistory: (newHistory) => updateGameState({ gameHistory: newHistory }),
    
    // Batch update
    updateGameState,
    
    // Utility
    updateFirebaseGame
  };
};