import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
    Trophy, Award, User, Search, SortDesc, SortAsc, Filter, GraduationCap, 
    ChevronRight, ChevronLeft, Calendar
} from 'lucide-react';

// --- Utility Functions ---

/**
 * Determines the Tailwind CSS object-position class.
 */
const getObjectPosition = (position) => {
  switch(position) {
    case 'top': return 'object-top';
    case 'bottom': return 'object-bottom';
    default: return 'object-center';
  }
};

/**
 * Normalizes sport names to replace standalone "Field" with "Track & Field"
 */
const normalizeSportName = (sport) => {
  if (!sport) return sport;
  
  // Split the sport string by delimiters
  const sports = sport.split(/[,&]|(?:\s+-\s+)/).map(s => s.trim());
  
  // Replace standalone "Field" with "Track & Field"
  const normalizedSports = sports.map(s => {
    if (s.toLowerCase() === 'field') {
      return 'Track & Field';
    }
    return s;
  });
  
  // Join back together with the original delimiter style (using " & " for consistency)
  return normalizedSports.join(' & ');
};

// --- Sub Component: Plaque Placeholder (NEW COMPONENT) ---

const PlaquePlaceholder = ({ name, sport, classYear }) => {
    const displaySport = normalizeSportName(sport);
    
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

// --- Sub Component: AthleteCard (NOW USES PLAQUE) ---

/**
 * Renders a single athlete card using the premium design.
 */
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

  // Check if we need to use the Plaque
  const usePlaque = !photoURL;
  
  // Normalize sport display: replace standalone "Field" with "Track & Field"
  const displaySport = normalizeSportName(sport);

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
          {/* FRONT FACE */}
          <div className="relative backface-hidden h-full" style={{ backfaceVisibility: 'hidden' }}>
            <div 
              className="relative bg-gradient-to-br from-amber-200 to-amber-100 rounded-lg p-2 shadow-2xl border-4 border-amber-700 transition-all duration-300 group-hover:shadow-amber-900/80 h-full"
              style={{ transform: hoveredCard === id && !hasSecondPhoto ? 'translateY(-12px)' : 'translateY(0)' }}
            >
              {/* Card Decoration */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-amber-900 rounded-tl"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-amber-900 rounded-tr"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-amber-900 rounded-bl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-amber-900 rounded-br"></div>

              <div className="bg-white rounded-md overflow-hidden shadow-lg h-full flex flex-col">
                {/* Photo Area / Plaque */}
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
                  
                  {/* HOF Year Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                    '{displayYear}
                  </div>
                  
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-400"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-400"></div>
                </div>

                {/* Content Area */}
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
                            Sport{(displaySport.includes(',') || displaySport.includes('&') || displaySport.includes('-')) ? 's' : ''}
                          </span>
                        </div>
                        <div className="text-white font-bold text-xs leading-tight px-2">
                          {displaySport.split(/[,&]|(?:\s+-\s+)/).map((s, idx, arr) => (
                            <span key={idx}>
                              {s.trim()}
                              {idx < arr.length - 1 && <span className="text-yellow-400 mx-0.5">•</span>}
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

          {/* BACK FACE (Flip effect - if second photo exists) */}
          {hasSecondPhoto && (
            <div className="absolute inset-0 backface-hidden h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="relative bg-gradient-to-br from-amber-200 to-amber-100 rounded-lg p-2 shadow-2xl border-4 border-amber-700 h-full">
                {/* Decoration corners */}
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
                    {/* HOF Year Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-lg border-2 border-white">
                      '{displayYear}
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

          {/* Shadow Effect */}
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
  // State for data
  const [allAthletes, setAllAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for controls
  const [selectedYear, setSelectedYear] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); 
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [filterSport, setFilterSport] = useState('All');

  // Ref for horizontal scrolling of the timeline
  const timelineRef = useRef(null);

  // 1. Data Fetching
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

  // Calculate unique sports and unique Hall of Fame Years
  const { uniqueSports, uniqueYears } = useMemo(() => {
    const sports = new Set(['All']);
    const years = new Set(['All']);
    let hasCoach = false;
    
    allAthletes.forEach(athlete => {
      // Use classYear (HOF year) for the timeline filter
      if (athlete.classYear) years.add(athlete.classYear); 
      
      // Split multi-sport strings into individual sports
      if (athlete.sport) {
        const sportString = athlete.sport.toLowerCase();
        
        // Check if this athlete has any coach role
        if (sportString.includes('coach')) {
          hasCoach = true;
        }
        
        // Split by multiple delimiters: comma, ampersand, AND dash with spaces
        athlete.sport.split(/[,&]|(?:\s+-\s+)/).forEach(sport => {
          const trimmedSport = sport.trim();
          // Replace standalone "Field" with "Track & Field"
          const normalizedSport = trimmedSport.toLowerCase() === 'field' ? 'Track & Field' : trimmedSport;
          
          if (normalizedSport && !normalizedSport.toLowerCase().includes('coach')) {
            sports.add(normalizedSport);
          }
        });
      }
    });
    
    // Add "Coach" as a category if any coaches exist
    if (hasCoach) {
      sports.add('Coach');
    }
    
    // Sort sports alphabetically (All will stay first)
    const sortedSports = Array.from(sports).sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return a.localeCompare(b);
    });
    
    // Sort years descending (newest first)
    const sortedYears = Array.from(years)
        .filter(y => y !== 'All')
        .map(String)
        .sort((a, b) => b - a); 
    
    return { 
        uniqueSports: sortedSports, 
        uniqueYears: ['All', ...sortedYears]
    };
  }, [allAthletes]);
  
  // Memoized function for filtering and sorting
  const filteredAndSortedAthletes = useMemo(() => {
    let result = [...allAthletes];

    // 1. Filtering by Selected HOF Year (Timeline filter)
    if (selectedYear !== 'All') {
        result = result.filter(athlete => String(athlete.classYear) === selectedYear);
    }

    // 2. Filtering by Sport
    if (filterSport !== 'All') {
      result = result.filter(athlete => {
        if (!athlete.sport) return false;
        
        const sportLower = athlete.sport.toLowerCase();
        
        // Special handling for Coach filter
        if (filterSport === 'Coach') {
          return sportLower.includes('coach');
        }
        
        // Special handling for Track & Field filter
        if (filterSport === 'Track & Field') {
          // Match if sport contains "Track & Field" OR standalone "Field"
          return athlete.sport.split(/[,&]|(?:\s+-\s+)/).some(s => {
            const trimmed = s.trim();
            return trimmed === 'Track & Field' || trimmed.toLowerCase() === 'field';
          });
        }
        
        // Check if the selected sport appears in the athlete's sport list
        return athlete.sport.split(/[,&]|(?:\s+-\s+)/).some(s => s.trim() === filterSport);
      });
    }

    // 3. Filtering by Search Term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(athlete => {
        const normalizedSport = normalizeSportName(athlete.sport);
        
        return athlete.name?.toLowerCase().includes(lowerCaseSearch) || 
          normalizedSport?.toLowerCase().includes(lowerCaseSearch) ||
          athlete.classYear?.toString().includes(lowerCaseSearch) ||
          athlete.graduationYear?.toString().includes(lowerCaseSearch);
      });
    }

    // 4. Sorting
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


  // Handler for changing sort type and toggling order
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === 'graduationYear' ? 'desc' : 'asc'); 
    }
  };

  // Handler for scrolling the timeline
  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
        const scrollAmount = direction === 'left' ? -250 : 250;
        timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // --- Utility Renderings (Loading/Error) ---

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

  // --- Main Component Render ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      
      {/* Header Section */}
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
      
      {/* --- Horizontal Timeline Filter (Top) --- */}
      <section className="bg-slate-900/70 py-6 border-y border-yellow-500/50 shadow-inner">
        <div className="container mx-auto px-4">
            <div className="relative flex items-center">
                {/* Scroll Left Button */}
