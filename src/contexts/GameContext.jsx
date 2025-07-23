import { createContext, useContext, useMemo } from 'react';
import { useFirebaseGame } from '../hooks/useFirebaseGame';
import { GameLogic } from '../services/gameLogic';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children, gameId = 'default-game' }) => {
  const gameState = useFirebaseGame(gameId);
  
  // Create game logic instance
  const gameLogic = useMemo(() => {
    return new GameLogic(gameState, gameState.updateGameState);
  }, [gameState]);

  // Enhanced game state with logic functions
  const enhancedGameState = useMemo(() => ({
    ...gameState,
    handleGameEnd: gameLogic.handleGameEnd,
    startNextMatch: gameLogic.startNextMatch,
    championReturns: gameLogic.championReturns,
    continueMatch: gameLogic.continueMatch
  }), [gameState, gameLogic]);

  return (
    <GameContext.Provider value={enhancedGameState}>
      {children}
    </GameContext.Provider>
  );
};