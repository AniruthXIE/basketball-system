import React from 'react';
import AdminControls from '../components/AdminControls';

const AdminPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gold-text mb-3 drop-shadow-lg">⚙️ ระบบควบคุม</h1>
        <p className="text-gray-300 text-lg">จัดการและควบคุมระบบ Basketball Queue</p>
        <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-orange-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      <AdminControls />
    </div>
  );
};

export default AdminPage;