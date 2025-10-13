// src/pages/public/Home.jsx
import { Link } from 'react-router-dom';
import { Trophy, Users, Images, Video, Star } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* MASSIVE Hero Banner - Full viewport height */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/images/banner.jpg)`,
          }}
        />
        
        {/* Dramatic dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-blue-900/80 to-black/90"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
            <span className="block animate-slide-in-left">NORWELL HIGH SCHOOL</span>
            <span className="block text-amber-500 animate-slide-in-right animation-delay-200">ATHLETIC</span>
            <span className="block animate-slide-in-left animation-delay-400">HALL OF FAME</span>
          </h1>
          
          <div className="h-1 w-full max-w-2xl bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-10 opacity-0 animate-fade-in animation-delay-600"></div>
          
          <p className="text-3xl md:text-4xl font-bold text-gray-200 tracking-wide drop-shadow-lg animate-fade-in-up animation-delay-800">
           
          </p>
        </div>
      </div>

      {/* Bold Stats Section with Dramatic Styling */}
      <section className="relative py-32 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Star className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              BY THE <span className="text-yellow-400">NUMBERS</span>
            </h2>
            <div className="h-3 w-64 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-10"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Trophy, number: "15+", label: "Years of Excellence", color: "from-amber-500 to-amber-600" },
              { icon: Users, number: "100+", label: "Honored Inductees", color: "from-blue-400 to-blue-600" },
              { icon: Images, number: "500+", label: "Memorable Photos", color: "from-amber-500 to-amber-600" },
              { icon: Video, number: "50+", label: "Inspiring Videos", color: "from-blue-400 to-blue-600" }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-blue-900 to-blue-800 p-10 text-center transform hover:-translate-y-4 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/30 border-2 border-amber-500/20 hover:border-amber-500 clip-corner"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-amber-500/5 transition-all duration-500"></div>
                  
                  <IconComponent className="w-20 h-20 mx-auto mb-6 text-amber-500 group-hover:scale-125 transition-transform duration-500" />
                  
                  <p className={`text-8xl font-black mb-4 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </p>
                  
                  <p className="text-white font-bold text-xl uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Inductees with Bold Cards */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-10 py-4 bg-blue-900 text-amber-500 font-black text-2xl mb-8 transform -rotate-1 shadow-2xl border-4 border-amber-500">
              LATEST
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-blue-900 mb-6 tracking-tight">
              CLASS OF <span className="text-amber-500">2022</span>
            </h2>
            <div className="h-2 w-48 bg-gradient-to-r from-blue-900 via-amber-500 to-blue-900 mx-auto"></div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-blue-900 to-blue-800 shadow-2xl p-16 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border-4 border-amber-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 blur-3xl"></div>
              
              <div className="relative z-10">
                <p className="text-white text-2xl mb-12 leading-relaxed font-medium">
                  Join us in celebrating our newest inductees who have demonstrated 
                  <span className="font-black text-amber-500"> exceptional achievement</span> and 
                  <span className="font-black text-amber-500"> unwavering dedication</span> to Norwell athletics.
                </p>
                
                <Link
                  to="/inductees"
                  className="inline-block bg-amber-500 text-blue-900 px-14 py-6 font-black text-2xl hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/50 uppercase tracking-widest border-4 border-amber-600"
                >
                  Meet the Inductees →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful CTA Section */}
      <section className="relative py-40 bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Trophy className="w-28 h-28 text-amber-500 mx-auto mb-10 animate-pulse" />
          
          <h2 className="text-6xl md:text-8xl font-black mb-10 leading-tight tracking-tighter">
            KNOW SOMEONE<br />
            <span className="text-amber-500">EXTRAORDINARY?</span>
          </h2>
          
          <div className="h-2 w-64 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-12"></div>
          
          <p className="text-2xl md:text-3xl mb-16 text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
            Nominations for the Hall of Fame are accepted annually.<br />
            <span className="text-amber-500 font-bold">Help us honor those who made a lasting impact.</span>
          </p>
          
          <Link
            to="/about"
            className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-blue-900 px-16 py-7 font-black text-3xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/50 uppercase tracking-widest border-4 border-amber-700"
          >
            Nominate Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;