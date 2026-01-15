import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
    Trophy, Award, User, Search, SortDesc, SortAsc, Filter, GraduationCap, 
    ChevronRight, ChevronLeft, Calendar
} from 'lucide-react';

// --- Utility Functions ---

const getObjectPosition = (position) => {
  switch(position) {
    case 'top': return 'object-top';
    case 'bottom': return 'object-bottom';
    default: return 'object-center';
  }
};

/**
 * Normalizes and cleans sport display
 * - Replaces standalone "Field" with "Track & Field"
 * - Consolidates multiple Track/Field variations into one "Track & Field"
 */
const normalizeSportDisplay = (sport) => {
  if (!sport) return sport;
  
  // Split into individual sports
  const sports = sport.split(/[,&]|(?:\s+-\s+)/).map(s => s.trim());
  
  // Check if we have any track/field variants
  const hasTrackOrField = sports.some(s => {
    const lower = s.toLowerCase();
    return lower === 'track' || lower === 'field' || s === 'Track & Field';
  });
  
  // Filter out track/field variants and other sports
  const otherSports = sports.filter(s => {
    const lower = s.toLowerCase();
    return lower !== 'track' && lower !== 'field' && s !== 'Track & Field';
  });
  
  // Build final array
  const finalSports = [];
  if (hasTrackOrField) {
    finalSports.push('Track & Field');
  }
  finalSports.push(...otherSports);
  
  return finalSports.join(' & ');
};

// --- Sub Component: Plaque Placeholder ---

const PlaquePlaceholder = ({ name, sport, classYear }) => {
    const displaySport = normalizeSportDisplay(sport);
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 p-6 text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mb-4 opacity-70"/>
            <p className="text-xl font-black text-yellow-400 tracking-wider mb-2 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                Hall of Fame
            </p>
            <h3 className="text-3xl font-extrabold text-white mb-4 uppercase leading-snug">
                {name}
            </h3>
            
            <div className="border-t border-b border-yellow-400/50 py-3 w-4/5">
                <p className="text-sm text-gray-400 uppercase font-semibold">Induction Class</p>
                <p className="text-2xl font-black text-yellow-400">{classYear}</p>
            </div>

            {displaySport && (
                <div className="mt-4">
                    <p className="text-sm text-gray-400 uppercase font-semibold">Sport(s)</p>
                    <p className="text-lg font-bold text-white leading-tight">{displaySport}</p>
                </div>
            )}
        </div>
    );
};

// --- Sub Component: AthleteCard ---

const AthleteCard = ({ athlete }) => {
  const { 
    id, 
    name = 'Name Unavailable', 
    sport = 'Unspecified', 
    classYear, 
    graduationYear, 
    photoURL, 
    photoPosition = 'center',
    secondPhotoURL, 
    secondPhotoPosition = 'center'
  } = athlete;
  
  const [hoveredCard, setHoveredCard] = useState(null);
  const displayYear = classYear ? classYear.toString().slice(-2) : '??';
  const hasSecondPhoto = !!secondPhotoURL;

  const usePlaque = !photoURL;
  const displaySport = normalizeSportDisplay(sport);

  return (
    <Link 
      to={`/inductees/${id}`} 
      className="group perspective-1000"
      onMouseEnter={() => setHoveredCard(id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
        <div 
          className="relative transition-all duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: hoveredCard === id && hasSecondPhoto ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '580px', 
            height: '100%',
          }}
        >
          <div className="relative backface-hidden h-full" style={{ backfaceVisibility: 'hidden' }}>
            <div 
              className="relative bg-gradient-to-br from-amber-200 to-amber-100 rounded-lg p-2 shadow-2xl border-4 border-amber-700 transition-all duration-300 group-hover:shadow-amber-900/80 h-full"
              style={{ transform: hoveredCard === id && !hasSecondPhoto ? 'translateY(-12px)' : 'translateY(0)' }}
            >
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-amber-900 rounded-tl"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-amber-900 rounded-tr"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-amber-900 rounded-bl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-amber-900 rounded-br"></div>

              <div className="bg-white rounded-md overflow-hidden shadow-lg h-full flex flex-col">
                <div className="relative h-80 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex-shrink-0">
                  {usePlaque ? (
                    <PlaquePlaceholder name={name} sport={sport} classYear={classYear} />
                  ) : (
                    <img 
                      src={photoURL} 
                      alt={name} 
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${getObjectPosition(photoPosition)}`}
                    />
                  )}
                  
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                    &apos;{displayYear}
                  </div>
                  
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-400"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-400"></div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 border-t-4 border-yellow-400 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase text-center leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {name}
                  </h3>
                  <div className="bg-yellow-400/10 border-2 border-yellow-400/30 rounded-md p-3 flex-1 flex flex-col justify-center">
                    {displaySport && (
                      <div className="text-center mb-2">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-400 text-xs font-bold uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                            Sport{displaySport.includes('&') ? 's' : ''}
                          </span>
                        </div>
                        <div className="text-white font-bold text-xs leading-tight px-2">
                          {displaySport.split(' & ').map((s, idx, arr) => (
                            <span key={idx}>
                              {s.trim()}
                              {idx < arr.length - 1 && <span className="text-yellow-400 mx-1">•</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {graduationYear && (
                      <div className={`flex items-center justify-between ${displaySport ? 'pt-2 border-t border-yellow-400/30' : ''}`}>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-400 text-xs font-bold uppercase" style={{ fontFamily: 'Georgia, serif' }}>Graduated</span>
                        </div>
                        <span className="text-white font-bold text-sm">{graduationYear}</span>
                      </div>
                    )}
                    {!displaySport && !graduationYear && (
                      <p className="text-gray-500 italic text-center text-sm py-2">Details coming soon...</p>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-4 py-2 rounded-md font-black text-sm uppercase group-hover:from-amber-300 group-hover:to-amber-400 transition-all shadow-lg transform group-hover:scale-105" style={{ fontFamily: 'Georgia, serif' }}>
                      View Profile <ChevronRight className="w-4 h-4 inline-block ml-1 align-text-bottom"/>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {hasSecondPhoto && (
            <div className="absolute inset-0 backface-hidden h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="relative bg-gradient-to-br from-amber-200 to-amber-100 rounded-lg p-2 shadow-2xl border-4 border-amber-700 h-full">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-amber-900 rounded-tl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-amber-900 rounded-tr"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-amber-900 rounded-bl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-amber-900 rounded-br"></div>
                
                <div className="bg-white rounded-md overflow-hidden shadow-lg h-full flex flex-col">
                  <div className="relative flex-1 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <img 
                      src={secondPhotoURL} 
                      alt={`${name} - alternate`} 
                      className={`w-full h-full object-cover ${getObjectPosition(secondPhotoPosition)}`}
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                      &apos;{displayYear}
                    </div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-400"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-400"></div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-center border-t-4 border-yellow-400">
                    <p className="text-yellow-400 font-black text-lg uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>{name}</p>
                    <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-4 py-2 rounded-md font-black text-sm uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                      Click to View Profile <ChevronRight className="w-4 h-4 inline-block ml-1 align-text-bottom"/>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-slate-900 rounded-lg -z-10 blur-xl transition-all duration-300"
            style={{
              transform: hoveredCard === id ? 'translateY(20px)' : 'translateY(4px)',
              opacity: hoveredCard === id ? 0.6 : 0.3
            }}
          ></div>
        </div>
    </Link>
  );
};

// --- Main Component: AthleteTimeline ---

const AthleteTimeline = () => {
  const [allAthletes, setAllAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); 
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [filterSport, setFilterSport] = useState('All');
  const timelineRef = useRef(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      try {
        const inducteesRef = collection(db, 'inductees');
        const querySnapshot = await getDocs(query(inducteesRef));
        
        const fetchedAthletes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setAllAthletes(fetchedAthletes);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching athletes:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  const { uniqueSports, uniqueYears } = useMemo(() => {
    const sports = new Set(['All']);
    const years = new Set(['All']);
    let hasCoach = false;
    let hasTrackOrField = false;
    
    allAthletes.forEach(athlete => {
      if (athlete.classYear) years.add(athlete.classYear); 
      
      if (athlete.sport) {
        const sportString = athlete.sport.toLowerCase();
        
        if (sportString.includes('coach')) {
          hasCoach = true;
        }
        
        athlete.sport.split(/[,&]|(?:\s+-\s+)/).forEach(sport => {
          const trimmedSport = sport.trim();
          const lowerSport = trimmedSport.toLowerCase();
          
          if (lowerSport === 'track' || lowerSport === 'field' || trimmedSport === 'Track & Field') {
            hasTrackOrField = true;
          } else if (!lowerSport.includes('coach')) {
            sports.add(trimmedSport);
          }
        });
      }
    });
    
    if (hasTrackOrField) {
      sports.add('Track & Field');
    }
    
    if (hasCoach) {
      sports.add('Coach');
    }
    
    const sortedSports = Array.from(sports).sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return a.localeCompare(b);
    });
    
    const sortedYears = Array.from(years)
        .filter(y => y !== 'All')
        .map(String)
        .sort((a, b) => b - a); 
    
    return { 
        uniqueSports: sortedSports, 
        uniqueYears: ['All', ...sortedYears]
    };
  }, [allAthletes]);
  
  const filteredAndSortedAthletes = useMemo(() => {
    let result = [...allAthletes];

    if (selectedYear !== 'All') {
        result = result.filter(athlete => String(athlete.classYear) === selectedYear);
    }

    if (filterSport !== 'All') {
      result = result.filter(athlete => {
        if (!athlete.sport) return false;
        
        const sportLower = athlete.sport.toLowerCase();
        
        if (filterSport === 'Coach') {
          return sportLower.includes('coach');
        }
        
        if (filterSport === 'Track & Field') {
          return athlete.sport.split(/[,&]|(?:\s+-\s+)/).some(s => {
            const trimmed = s.trim().toLowerCase();
            return trimmed === 'track' || trimmed === 'field' || s.trim() === 'Track & Field';
          });
        }
        
        return athlete.sport.split(/[,&]|(?:\s+-\s+)/).some(s => s.trim() === filterSport);
      });
    }

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(athlete => {
        const normalizedSport = normalizeSportDisplay(athlete.sport);
        
        return athlete.name?.toLowerCase().includes(lowerCaseSearch) || 
          normalizedSport?.toLowerCase().includes(lowerCaseSearch) ||
          athlete.classYear?.toString().includes(lowerCaseSearch) ||
          athlete.graduationYear?.toString().includes(lowerCaseSearch);
      });
    }

    result.sort((a, b) => {
      let valA, valB;

      if (sortBy === 'name') {
        valA = a.name || '';
        valB = b.name || '';
      } else if (sortBy === 'graduationYear') {
        valA = a.graduationYear || (sortOrder === 'desc' ? -1 : 9999); 
        valB = b.graduationYear || (sortOrder === 'desc' ? -1 : 9999);
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allAthletes, selectedYear, searchTerm, sortBy, sortOrder, filterSport]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'graduationYear' ? 'desc' : 'asc'); 
    }
  };

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
        const scrollAmount = direction === 'left' ? -250 : 250;
        timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Athletes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 pt-32">
        <div className="bg-red-900/20 border-2 border-red-500 rounded-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-300 mb-2">Error Loading Data</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      <section className="py-10 relative overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            HOF Class <span className="text-yellow-500">Timeline</span>
          </h1>
          <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
            Select an induction year below or use the controls to filter the inductees.
          </p>
        </div>
      </section>
      
      <section className="bg-slate-900/70 py-6 border-y border-yellow-500/50 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="relative flex items-center">
            <button 
              onClick={() => scrollTimeline('left')}
              className="flex-shrink-0 p-2 bg-slate-800 text-yellow-500 rounded-full hover:bg-slate-700 transition shadow-lg z-20 mr-2 disabled:opacity-50"
              aria-label="Scroll timeline left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div 
              ref={timelineRef}
              className="flex overflow-x-scroll scrollbar-hide space-x-0 w-full relative" 
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="absolute inset-y-0 h-1 bg-yellow-600 top-1/2 transform -translate-y-1/2 left-0 right-0 mx-2 z-0"></div>

              {uniqueYears.map((year, index) => (
                <div key={year} className="flex-shrink-0 relative z-10">
                  <button
                    onClick={() => setSelectedYear(year)}
                    className={`
                      px-6 py-2 text-sm font-black rounded-full transition-all duration-200 border-2 whitespace-nowrap 
                      ${
                        selectedYear === year
                        ? 'bg-yellow-600 text-slate-900 border-yellow-600 shadow-xl scale-105 ring-4 ring-yellow-400/50'
                        : 'bg-slate-700 text-white border-slate-700 hover:bg-slate-600'
                      }
                    `}
                  >
                    {year === 'All' ? 'All Classes' : `${year}`}
                  </button>
                  {index < uniqueYears.length - 1 && (
                    <div className="absolute w-1 h-1 bg-yellow-600 rounded-full top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 z-0"></div>
                  )}
                  <div className="inline-block w-8"></div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => scrollTimeline('right')}
              className="flex-shrink-0 p-2 bg-slate-800 text-yellow-500 rounded-full hover:bg-slate-700 transition shadow-lg z-20 ml-2 disabled:opacity-50"
              aria-label="Scroll timeline right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/50 py-6 border-b border-yellow-500/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500" />
              <input
                type="text"
                placeholder="Search by Name, Sport, or Year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 text-white border border-yellow-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
              />
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => handleSortChange('name')} 
                className={`flex items-center justify-center w-full px-4 py-2 rounded-lg font-bold text-sm transition ${
                  sortBy === 'name' 
                    ? 'bg-yellow-600 text-slate-900' 
                    : 'bg-slate-700 text-yellow-500 hover:bg-slate-600'
                }`}
              >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
              </button>
              
              <button 
                onClick={() => handleSortChange('graduationYear')} 
                className={`flex items-center justify-center w-full px-4 py-2 rounded-lg font-bold text-sm transition ${
                  sortBy === 'graduationYear' 
                    ? 'bg-yellow-600 text-slate-900' 
                    : 'bg-slate-700 text-yellow-500 hover:bg-slate-600'
                }`}
              >
                Grad Year {sortBy === 'graduationYear' && (sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />)}
              </button>
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500 pointer-events-none" />
              <select
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
                className="appearance-none w-full pl-10 pr-4 py-2 bg-slate-800 text-white border border-yellow-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition cursor-pointer"
              >
                {uniqueSports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-500 rotate-90 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 pb-24 relative">
        <div className="container mx-auto px-4">
          {filteredAndSortedAthletes.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h2 className="text-3xl font-bold text-white mb-4">No Matches Found</h2>
              <p className="text-gray-400 text-lg">Try adjusting your search term, sort options, or filters.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-center mb-8">
                {selectedYear !== 'All' && ` from the ${selectedYear} HOF class`}
                {filterSport !== 'All' && ` filtered by ${filterSport}`}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedAthletes.map((athlete) => (
                  <AthleteCard key={athlete.id} athlete={athlete} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AthleteTimeline;
