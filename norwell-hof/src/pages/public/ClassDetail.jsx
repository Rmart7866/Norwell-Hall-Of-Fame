import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInducteesByClass } from '../../firebase/firestore';
import { ArrowLeft, User, Award, GraduationCap, MousePointerClick } from 'lucide-react';

const ClassDetail = () => {
  const { year } = useParams();
  const [inductees, setInductees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [maxCardHeight, setMaxCardHeight] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchInductees = async () => {
      setLoading(true);
      const { data, error: fetchError } = await getInducteesByClass(parseInt(year));
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setInductees(data);
      }
      
      setLoading(false);
    };

    fetchInductees();
  }, [year]);

  // Calculate max card height after cards render
  useEffect(() => {
    if (inductees.length > 0 && cardRefs.current.length > 0) {
      // Wait for images to load and layout to settle
      const timer = setTimeout(() => {
        const heights = cardRefs.current
          .filter(ref => ref !== null)
          .map(ref => ref.offsetHeight);
        
        if (heights.length > 0) {
          const maxHeight = Math.max(...heights);
          setMaxCardHeight(maxHeight);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [inductees, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Class of {year}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 px-4 pt-32">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/inductees"
            className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Back to All Classes
          </Link>
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
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-black mb-4 text-yellow-400 tracking-tight year-header">
              CLASS OF {year}
            </h1>
            <p className="text-2xl text-gray-300 font-semibold">
              {inductees.length} {inductees.length === 1 ? 'Inductee' : 'Inductees'}
            </p>
          </div>
        </div>
      </section>

      {/* Baseball Cards Grid */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4">
          {inductees.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-white mb-4">No Inductees Found</h2>
              <p className="text-gray-400 text-lg mb-8">
                There are currently no inductees listed for the Class of {year}.
              </p>
              <Link
                to="/inductees"
                className="inline-block bg-yellow-400 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                View Other Classes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {inductees.map((inductee, index) => (
                <Link
                  key={inductee.id}
                  to={`/inductees/${inductee.id}`}
                  className="group perspective-1000"
                  onMouseEnter={() => setHoveredCard(inductee.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    animation: `cardDrop 0.6s ease-out ${index * 0.1}s forwards`,
                    opacity: 0,
                    transform: 'translateY(-50px) rotateX(20deg)'
                  }}
                >
                  {/* Baseball Card - Dynamic Height Container */}
                  <div 
                    ref={el => cardRefs.current[index] = el}
                    className="relative transition-all duration-300 ease-out"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: hoveredCard === inductee.id && inductee.secondPhotoURL ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      height: maxCardHeight > 0 ? `${maxCardHeight}px` : 'auto',
                      minHeight: '580px'
                    }}
                  >
                    
                    {/* Front of Card */}
                    <div className="relative backface-hidden h-full" style={{ backfaceVisibility: 'hidden' }}>
                      {/* Card Container with vintage border */}
                      <div className="relative bg-gradient-to-br from-amber-200 to-amber-100 rounded-lg p-2 shadow-2xl border-4 border-amber-700 transition-all duration-300 group-hover:shadow-amber-900/80 h-full" 
                           style={{
                             transform: hoveredCard === inductee.id && !inductee.secondPhotoURL ? 'translateY(-12px)' : 'translateY(0)',
                           }}>
                        
                        {/* Simple Elegant Corner Decorations */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-amber-900 rounded-tl"></div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-amber-900 rounded-tr"></div>
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-amber-900 rounded-bl"></div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-amber-900 rounded-br"></div>

                        {/* Inner Card - Flex container for consistent sizing */}
                        <div className="bg-white rounded-md overflow-hidden shadow-lg h-full flex flex-col">
                          {/* Photo Section - Fixed Height */}
                          <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex-shrink-0">
                            {inductee.photoURL ? (
                              <img
                                src={inductee.photoURL}
                                alt={inductee.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
                                <User className="w-32 h-32 text-yellow-400 opacity-50 mb-4" />
                                <p className="text-yellow-400 font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>NORWELL</p>
                                <p className="text-white text-sm" style={{ fontFamily: 'Georgia, serif' }}>HALL OF FAME</p>
                              </div>
                            )}
                            
                            {/* Year Badge */}
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                              '{year.toString().slice(-2)}
                            </div>
                            
                            {/* Hover to flip indicator */}
                            {inductee.secondPhotoURL && (
                              <div className="absolute bottom-3 left-3 bg-slate-900/80 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                                <MousePointerClick className="w-3 h-3" />
                                Hover to flip
                              </div>
                            )}
                            
                            {/* Corner decorations */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-400"></div>
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-400"></div>
                          </div>

                          {/* Info Section - Flex to fill remaining space */}
                          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 border-t-4 border-yellow-400 flex-1 flex flex-col">
                            {/* Name */}
                            <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase text-center leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                              {inductee.name || 'Name Unavailable'}
                            </h3>
                            
                            {/* Stats Box - Flex to fill space */}
                            <div className="bg-yellow-400/10 border-2 border-yellow-400/30 rounded-md p-3 flex-1 flex flex-col justify-center">
                              {inductee.sport && (
                                <div className="text-center mb-2">
                                  <div className="flex items-center justify-center gap-2 mb-1">
                                    <Award className="w-4 h-4 text-yellow-400" />
                                    <span className="text-gray-400 text-xs font-bold uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                                      Sport{(inductee.sport.includes(',') || inductee.sport.includes('&')) ? 's' : ''}
                                    </span>
                                  </div>
                                  <div className="text-white font-bold text-sm leading-relaxed">
                                    {inductee.sport.split(/[,&]/).map((sport, idx, arr) => (
                                      <span key={idx}>
                                        {sport.trim()}
                                        {idx < arr.length - 1 && <span className="text-yellow-400 mx-1">•</span>}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {inductee.graduationYear && (
                                <div className={`flex items-center justify-between ${inductee.sport ? 'pt-2 border-t border-yellow-400/30' : ''}`}>
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-yellow-400" />
                                    <span className="text-gray-400 text-xs font-bold uppercase" style={{ fontFamily: 'Georgia, serif' }}>Graduated</span>
                                  </div>
                                  <span className="text-white font-bold text-sm">{inductee.graduationYear}</span>
                                </div>
                              )}
                              {!inductee.sport && !inductee.graduationYear && (
                                <p className="text-gray-500 italic text-center text-sm py-2">
                                  Stats coming soon...
                                </p>
                              )}
                            </div>

                            {/* View Profile Button */}
                            <div className="mt-3 text-center">
                              <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-4 py-2 rounded-md font-black text-sm uppercase group-hover:from-amber-300 group-hover:to-amber-400 transition-all shadow-lg transform group-hover:scale-105" style={{ fontFamily: 'Georgia, serif' }}>
                                View Profile →
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card (if second photo exists) */}
                    {inductee.secondPhotoURL && (
                      <div className="absolute inset-0 backface-hidden h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <div className="relative bg-gradient-to-br from-amber-200 to-amber-100 rounded-lg p-2 shadow-2xl border-4 border-amber-700 h-full">
                          {/* Corner Decorations */}
                          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-amber-900 rounded-tl"></div>
                          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-amber-900 rounded-tr"></div>
                          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-amber-900 rounded-bl"></div>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-amber-900 rounded-br"></div>

                          <div className="bg-white rounded-md overflow-hidden shadow-lg h-full flex flex-col">
                            <div className="relative flex-1 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                              <img
                                src={inductee.secondPhotoURL}
                                alt={`${inductee.name} - alternate`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                                '{year.toString().slice(-2)}
                              </div>
                              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-400"></div>
                              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-400"></div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-center border-t-4 border-yellow-400">
                              <p className="text-yellow-400 font-black text-lg uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>{inductee.name}</p>
                              <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-4 py-2 rounded-md font-black text-sm uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                                Click to View Profile →
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Card Shadow Effect - Dramatic Lifting Shadow */}
                    <div 
                      className="absolute inset-0 bg-slate-900 rounded-lg -z-10 blur-xl transition-all duration-300"
                      style={{
                        transform: hoveredCard === inductee.id ? 'translateY(20px)' : 'translateY(4px)',
                        opacity: hoveredCard === inductee.id ? 0.6 : 0.3
                      }}
                    ></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Back Button Section */}
      <section className="py-12 bg-slate-900 border-t-2 border-yellow-400">
        <div className="container mx-auto px-4 text-center">
          <Link
            to="/inductees"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-black text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl uppercase"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Timeline
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes cardDrop {
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .backface-hidden {
          backfaceVisibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .year-header {
          font-variant-numeric: proportional-nums;
          font-feature-settings: 'lnum' 1;
        }
      `}</style>
    </div>
  );
};

export default ClassDetail;