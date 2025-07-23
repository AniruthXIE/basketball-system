import React from 'react';
import TeamPhotos from '../components/TeamPhotos';

const PhotosPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gold-text mb-3 drop-shadow-lg">📸 จัดการรูปภาพทีม</h1>
        <p className="text-gray-300 text-lg">อัปโหลดและจัดการรูปภาพของแต่ละทีม</p>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      <TeamPhotos />
    </div>
  );
};

export default PhotosPage;