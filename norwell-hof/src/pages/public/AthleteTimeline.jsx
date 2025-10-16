// src/pages/public/AthleteTimeline.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Trophy, Users, Award, User, GraduationCap, MousePointerClick } from 'lucide-react';

const AthleteTimeline = () => {
  const [athletesByYear, setAthletesByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const inducteesRef = collection(db, 'inductees');
        const q = query(inducteesRef, orderBy('graduationYear', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const grouped = {};
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          const year = data.graduationYear || 'Unknown';
          
          if (!grouped[year]) {
            grouped[year] = [];
          }
          grouped[year].push(data);
        });
        
        setAthletesByYear(grouped);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.dataset.index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && Object.keys(athletesByYear).length > 0) {
      const elements = document.querySelectorAll('[data-index]');
      elements.forEach((el) => {
        if (observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    }
  }, [loading, athletesByYear]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Athletes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 px-4 pt-32">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const years = Object.keys(athletesByYear).sort((a, b) => {
    if (a === 'Unknown') return 1;
    if (b === 'Unknown') return -1;
    return b - a;
  }).filter(year => year !== 'Unknown' && athletesByYear[year].length > 0);

  let globalAthleteIndex = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      {/* Header Section */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Athletes by <span className="text-yellow-500">Graduation Year</span>
            </h1>
            <p className="text-xl text-gray-300 mt-4">
              Celebrating excellence across the decades
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 pb-24 relative overflow-hidden">
        {/* Animated fog/mist background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {years.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h2 className="text-3xl font-bold text-white mb-4">No Athletes Yet</h2>
              <p className="text-gray-400 text-lg">Athletes will appear here once they are added to the database.</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto relative">
              {/* Vertical Line */}
              <div 
                className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-yellow-500/60 via-yellow-600/40 to-yellow-500/60 origin-top"
                style={{
                  boxShadow: '0 0 15px rgba(234, 179, 8, 0.2)'
                }}
              ></div>

              {/* Timeline Items by Year */}
              <div className="space-y-32 relative">
                {years.map((year, yearIndex) => {
                  const athletes = athletesByYear[year];
                  
                  return (
                    <div key={year} className="relative">
                      {/* Faded year background */}
                      <div 
                        className="absolute pointer-events-none select-none hidden md:block"
                        style={{ 
                          fontSize: '14rem',
                          lineHeight: '1',
                          fontWeight: '900',
                          color: 'rgba(100, 116, 139, 0.04)',
                          top: '10%',
                          left: '50%',
                          transform: `translateX(-50%)`,
                          whiteSpace: 'nowrap',
                          zIndex: 0
                        }}
                      >
                        {year}
                      </div>

                      {/* Year Header */}
                      <div className="text-center mb-20 relative" style={{ zIndex: 20 }}>
                        <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-8 py-3 rounded-full font-black text-3xl shadow-lg mb-2">
                          {year}
                        </div>
                        <p className="text-gray-400 text-sm uppercase tracking-wide">
                          Graduation Year • {athletes.length} {athletes.length === 1 ? 'Athlete' : 'Athletes'}
                        </p>
                      </div>

                      {/* Athletes - Staggered Left/Right */}
                      <div className="space-y-24 relative" style={{ zIndex: 10 }}>
                        {athletes.map((athlete) => {
                          const isEven = globalAthleteIndex % 2 === 0;
                          const cardIndex = `${yearIndex}-${globalAthleteIndex}`;
                          const isVisible = visibleItems.has(cardIndex);
                          globalAthleteIndex++;

                          return (
                            <div key={athlete.id} data-index={cardIndex} className="relative">
                              {/* Desktop Layout - Staggered */}
                              <div className="hidden md:block">
                                <div className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'} transition-all duration-700 ${
                                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}>
                                  {/* Card Container */}
                                  <div className="w-5/12 relative" style={{ zIndex: 10 }}>
                                    {/* Connecting line - BEFORE the Link */}
                                    <div className={`absolute top-1/2 ${isEven ? 'left-full' : 'right-full'} w-16 h-px ${isEven ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-yellow-500/40 to-transparent`}></div>
                                    
                                    <Link 
                                      to={`/inductees/${athlete.id}`} 
                                      className="block group perspective-1000"
                                      onMouseEnter={() => setHoveredCard(athlete.id)}
                                      onMouseLeave={() => setHoveredCard(null)}
                                    >
                                      {/* Baseball Card */}
                                      <div className="relative transform transition-all duration-700 hover:scale-105 hover:-rotate-2"
                                        style={{
                                          transformStyle: 'preserve-3d',
                                          transform: hoveredCard === athlete.id && athlete.secondPhotoURL ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                        }}>
                                        
                                        {/* Front of Card */}
                                        <div className="relative backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                                          <div className="bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-lg p-2 shadow-2xl border-4 border-yellow-600 hover:shadow-yellow-500/50 transition-shadow">
                                            <div className="bg-white rounded-md overflow-hidden shadow-lg">
                                              {/* Photo Section */}
                                              <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                                                {athlete.photoURL ? (
                                                  <img
                                                    src={athlete.photoURL}
                                                    alt={athlete.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                  />
                                                ) : (
                                                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
                                                    <User className="w-32 h-32 text-yellow-500 opacity-50 mb-4" />
                                                    <p className="text-yellow-500 font-bold text-lg">NORWELL</p>
                                                    <p className="text-white text-sm">HALL OF FAME</p>
                                                  </div>
                                                )}

                                                {/* Year Badge */}
                                                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                                                  '{year.toString().slice(-2)}
                                                </div>

                                             

                                                {/* Corner decorations */}
                                                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-500"></div>
                                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-500"></div>
                                              </div>

                                              {/* Info Section */}
                                              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 border-t-4 border-yellow-500">
                                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase text-center">
                                                  {athlete.name || 'Name Unavailable'}
                                                </h3>

                                                {/* Stats Box */}
                                                <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-md p-3 space-y-2">
                                                  {athlete.sport && (
                                                    <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <Award className="w-4 h-4 text-yellow-500" />
                                                        <span className="text-gray-400 text-xs font-bold uppercase">Sport</span>
                                                      </div>
                                                      <span className="text-white font-bold text-sm">{athlete.sport}</span>
                                                    </div>
                                                  )}
                                                  {athlete.classYear && (
                                                    <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                                        <span className="text-gray-400 text-xs font-bold uppercase">HOF Class</span>
                                                      </div>
                                                      <span className="text-white font-bold text-sm">{athlete.classYear}</span>
                                                    </div>
                                                  )}
                                                  {!athlete.sport && !athlete.classYear && (
                                                    <p className="text-gray-500 italic text-center text-sm py-2">
                                                      Stats coming soon...
                                                    </p>
                                                  )}
                                                </div>

                                                {/* View Profile Button */}
                                                <div className="mt-4 text-center">
                                                  <span className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-4 py-2 rounded-md font-black text-sm uppercase group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all shadow-lg transform group-hover:scale-105">
                                                    View Profile →
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Back of Card (if second photo exists) */}
                                        {athlete.secondPhotoURL && (
                                          <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                            <div className="bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-lg p-2 shadow-2xl border-4 border-yellow-600 h-full">
                                              <div className="bg-white rounded-md overflow-hidden shadow-lg h-full flex flex-col">
                                                <div className="relative flex-1 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                                                  <img
                                                    src={athlete.secondPhotoURL}
                                                    alt={`${athlete.name} - alternate`}
                                                    className="w-full h-full object-cover"
                                                  />
                                                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                                                    '{year.toString().slice(-2)}
                                                  </div>
                                                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-500"></div>
                                                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-500"></div>
                                                </div>
                                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-center border-t-4 border-yellow-500">
                                                  <p className="text-yellow-500 font-black text-lg uppercase">{athlete.name}</p>
                                                  <span className="inline-block mt-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-4 py-2 rounded-md font-black text-sm uppercase">
                                                    Click to View Profile →
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Card Shadow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-transparent rounded-lg transform translate-y-2 -z-10"></div>
                                      </div>
                                    </Link>
                                  </div>

                                  {/* Center Timeline Dot */}
                                  <div className="absolute left-1/2 transform -translate-x-1/2 z-30">
                                    <div className="relative">
                                      <div className="absolute inset-0 w-10 h-10 bg-yellow-500/20 rounded-full blur-lg animate-pulse"></div>
                                      <div className="relative w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-4 border-slate-900 shadow-lg">
                                        <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-10"></div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Spacer */}
                                  <div className="w-5/12"></div>
                                </div>
                              </div>

                              {/* Mobile Layout */}
                              <div className="md:hidden">
                                <Link 
                                  to={`/inductees/${athlete.id}`} 
                                  className="block group"
                                  onMouseEnter={() => setHoveredCard(athlete.id)}
                                  onMouseLeave={() => setHoveredCard(null)}
                                >
                                  <div 
                                    className={`transition-all duration-700 ${
                                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                  >
                                    <div className="bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-lg p-2 shadow-2xl border-4 border-yellow-600">
                                      <div className="bg-white rounded-md overflow-hidden shadow-lg">
                                        <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                                          {athlete.photoURL ? (
                                            <img
                                              src={athlete.photoURL}
                                              alt={athlete.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
                                              <User className="w-32 h-32 text-yellow-500 opacity-50 mb-4" />
                                              <p className="text-yellow-500 font-bold text-lg">NORWELL</p>
                                              <p className="text-white text-sm">HALL OF FAME</p>
                                            </div>
                                          )}
                                          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                                            '{year.toString().slice(-2)}
                                          </div>
                                          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-500"></div>
                                          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-500"></div>
                                        </div>

                                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 border-t-4 border-yellow-500">
                                          <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase text-center">
                                            {athlete.name || 'Name Unavailable'}
                                          </h3>

                                          <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-md p-3 space-y-2">
                                            {athlete.sport && (
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <Award className="w-4 h-4 text-yellow-500" />
                                                  <span className="text-gray-400 text-xs font-bold uppercase">Sport</span>
                                                </div>
                                                <span className="text-white font-bold text-sm">{athlete.sport}</span>
                                              </div>
                                            )}
                                            {athlete.classYear && (
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <Trophy className="w-4 h-4 text-yellow-500" />
                                                  <span className="text-gray-400 text-xs font-bold uppercase">HOF Class</span>
                                                </div>
                                                <span className="text-white font-bold text-sm">{athlete.classYear}</span>
                                              </div>
                                            )}
                                          </div>

                                          <div className="mt-4 text-center">
                                            <span className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-4 py-2 rounded-md font-black text-sm uppercase">
                                              View Profile →
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline End Cap */}
              <div className="hidden md:flex justify-center mt-12">
                <div className="relative">
                  <div className="absolute inset-0 w-6 h-6 bg-yellow-500/20 rounded-full blur-md animate-pulse"></div>
                  <div className="relative w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-yellow-600 to-yellow-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Explore by Induction Class
          </h2>
          <p className="text-xl text-slate-800 mb-8 max-w-2xl mx-auto">
            View athletes organized by their Hall of Fame induction year.
          </p>
          <Link
            to="/inductees"
            className="inline-block bg-slate-900 text-yellow-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Induction Timeline
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AthleteTimeline;