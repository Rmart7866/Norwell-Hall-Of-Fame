// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../firebase/auth';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Classes', path: '/inductees' },
    { name: 'Inductees', path: '/athletes' },
    { name: 'Championships', path: '/championships' },
    { name: 'Wall Of Fame', path: '/wall-of-fame' },
    { name: 'Videos', path: '/videos' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/40 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 sm:py-6 lg:py-8">
          {/* Logo - Smaller on mobile */}
          <Link to="/" className="flex items-center group">
            <div className="h-16 sm:h-24 md:h-32 lg:h-40 shadow-2xl group-hover:shadow-amber-500/50 transition-all duration-300">
              <img 
                src="/images/logo.png" 
                alt="Norwell Hall of Fame Logo" 
                className="h-full w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white font-black text-base uppercase tracking-wider hover:text-amber-500 transition-colors duration-200 drop-shadow-lg relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            {currentUser ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="bg-yellow-600/80 text-white px-6 py-2 font-semibold text-sm uppercase hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-600/30 border border-yellow-700/50"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="border-2 border-white text-white px-6 py-2 font-semibold text-sm uppercase hover:bg-white hover:text-blue-900 transition-all duration-300 shadow-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="bg-yellow-600/80 text-white px-6 py-2 font-semibold text-sm uppercase hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-600/30 border border-yellow-700/50"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-6 bg-norwell-blue/95 backdrop-blur-sm mt-2 p-4 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-white font-bold uppercase hover:text-amber-500 transition-colors border-b border-white/10"
              >
                {link.name}
              </Link>
            ))}
            
            {currentUser ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-yellow-500 font-bold uppercase"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-3 text-white font-bold uppercase hover:text-amber-500 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-yellow-500 font-bold uppercase"
              >
                Admin Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
