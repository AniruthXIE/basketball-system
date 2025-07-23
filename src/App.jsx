import { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TournamentPage from './pages/TournamentPage';
import PhotosPage from './pages/PhotosPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import CelebrationModal from './components/CelebrationModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const BasketballQueueSystem = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'tournament':
        return <TournamentPage />;
      case 'photos':
        return <PhotosPage />;
      case 'history':
        return <HistoryPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ErrorBoundary>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black p-2 sm:p-4 relative overflow-hidden">
          {/* Luxury Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
            
            {renderPage()}
            
            <CelebrationModal />
            <LoadingSpinner />
          </div>
        </div>
      </GameProvider>
    </ErrorBoundary>
  );
};

function App() {
  return <BasketballQueueSystem />;
}

export default App;