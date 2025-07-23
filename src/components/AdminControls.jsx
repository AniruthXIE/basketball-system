import { useState } from 'react';
import { Settings, Clock, Trophy, Users, Database, Download, Upload } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const AdminControls = () => {
  const { currentGame, updateGameState, gameHistory } = useGame();
  const [showControls, setShowControls] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    gameTime: 420, // 7 minutes
    overtimeTime: 60, // 1 minute
    winScore: 15, // points to win instantly
    championWins: 2 // teams to beat to become champion
  });

  const authenticate = () => {
    // Simple password check (in production, use proper authentication)
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setShowControls(true);
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const updateGameTime = (newTime) => {
    setGameSettings(prev => ({ ...prev, gameTime: newTime }));
    updateGameState({
      currentGame: {
        ...currentGame,
        timeLeft: newTime
      }
    });
  };

  const exportData = () => {
    const data = {
      gameHistory,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `basketball-queue-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.gameHistory) {
            updateGameState({
              gameHistory: data.gameHistory
            });
            alert('นำเข้าข้อมูลสำเร็จ!');
          }
        } catch (error) {
          alert('ไฟล์ไม่ถูกต้อง');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (confirm('⚠️ ต้องการลบข้อมูลทั้งหมดใช่หรือไม่?\n\n- ประวัติการแข่งขัน\n- สถิติผู้เล่น\n- ข้อมูลแชมป์\n\nการกระทำนี้ไม่สามารถยกเลิกได้!')) {
      updateGameState({
        currentGame: {
          teamA: '',
          teamB: '',
          teamAScore: 0,
          teamBScore: 0,
          isPlaying: false,
          timeLeft: 420
        },
        queue: [],
        champion: null,
        championDefenseStreak: 0,
        formerChampionName: null,
        teamWins: {},
        gameHistory: []
      });
      
      // Clear localStorage
      localStorage.removeItem('basketballTeamPhotos');
      
      alert('ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
    }
  };

  const addTestData = () => {
    const testHistory = [
      {
        winner: 'ทีม A',
        loser: 'ทีม B',
        score: '15-12',
        duration: 350,
        timestamp: Date.now() - 3600000,
        type: 'championship'
      },
      {
        winner: 'ทีม C',
        loser: 'ทีม D',
        score: '11-8',
        duration: 420,
        timestamp: Date.now() - 1800000,
        type: 'win'
      }
    ];
    
    updateGameState({
      gameHistory: [...gameHistory, ...testHistory]
    });
    
    alert('เพิ่มข้อมูลทดสอบแล้ว');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Controls</h2>
        </div>
        
        <div className="max-w-md">
          <p className="text-gray-600 mb-4">กรอกรหัสผ่านเพื่อเข้าใช้งานควบคุมระบบ</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && authenticate()}
              placeholder="รหัสผ่าน..."
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              onClick={authenticate}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl font-bold transition-all"
            >
              เข้าสู่ระบบ
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">รหัสผ่านเริ่มต้น: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-xl shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            ⚙️
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Controls</h2>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
        >
          ออกจากระบบ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Game Settings */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">ตั้งค่าเกม</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เวลาเกม (วินาที)
              </label>
              <input
                type="number"
                value={gameSettings.gameTime}
                onChange={(e) => setGameSettings(prev => ({ ...prev, gameTime: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                min="60"
                max="1800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                คะแนนชนะทันที
              </label>
              <input
                type="number"
                value={gameSettings.winScore}
                onChange={(e) => setGameSettings(prev => ({ ...prev, winScore: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                min="10"
                max="50"
              />
            </div>
            
            <button
              onClick={() => updateGameTime(gameSettings.gameTime)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              ใช้การตั้งค่า
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-800">การกระทำด่วน</h3>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => updateGameState({
                currentGame: { ...currentGame, teamAScore: currentGame.teamAScore + 5 }
              })}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              +5 แต้ม ทีม A
            </button>
            
            <button
              onClick={() => updateGameState({
                currentGame: { ...currentGame, teamBScore: currentGame.teamBScore + 5 }
              })}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              +5 แต้ม ทีม B
            </button>
            
            <button
              onClick={() => updateGameState({
                currentGame: { ...currentGame, timeLeft: 60 }
              })}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              ตั้งเวลา 1 นาที
            </button>
            
            <button
              onClick={() => updateGameState({
                currentGame: { ...currentGame, isPlaying: !currentGame.isPlaying }
              })}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              {currentGame.isPlaying ? 'หยุดเกม' : 'เริ่มเกม'}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-gray-800">จัดการข้อมูล</h3>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={exportData}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              ส่งออกข้อมูล
            </button>
            
            <label className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              นำเข้าข้อมูล
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={addTestData}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              เพิ่มข้อมูลทดสอบ
            </button>
            
            <button
              onClick={clearAllData}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              ลบข้อมูลทั้งหมด
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow">
        <h3 className="font-bold text-gray-800 mb-4">สถิติระบบ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{gameHistory.length}</div>
            <div className="text-sm text-blue-800">เกมทั้งหมด</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-600">
              {gameHistory.filter(g => g.type === 'championship').length}
            </div>
            <div className="text-sm text-yellow-800">แชมป์เปี้ยน</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {new Set([...gameHistory.map(g => g.winner), ...gameHistory.map(g => g.loser)]).size}
            </div>
            <div className="text-sm text-green-800">ผู้เล่นทั้งหมด</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">
              {gameHistory.length > 0 ? Math.round(gameHistory.reduce((acc, g) => acc + (g.duration || 420), 0) / gameHistory.length) : 0}
            </div>
            <div className="text-sm text-purple-800">เวลาเฉลี่ย (วิ)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminControls;