import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GameRules = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            📜
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">กฎการเล่น</h2>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all text-sm"
        >
          {isExpanded ? (
            <>
              ซ่อน <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              แสดงทั้งหมด <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⏰</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">เวลาการเล่น</h3>
              <p className="text-gray-600 text-sm mb-2">แต่ละเกมใช้เวลา 7 นาที</p>
              <p className="text-gray-600 text-xs">• เสมอ = ต่อเวลา 1 นาที</p>
              <p className="text-gray-600 text-xs">• หมดเวลา = ทีมแต้มมากชนะ</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🏆</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">เงื่อนไขชนะ</h3>
              <p className="text-gray-600 text-sm mb-2">• ได้ 15 แต้มก่อน = ชนะทันที</p>
              <p className="text-gray-600 text-sm">• ชนะ 2 ทีมต่างกัน = แชมป์</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <div className="flex items-start gap-3">
            <div className="text-2xl">👑</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">ระบบแชมป์</h3>
              <p className="text-gray-600 text-sm mb-2">• แชมป์พักรอ ทีมอื่นเล่นก่อน</p>
              <p className="text-gray-600 text-sm">• หลังจบคู่ แชมป์กลับมาเล่น</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📝</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">การให้คะแนน</h3>
              <p className="text-gray-600 text-xs">• +1, +2, +3 และ -1 คะแนน</p>
              <p className="text-gray-600 text-xs">• ใช้ปุ่มบนหน้าจอ</p>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-6 pt-6 border-t border-blue-200">
          {/* Advanced Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🛡️</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">การป้องกันตำแหน่ง</h3>
                  <p className="text-gray-600 text-sm mb-2">• แชมป์เก่าต้องชนะ 2 เกมติดกัน</p>
                  <p className="text-gray-600 text-sm">• จะกลับมาเป็นแชมป์</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">กฎพิเศษ</h3>
                  <p className="text-gray-600 text-sm mb-2">• กด Spacebar เพื่อเริ่ม/หยุดเกม</p>
                  <p className="text-gray-600 text-sm">• เสียงเตือนเมื่อได้แต้ม</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-teal-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">👥</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">การจัดการคิว</h3>
                  <p className="text-gray-600 text-sm mb-2">• เพิ่ม/ลบผู้เล่นได้ตลอดเวลา</p>
                  <p className="text-gray-600 text-sm">• คนแพ้กลับไปคิวท้าย</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-pink-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💾</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">การบันทึกข้อมูล</h3>
                  <p className="text-gray-600 text-sm mb-2">• ข้อมูลถูกบันทึกอัตโนมัติ</p>
                  <p className="text-gray-600 text-sm">• ดูประวัติได้ในแท็บประวัติ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-500">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⌨️</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-3">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">เริ่ม/หยุดเกม:</span>
                    <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">รีเซ็ตเกม:</span>
                    <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">R</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ทีม A +1:</span>
                    <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Q</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ทีม B +1:</span>
                    <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">P</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4">
        <div className="text-center">
          <div className="text-2xl mb-2">🔥</div>
          <h3 className="font-bold mb-1">พร้อมเล่นแล้ว?</h3>
          <p className="text-sm opacity-90">เพิ่มชื่อเข้าคิวและเริ่มเล่นบาสกันเถอะ!</p>
        </div>
      </div>
    </div>
  );
};

export default GameRules;