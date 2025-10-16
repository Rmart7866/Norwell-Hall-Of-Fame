// src/pages/public/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Award, User, Download, GraduationCap, MousePointerClick } from 'lucide-react';

const Home = () => {
  const [latestClass, setLatestClass] = useState(null);
  const [latestInductees, setLatestInductees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [maxCardHeight, setMaxCardHeight] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchLatestClass = async () => {
      try {
        const classesRef = collection(db, 'classes');
        const classQuery = query(classesRef, orderBy('year', 'desc'), limit(1));
        const classSnapshot = await getDocs(classQuery);
        
        if (!classSnapshot.empty) {
          const classData = { id: classSnapshot.docs[0].id, ...classSnapshot.docs[0].data() };
          setLatestClass(classData);

          const inducteesRef = collection(db, 'inductees');
          const inducteesQuery = query(inducteesRef, where('classYear', '==', classData.year));
          const inducteesSnapshot = await getDocs(inducteesQuery);
          
          const inducteesData = inducteesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setLatestInductees(inducteesData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching latest class:', error);
        setLoading(false);
      }
    };

    fetchLatestClass();
  }, []);

  useEffect(() => {
    if (latestInductees.length > 0 && cardRefs.current.length > 0) {
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
  }, [latestInductees, loading]);

  const nominationForms = [
    { name: 'Athlete Nomination Cover Letter', file: '/forms/athlete-cover-letter.pdf' },
    { name: 'Athlete Nomination Forms', file: '/forms/athlete-nomination.pdf' },
    { name: 'Coaches Nomination Cover Letter', file: '/forms/coach-cover-letter.pdf' },
    { name: 'Coaches Nomination Forms', file: '/forms/coach-nomination.pdf' },
    { name: 'Special Contributor Cover Letter', file: '/forms/contributor-cover-letter.pdf' },
    { name: 'Special Contributor Nomination', file: '/forms/contributor-nomination.pdf' },
    { name: 'Team Nomination Cover Letter', file: '/forms/team-cover-letter.pdf' },
    { name: 'Team Nomination Forms', file: '/forms/team-nomination.pdf' }
  ];

  return (
    <div>
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(/images/banner.jpg)` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-blue-900/80 to-black/90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
            <span className="block animate-slide-in-left">NORWELL HIGH SCHOOL</span>
            <span className="block text-yellow-400 animate-slide-in-right animation-delay-200">ATHLETIC</span>
            <span className="block animate-slide-in-left animation-delay-400">HALL OF FAME</span>
          </h1>
          <div className="h-1 w-full max-w-2xl bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-10 opacity-0 animate-fade-in animation-delay-600"></div>
          <p className="text-3xl md:text-4xl font-bold text-gray-200 tracking-wide drop-shadow-lg animate-fade-in-up animation-delay-800">
            Celebrating Excellence in Athletics
          </p>
        </div>
      </div>

      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Latest Inductees</h2>
            {latestClass && <p className="text-3xl font-bold text-yellow-400 mb-6">Class of {latestClass.year}</p>}
            <div className="h-2 w-48 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
              <p className="text-white text-xl">Loading inductees...</p>
            </div>
          ) : latestInductees.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
                {latestInductees.slice(0, 8).map((inductee, index) => (
                  <Link
                    key={inductee.id}
                    to={`/inductees/${inductee.id}`}
                    className="group perspective-1000"
                    onMouseEnter={() => setHoveredCard(inductee.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{ animation: `cardDrop 0.6s ease-out ${index * 0.1}s forwards`, opacity: 0, transform: 'translateY(-50px) rotateX(20deg)' }}
                  >
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
                      <div className="relative backface-hidden h-full" style={{ backfaceVisibility: 'hidden' }}>
                        <div 
                          className="relative bg-gradient-to-br from-amber-200 to-amber-100 rounded-lg p-2 shadow-2xl border-4 border-amber-700 transition-all duration-300 group-hover:shadow-amber-900/80 h-full"
                          style={{ transform: hoveredCard === inductee.id && !inductee.secondPhotoURL ? 'translateY(-12px)' : 'translateY(0)' }}
                        >
                          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-amber-900 rounded-tl"></div>
                          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-amber-900 rounded-tr"></div>
                          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-amber-900 rounded-bl"></div>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-amber-900 rounded-br"></div>

                          <div className="bg-white rounded-md overflow-hidden shadow-lg h-full flex flex-col">
                            <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex-shrink-0">
                              {inductee.photoURL ? (
                                <img src={inductee.photoURL} alt={inductee.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
                                  <User className="w-32 h-32 text-yellow-400 opacity-50 mb-4" />
                                  <p className="text-yellow-400 font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>NORWELL</p>
                                  <p className="text-white text-sm" style={{ fontFamily: 'Georgia, serif' }}>HALL OF FAME</p>
                                </div>
                              )}
                              <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                                '{latestClass.year.toString().slice(-2)}
                              </div>
                              {inductee.secondPhotoURL && (
                                <div className="absolute bottom-3 left-3 bg-slate-900/80 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                                  <MousePointerClick className="w-3 h-3" />
                                  Hover to flip
                                </div>
                              )}
                              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-400"></div>
                              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-400"></div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 border-t-4 border-yellow-400 flex-1 flex flex-col">
                              <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase text-center leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                                {inductee.name || 'Name Unavailable'}
                              </h3>
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
                                  <p className="text-gray-500 italic text-center text-sm py-2">Stats coming soon...</p>
                                )}
                              </div>
                              <div className="mt-3 text-center">
                                <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-4 py-2 rounded-md font-black text-sm uppercase group-hover:from-amber-300 group-hover:to-amber-400 transition-all shadow-lg transform group-hover:scale-105" style={{ fontFamily: 'Georgia, serif' }}>
                                  View Profile →
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {inductee.secondPhotoURL && (
                        <div className="absolute inset-0 backface-hidden h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                          <div className="relative bg-gradient-to-br from-amber-200 to-amber-100 rounded-lg p-2 shadow-2xl border-4 border-amber-700 h-full">
                            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-amber-900 rounded-tl"></div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-amber-900 rounded-tr"></div>
                            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-amber-900 rounded-bl"></div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-amber-900 rounded-br"></div>
                            <div className="bg-white rounded-md overflow-hidden shadow-lg h-full flex flex-col">
                              <div className="relative flex-1 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                                <img src={inductee.secondPhotoURL} alt={`${inductee.name} - alternate`} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                                  '{latestClass.year.toString().slice(-2)}
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

                      <div className="absolute inset-0 bg-slate-900 rounded-lg -z-10 blur-xl transition-all duration-300"
                        style={{
                          transform: hoveredCard === inductee.id ? 'translateY(20px)' : 'translateY(4px)',
                          opacity: hoveredCard === inductee.id ? 0.6 : 0.3
                        }}
                      ></div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center">
                <Link to={`/inductees/class/${latestClass.year}`} className="inline-block bg-yellow-400 text-slate-900 px-10 py-4 rounded-lg font-bold text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  View Full Class of {latestClass.year}
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No inductees available yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative py-20 bg-slate-900 border-t-2 border-yellow-400">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Nominate Today</h2>
              <div className="h-2 w-48 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6"></div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Nominations for the Hall of Fame are accepted annually. Help us honor those who made a lasting impact on Norwell athletics.
              </p>
            </div>
            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-10 shadow-2xl relative mb-12">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Nomination Forms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nominationForms.map((form, index) => (
                  <a key={index} href={form.file} download className="flex items-center justify-between bg-slate-900/50 border border-slate-600 hover:border-yellow-400 rounded-lg p-4 transition-all duration-300 hover:bg-slate-900 group">
                    <span className="text-gray-300 font-semibold group-hover:text-white">{form.name}</span>
                    <Download className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Link to="/about" className="inline-block bg-yellow-400 text-slate-900 px-10 py-4 rounded-lg font-bold text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Learn More About Nominations
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default Home;