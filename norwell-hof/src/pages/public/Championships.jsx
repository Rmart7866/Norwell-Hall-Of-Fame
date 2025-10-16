// src/pages/public/Championships.jsx
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Trophy, Filter, User as UserIcon } from 'lucide-react';

const Championships = () => {
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSport, setSelectedSport] = useState('All');
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchChampionships = async () => {
      setLoading(true);
      try {
        const championshipsRef = collection(db, 'championships');
        const q = query(championshipsRef, orderBy('year', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const championshipsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setChampionships(championshipsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChampionships();
  }, []);

  // Intersection Observer for scroll animations
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
    if (!loading && championships.length > 0) {
      const elements = document.querySelectorAll('[data-index]');
      elements.forEach((el) => {
        if (observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    }
  }, [loading, championships, selectedSport]);

  const sports = ['All', ...new Set(championships.map(c => c.sport).filter(Boolean))].sort();
  
  const filteredChampionships = selectedSport === 'All' 
    ? championships 
    : championships.filter(c => c.sport === selectedSport);

  let globalIndex = 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Championships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 px-4 pt-32">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      {/* Header Section */}
      <section className="py-12 relative overflow-hidden border-b-4 border-yellow-400">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Championship Hall
            </h1>
            <p className="text-xl text-gray-300">
              Celebrating Norwell's state titles and championship victories
            </p>
          </div>
        </div>
      </section>

      {/* Sport Filter */}
      <section className="py-8 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Filter by Sport</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    selectedSport === sport
                      ? 'bg-yellow-400 text-slate-900'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 pb-24 relative overflow-hidden">
        {/* Animated fog background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {filteredChampionships.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h2 className="text-3xl font-bold text-white mb-4">No Championships Found</h2>
              <p className="text-gray-400 text-lg">
                {selectedSport === 'All' ? 'Championships will appear here once they are added.' : `No championships found for ${selectedSport}.`}
              </p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto relative">
              {/* Vertical Timeline */}
              <div 
                className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-yellow-500/60 via-yellow-600/40 to-yellow-500/60"
                style={{ boxShadow: '0 0 15px rgba(234, 179, 8, 0.2)' }}
              ></div>

              {/* Championship Items */}
              <div className="space-y-24 relative">
                {filteredChampionships.map((championship) => {
                  const isEven = globalIndex % 2 === 0;
                  const cardIndex = globalIndex.toString();
                  const isVisible = visibleItems.has(cardIndex);
                  globalIndex++;

                  return (
                    <div key={championship.id} data-index={cardIndex} className="relative">
                      {/* Faded year background */}
                      <div 
                        className="absolute pointer-events-none select-none hidden md:block"
                        style={{ 
                          fontSize: '14rem',
                          lineHeight: '1',
                          fontWeight: '900',
                          color: 'rgba(100, 116, 139, 0.04)',
                          top: '50%',
                          left: isEven ? '65%' : '35%',
                          transform: `translate(-50%, -50%)`,
                          whiteSpace: 'nowrap',
                          zIndex: 0
                        }}
                      >
                        {championship.year}
                      </div>

                      {/* Desktop Layout - Staggered */}
                      <div className="hidden md:block">
                        <div className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'} transition-all duration-700 ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}>
                          {/* Card Container */}
                          <div className="w-5/12 relative" style={{ zIndex: 10 }}>
                            {/* Connecting line */}
                            <div className={`absolute top-1/2 ${isEven ? 'left-full' : 'right-full'} w-16 h-px ${isEven ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-yellow-500/40 to-transparent`}></div>
                            
                            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:border-yellow-400 hover:shadow-yellow-400/20">
                              {/* Subtle top accent */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>

                              {/* Photo */}
                              {championship.photoURL && (
                                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
                                  <img
                                    src={championship.photoURL}
                                    alt={championship.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              )}

                              <div className="p-6">
                                {/* Year Badge */}
                                <div className="inline-block bg-yellow-400 text-slate-900 px-4 py-1 rounded-full font-black text-sm mb-3">
                                  {championship.year}
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-2">
                                  {championship.title}
                                </h3>

                                {/* Sport & Coach */}
                                <div className="flex flex-wrap gap-3 mb-4">
                                  <div className="inline-flex items-center gap-2 bg-slate-700/50 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                                    <Trophy className="w-4 h-4" />
                                    {championship.sport}
                                  </div>
                                  {championship.coach && (
                                    <div className="inline-flex items-center gap-2 bg-slate-700/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                                      <UserIcon className="w-4 h-4" />
                                      Coach: {championship.coach}
                                    </div>
                                  )}
                                </div>

                                {/* Description */}
                                {championship.description && (
                                  <p className="text-gray-400 leading-relaxed">
                                    {championship.description}
                                  </p>
                                )}
                              </div>
                            </div>
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
                        <div 
                          className={`bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-all relative ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                          style={{ transitionDuration: '700ms' }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>

                          {championship.photoURL && (
                            <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
                              <img
                                src={championship.photoURL}
                                alt={championship.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div className="p-6">
                            <div className="inline-block bg-yellow-400 text-slate-900 px-4 py-1 rounded-full font-black text-sm mb-3">
                              {championship.year}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                              {championship.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="inline-flex items-center gap-1 bg-slate-700/50 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                                <Trophy className="w-3 h-3" />
                                {championship.sport}
                              </span>
                              {championship.coach && (
                                <span className="inline-flex items-center gap-1 bg-slate-700/50 text-gray-300 px-3 py-1 rounded-full text-xs">
                                  Coach: {championship.coach}
                                </span>
                              )}
                            </div>

                            {championship.description && (
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {championship.description}
                              </p>
                            )}
                          </div>
                        </div>
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
    </div>
  );
};

export default Championships;