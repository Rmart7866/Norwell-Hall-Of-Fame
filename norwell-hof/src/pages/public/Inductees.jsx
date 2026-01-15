// src/pages/public/Inductees.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllClasses } from '../../firebase/firestore';
import { Calendar, ChevronRight, Users } from 'lucide-react';

const Inductees = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const { data, error: fetchError } = await getAllClasses();
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setClasses(data);
      }
      
      setLoading(false);
    };

    fetchClasses();
  }, []);

  // Intersection Observer for scroll-triggered animations
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
    if (!loading && classes.length > 0) {
      const elements = document.querySelectorAll('[data-index]');
      elements.forEach((el) => {
        if (observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    }
  }, [loading, classes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Classes...</p>
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
              Hall of Fame <span className="text-yellow-500">Timeline</span>
            </h1>
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
          {classes.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h2 className="text-3xl font-bold text-white mb-4">No Inductee Classes Yet</h2>
              <p className="text-gray-400 text-lg">Classes will appear here once they are added to the database.</p>
            </div>
          ) : (
            <>
              {/* Timeline Container */}
              <div className="max-w-6xl mx-auto relative">
                {/* Vertical Line - Desktop only */}
                <div 
                  className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-yellow-500/60 via-yellow-600/40 to-yellow-500/60 origin-top"
                  style={{
                    animation: `draw-line ${classes.length * 0.4}s ease-out forwards`,
                    boxShadow: '0 0 15px rgba(234, 179, 8, 0.2)'
                  }}
                ></div>

                {/* Timeline Items */}
                <div className="space-y-20 md:space-y-24 relative">
                  {classes.map((classItem, index) => {
                    const isEven = index % 2 === 0;
                    const isVisible = visibleItems.has(index.toString());
                    const hasImage = !!classItem.imageURL;
                    
                    return (
                      <div key={classItem.id} className="relative" data-index={index}>
                        {/* Faded year background - BRIGHTENED - positioned to not be covered by cards */}
                        <div 
                          className="absolute pointer-events-none select-none hidden md:block"
                          style={{ 
                            fontSize: '14rem',
                            lineHeight: '1',
                            fontWeight: '900',
                            color: 'rgba(100, 116, 139, 0.08)', // Increased from 0.04 to 0.08
                            top: '50%',
                            left: isEven ? '65%' : '35%',
                            transform: `translate(-50%, -50%)`,
                            whiteSpace: 'nowrap',
                            zIndex: 0
                          }}
                        >
                          {classItem.year}
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:block">
                          {/* Content Card */}
                          <Link
                            to={`/inductees/class/${classItem.year}`}
                            className="block group"
                          >
                            <div 
                              className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'} transition-all duration-700 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                              }`}
                            >
                              {/* Card Container */}
                              <div className="w-5/12 relative" style={{ zIndex: 10 }}>
                                
                                <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:border-yellow-500/40 hover:shadow-yellow-500/10 relative">
                                  {/* Connecting line to timeline - INSIDE the card container */}
                                  <div className={`absolute top-1/2 ${isEven ? '-right-16' : '-left-16'} w-16 h-px bg-gradient-to-${isEven ? 'l' : 'r'} ${isEven ? 'from-yellow-500/40' : 'from-yellow-500/40'} to-transparent`}></div>
                                  
                                  {/* Subtle top accent */}
                                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>

                                  {/* Image Section (if exists) */}
                                  {hasImage && (
                                    <div className="relative h-48 overflow-hidden">
                                      <img 
                                        src={classItem.imageURL} 
                                        alt={`${classItem.year} Induction Class`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      {/* Gradient overlay on image */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-800/95 to-transparent"></div>
                                      {/* Year badge on image */}
                                      <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 px-4 py-2 rounded-full font-black text-xl shadow-lg">
                                        '{classItem.year.toString().slice(-2)}
                                      </div>
                                    </div>
                                  )}

                                  {/* Content Section */}
                                  <div className="p-8 relative z-10">
                                    {/* Year - Only show large if no image */}
                                    <div className="mb-6">
                                      {!hasImage && (
                                        <h3 className="text-5xl font-black text-white tracking-tight mb-2">
                                          {classItem.year}
                                        </h3>
                                      )}
                                      {hasImage && (
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">
                                          {classItem.year}
                                        </h3>
                                      )}
                                      <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                                        Induction Class
                                      </div>
                                    </div>

                                    {/* Ceremony Date */}
                                    {classItem.ceremonyDate && (
                                      <div className="mb-6">
                                        <p className="text-yellow-500 font-medium">
                                          {classItem.ceremonyDate}
                                        </p>
                                      </div>
                                    )}

                                    {/* Inductee Count */}
                                    <div className="mb-6">
                                      <div className="text-2xl font-bold text-white mb-1">
                                        {classItem.inducteeCount || 0} {classItem.inducteeCount === 1 ? 'Inductee' : 'Inductees'}
                                      </div>
                                    </div>

                                    {/* Description */}
                                    {classItem.description && (
                                      <p className="text-gray-400 mb-6 leading-relaxed">
                                        {classItem.description}
                                      </p>
                                    )}

                                    {/* View Button */}
                                    <div className="pt-4 border-t border-slate-700">
                                      <div className="flex items-center justify-between text-yellow-500 font-medium group-hover:text-yellow-400 transition-colors">
                                        <span className="text-sm uppercase tracking-wide">View Class</span>
                                        <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Center Timeline Dot */}
                              <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
                                <div className="relative">
                                  {/* Outer glow ring */}
                                  <div className="absolute inset-0 w-10 h-10 bg-yellow-500/20 rounded-full blur-lg animate-pulse"></div>
                                  {/* Main dot */}
                                  <div className="relative w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-4 border-slate-900 shadow-lg group-hover:scale-110 transition-transform">
                                    <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-10"></div>
                                  </div>
                                </div>
                              </div>

                              {/* Spacer */}
                              <div className="w-5/12"></div>
                            </div>
                          </Link>
                        </div>

                        {/* Mobile Layout */}
                        <div className="md:hidden">
                          <Link
                            to={`/inductees/class/${classItem.year}`}
                            className="block group"
                          >
                            <div 
                              className={`bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-2xl hover:border-yellow-500/40 hover:shadow-yellow-500/10 transition-all relative ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                              }`}
                              style={{ transitionDuration: '700ms' }}
                            >
                              {/* Subtle top accent */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>

                              {/* Image Section (if exists) */}
                              {hasImage && (
                                <div className="relative h-40 overflow-hidden">
                                  <img 
                                    src={classItem.imageURL} 
                                    alt={`${classItem.year} Induction Class`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  {/* Gradient overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-800/95 to-transparent"></div>
                                  {/* Year badge on image */}
                                  <div className="absolute top-3 right-3 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full font-black text-lg shadow-lg">
                                    '{classItem.year.toString().slice(-2)}
                                  </div>
                                </div>
                              )}

                              {/* Content Section */}
                              <div className="p-6 relative z-10">
                                {/* Year */}
                                <div className="mb-4">
                                  {!hasImage && (
                                    <h3 className="text-4xl font-black text-white mb-1">{classItem.year}</h3>
                                  )}
                                  {hasImage && (
                                    <h3 className="text-2xl font-black text-white mb-1">{classItem.year}</h3>
                                  )}
                                  <div className="text-xs text-gray-400 uppercase tracking-wider">
                                    Induction Class
                                  </div>
                                </div>

                                {/* Ceremony Date */}
                                {classItem.ceremonyDate && (
                                  <div className="mb-4">
                                    <p className="text-yellow-500 font-medium text-sm">
                                      {classItem.ceremonyDate}
                                    </p>
                                  </div>
                                )}

                                {/* Inductee Count */}
                                <div className="mb-4">
                                  <div className="text-xl font-bold text-white">
                                    {classItem.inducteeCount || 0} {classItem.inducteeCount === 1 ? 'Inductee' : 'Inductees'}
                                  </div>
                                </div>

                                {/* Description */}
                                {classItem.description && (
                                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                                    {classItem.description}
                                  </p>
                                )}

                                {/* View Button */}
                                <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-yellow-500">
                                  <span className="text-xs uppercase tracking-wide font-medium">View Class</span>
                                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </Link>
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
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-yellow-600 to-yellow-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Know a Future Legend?
          </h2>
          <p className="text-xl text-slate-800 mb-8 max-w-2xl mx-auto">
            Nominations are accepted annually for those who have made outstanding contributions to Norwell athletics.
          </p>
          <Link
            to="/about"
            className="inline-block bg-slate-900 text-yellow-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Learn About Nominations
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Inductees;
