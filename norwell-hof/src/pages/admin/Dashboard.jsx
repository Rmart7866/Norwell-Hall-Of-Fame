import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-norwell-blue mb-6">Admin Dashboard</h1>
      <p className="text-gray-700 text-lg">Welcome, {currentUser.email}!</p>
      <p className="text-gray-600 mt-4">Dashboard functionality coming soon...</p>
    </div>
  );
};

export default Dashboard;