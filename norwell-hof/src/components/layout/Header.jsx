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
    { name: 'Inductees', path: '/inductees' },
    { name: 'Galleries', path: '/galleries' },
    { name: 'Videos', path: '/videos' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <span className="text-2xl font-black text-norwell-blue">N</span>
            </div>
            <div className="hidden md:block">
              <div className="text-white font-black text-xl leading-tight drop-shadow-lg">
                NORWELL
              </div>
              <div className="text-norwell-gold font-bold text-sm leading-tight drop-shadow-lg">
                CLIPPERS
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white font-bold text-sm uppercase tracking-wider hover:text-norwell-gold transition-colors duration-200 drop-shadow-lg relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-norwell-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            {currentUser ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="bg-norwell-gold text-norwell-blue px-6 py-2 rounded-full font-bold text-sm uppercase hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="border-2 border-white text-white px-6 py-2 rounded-full font-bold text-sm uppercase hover:bg-white hover:text-norwell-blue transition-all duration-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="bg-norwell-gold text-norwell-blue px-6 py-2 rounded-full font-bold text-sm uppercase hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-6 bg-norwell-blue/95 backdrop-blur-sm rounded-lg mt-2 p-4 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-white font-bold uppercase hover:text-norwell-gold transition-colors border-b border-white/10"
              >
                {link.name}
              </Link>
            ))}
            
            {currentUser ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-norwell-gold font-bold uppercase"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-3 text-white font-bold uppercase hover:text-norwell-gold transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-norwell-gold font-bold uppercase"
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