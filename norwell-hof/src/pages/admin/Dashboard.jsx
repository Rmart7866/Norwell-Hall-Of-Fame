// src/pages/admin/Dashboard.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Trophy, Users, Image, Video, Calendar } from 'lucide-react';
import ManageClasses from '../../components/admin/ManageClasses';
import ManageChampionships from '../../components/admin/ManageChampionships';
import ManageChampionshipPhotos from '../../components/admin/ManageChampionshipPhotos';
import ManageInductees from '../../components/admin/ManageInductees';
import ManagePhotos from '../../components/admin/ManagePhotos';
import ManageVideos from '../../components/admin/ManageVideos';
import DataSeeder from '../../components/admin/DataSeeder';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'championships', label: 'Championships', icon: Trophy },
    { id: 'championship-photos', label: 'Championship Photos', icon: Image },
    { id: 'classes', label: 'Manage Classes', icon: Calendar },
    { id: 'inductees', label: 'Manage Inductees', icon: Users },
    { id: 'photos', label: 'Manage Photos', icon: Image },
    { id: 'videos', label: 'Manage Videos', icon: Video },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-32">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-norwell-blue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.email}</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-norwell-blue text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'championships' && <ManageChampionships />}
          {activeTab === 'championship-photos' && <ManageChampionshipPhotos />}
          {activeTab === 'classes' && <ManageClasses />}
          {activeTab === 'inductees' && <ManageInductees />}
          {activeTab === 'photos' && <ManagePhotos />}
          {activeTab === 'videos' && <ManageVideos />}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-norwell-blue mb-6">Dashboard Overview</h2>
      
      {/* Data Seeder Component */}
      <div className="mb-8">
        <DataSeeder />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <Calendar className="w-12 h-12 mb-3 opacity-80" />
          <p className="text-3xl font-bold mb-1">-</p>
          <p className="text-blue-100">Total Classes</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <Users className="w-12 h-12 mb-3 opacity-80" />
          <p className="text-3xl font-bold mb-1">-</p>
          <p className="text-green-100">Total Inductees</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <Image className="w-12 h-12 mb-3 opacity-80" />
          <p className="text-3xl font-bold mb-1">-</p>
          <p className="text-purple-100">Total Photos</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
          <Video className="w-12 h-12 mb-3 opacity-80" />
          <p className="text-3xl font-bold mb-1">-</p>
          <p className="text-red-100">Total Videos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-norwell-blue transition-colors">
          <h3 className="text-xl font-bold text-norwell-blue mb-3 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Getting Started
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Use the Data Seeder above for quick testing</li>
            <li>Or manually add classes in "Manage Classes"</li>
            <li>Add inductees to classes in "Manage Inductees"</li>
            <li>Add championships in "Championships" tab</li>
            <li>Upload photos and videos as needed</li>
          </ol>
        </div>

        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-norwell-blue mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Data Seeder includes realistic test data</li>
            <li>✅ Photos auto-load from Unsplash</li>
            <li>✅ Delete test data anytime from manage tabs</li>
            <li>✅ Check the timeline at /inductees after upload</li>
            <li>✅ Use Championship Photos tab to add gallery images</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;