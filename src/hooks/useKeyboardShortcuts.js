import { useEffect } from 'react';

export const useKeyboardShortcuts = (callbacks) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = event.key.toLowerCase();
      
      switch (key) {
        case ' ': // Spacebar
          event.preventDefault();
          callbacks.toggleGame?.();
          break;
        case 'r':
          event.preventDefault();
          callbacks.resetGame?.();
          break;
        case 'q':
          event.preventDefault();
          callbacks.teamAScore?.();
          break;
        case 'p':
          event.preventDefault();
          callbacks.teamBScore?.();
          break;
        case 'escape':
          event.preventDefault();
          callbacks.closeCelebration?.();
          break;
        case 'enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            callbacks.startNewMatch?.();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [callbacks]);
};