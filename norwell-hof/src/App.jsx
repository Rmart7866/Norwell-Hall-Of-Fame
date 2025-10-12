// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Inductees from './pages/public/Inductees';
import InducteeProfile from './pages/public/InducteeProfile';
import Galleries from './pages/public/Galleries';
import Videos from './pages/public/Videos';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/inductees" element={<Inductees />} />
              <Route path="/inductees/:id" element={<InducteeProfile />} />
              <Route path="/galleries" element={<Galleries />} />
              <Route path="/videos" element={<Videos />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;