import { useState } from 'react';
import { Home, Trophy, Camera, Settings, History, Menu, X } from 'lucide-react';

const Navbar = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'หน้าหลัก', icon: Home, description: 'เกมและคิว' },
    { id: 'tournament', label: 'ทัวร์นาเมนต์', icon: Trophy, description: 'จัดแข่งขัน' },
    { id: 'photos', label: 'รูปทีม', icon: Camera, description: 'จัดการรูปภาพ' },
    { id: 'history', label: 'ประวัติ', icon: History, description: 'ดูประวัติการแข่ง' },
    { id: 'admin', label: 'Admin', icon: Settings, description: 'ควบคุมระบบ' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl mb-6 sticky top-2 z-40 border border-gradient-to-r from-yellow-400/30 via-purple-400/30 to-pink-400/30 animate-slideInUp">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-purple-400/5 to-pink-400/5 rounded-2xl"></div>
        <div className="px-6 py-4 relative">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-slideInLeft">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float border border-yellow-400/30">
                <span className="text-xl drop-shadow-lg">🏀</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">Basketball Queue</h1>
                <p className="text-xs text-gray-300">ระบบจัดคิวบาสเกตบอล</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2 animate-slideInRight">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className={`btn-interactive flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black shadow-2xl transform scale-105 animate-glow border border-yellow-400/50' 
                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-white hover:shadow-xl card-hover border border-transparent hover:border-purple-400/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 border border-purple-400/30 hover:border-purple-400/50"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePageChange(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all text-left ${
                        isActive 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className={`text-xs ${isActive ? 'text-orange-100' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;