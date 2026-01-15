// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-norwell-blue text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-norwell-gold mb-4">
              Norwell High School
            </h3>
            <p className="text-gray-300 text-sm">
              Athletic Hall of Fame
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Honoring excellence in Clipper athletics
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-norwell-gold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-norwell-gold transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-norwell-gold transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/inductees" className="text-gray-300 hover:text-norwell-gold transition-colors text-sm">
                  Inductees
                </Link>
              </li>
              <li>
                <Link to="/wall-of-fame" className="text-gray-300 hover:text-norwell-gold transition-colors text-sm">
                 Wall Of Fame
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-norwell-gold mb-4">
              Contact
            </h3>
            <p className="text-gray-300 text-sm">
              Chris Glynn
            </p>
            <p className="text-gray-300 text-sm">
              cktglynn@aol.com
            </p>
            <p className="text-gray-300 text-sm">
              781-223-3383
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Norwell High School Athletic Hall of Fame. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Proud to be a Norwell Clipper!
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
