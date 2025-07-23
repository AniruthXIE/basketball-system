import { useEffect, useRef } from 'react';

export const useAutoScroll = (dependencies = []) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, dependencies);

  return scrollRef;
};

// Scroll to current game when teams change
export const useScrollToGame = (currentGame) => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (currentGame.teamA && currentGame.teamB && gameRef.current) {
      setTimeout(() => {
        gameRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 500);
    }
  }, [currentGame.teamA, currentGame.teamB]);

  return gameRef;
};