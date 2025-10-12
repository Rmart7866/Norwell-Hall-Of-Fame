// src/pages/public/Home.jsx
import { Link } from 'react-router-dom';
import { Trophy, Users, Images, Video } from 'lucide-react';
import PageBanner from '../../components/common/PageBanner';

const Home = () => {
  return (
    <div>
      {/* Full-Screen Banner */}
      <PageBanner 
        title="NORWELL CLIPPER HALL OF FAME"
        subtitle="Honoring Excellence in Athletics"
        backgroundImage="https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&q=80"
      />

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 p-8 text-center transform hover:-translate-y-3 hover:scale-105 group border border-gray-100">
              <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-400 group-hover:scale-125 transition-transform duration-500" />
              <p className="text-6xl font-black text-blue-900 mb-3 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">15+</p>
              <p className="text-gray-700 font-bold text-lg">Years of Excellence</p>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 p-8 text-center transform hover:-translate-y-3 hover:scale-105 group border border-gray-100">
              <Users className="w-16 h-16 mx-auto mb-6 text-yellow-400 group-hover:scale-125 transition-transform duration-500" />
              <p className="text-6xl font-black text-blue-900 mb-3 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">100+</p>
              <p className="text-gray-700 font-bold text-lg">Honored Inductees</p>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 p-8 text-center transform hover:-translate-y-3 hover:scale-105 group border border-gray-100">
              <Images className="w-16 h-16 mx-auto mb-6 text-yellow-400 group-hover:scale-125 transition-transform duration-500" />
              <p className="text-6xl font-black text-blue-900 mb-3 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">500+</p>
              <p className="text-gray-700 font-bold text-lg">Memorable Photos</p>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 p-8 text-center transform hover:-translate-y-3 hover:scale-105 group border border-gray-100">
              <Video className="w-16 h-16 mx-auto mb-6 text-yellow-400 group-hover:scale-125 transition-transform duration-500" />
              <p className="text-6xl font-black text-blue-900 mb-3 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">50+</p>
              <p className="text-gray-700 font-bold text-lg">Inspiring Videos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-6 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Latest Inductees
          </h2>
          <div className="h-2 w-32 bg-gradient-to-r from-blue-900 via-yellow-400 to-blue-900 mx-auto mb-16 rounded-full"></div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 p-12 transform hover:-translate-y-2 border border-gray-100">
              <div className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 rounded-full font-black text-xl mb-8 shadow-lg">
                Class of 2022
              </div>
              <p className="text-gray-700 text-xl mb-10 leading-relaxed">
                Join us in celebrating our newest inductees who have demonstrated 
                exceptional achievement and dedication to Norwell athletics.
              </p>
              <Link
                to="/inductees"
                className="inline-block bg-gradient-to-r from-blue-900 to-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-900/50 uppercase tracking-wider"
              >
                View All Inductees →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-32 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            Know Someone <span className="text-yellow-400">Deserving</span><br />of Recognition?
          </h2>
          <p className="text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Nominations for the Hall of Fame are accepted annually. Help us honor 
            those who have made a lasting impact on Norwell athletics.
          </p>
          <Link
            to="/about"
            className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-12 py-5 rounded-full font-black text-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-yellow-400/50 uppercase tracking-wider"
          >
            Learn More →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;