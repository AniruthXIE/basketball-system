import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X, Edit } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const TeamPhotos = () => {
  const { updateGameState } = useGame();
  const [teamPhotos, setTeamPhotos] = useState({});
  const [showUpload, setShowUpload] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhotos = {
          ...teamPhotos,
          [selectedTeam]: {
            url: e.target.result,
            name: file.name,
            uploaded: Date.now()
          }
        };
        setTeamPhotos(newPhotos);
        
        // Save to localStorage for persistence
        localStorage.setItem('basketballTeamPhotos', JSON.stringify(newPhotos));
        
        setShowUpload(false);
        setSelectedTeam('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (teamName) => {
    const newPhotos = { ...teamPhotos };
    delete newPhotos[teamName];
    setTeamPhotos(newPhotos);
    localStorage.setItem('basketballTeamPhotos', JSON.stringify(newPhotos));
  };

  const openUploadDialog = (teamName) => {
    setSelectedTeam(teamName);
    setShowUpload(true);
  };

  // Load photos from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('basketballTeamPhotos');
    if (saved) {
      try {
        setTeamPhotos(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading team photos:', e);
      }
    }
  }, []);

  // Get unique team names from current game and history
  const allTeams = new Set();
  const { currentGame, gameHistory = [] } = useGame();
  
  if (currentGame.teamA) allTeams.add(currentGame.teamA);
  if (currentGame.teamB) allTeams.add(currentGame.teamB);
  
  gameHistory.forEach(game => {
    allTeams.add(game.winner);
    allTeams.add(game.loser);
  });

  const teamNames = Array.from(allTeams).filter(name => name && name !== 'BYE');

  if (teamNames.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            📸
          </div>
          <h2 className="text-2xl font-bold text-gray-800">รูปภาพทีม</h2>
        </div>
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <div className="text-4xl mb-4">📷</div>
          <p className="text-gray-500 text-lg">ยังไม่มีทีมในระบบ</p>
          <p className="text-gray-400 text-sm">เริ่มเกมเพื่อเพิ่มรูปภาพทีม</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            📸
          </div>
          <h2 className="text-2xl font-bold text-gray-800">รูปภาพทีม</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teamNames.map(team => (
            <div key={team} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="w-full h-32 mb-3 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {teamPhotos[team] ? (
                  <img
                    src={teamPhotos[team].url}
                    alt={team}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-xs">ไม่มีรูป</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-gray-800 mb-2 truncate">{team}</h3>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openUploadDialog(team)}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
                >
                  {teamPhotos[team] ? <Edit className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                  {teamPhotos[team] ? 'แก้ไข' : 'อัปโหลด'}
                </button>
                
                {teamPhotos[team] && (
                  <button
                    onClick={() => removePhoto(team)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-lg text-xs transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-bold text-blue-800 mb-1">เคล็ดลับการใช้งาน</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• อัปโหลดรูปทีมเพื่อให้ง่ายต่อการจดจำ</li>
                <li>• รองรับไฟล์ JPG, PNG, GIF</li>
                <li>• รูปจะถูกบันทึกในเบราว์เซอร์</li>
                <li>• รูปจะแสดงในหน้าสถิติและประวัติ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  อัปโหลดรูป: {selectedTeam}
                </h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">คลิกเพื่อเลือกรูปภาพ</p>
                  <p className="text-gray-400 text-sm">รองรับ JPG, PNG, GIF</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all"
                  >
                    เลือกไฟล์
                  </button>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-bold transition-all"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamPhotos;