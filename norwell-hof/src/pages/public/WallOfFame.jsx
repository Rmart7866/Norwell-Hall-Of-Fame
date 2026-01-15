// src/pages/public/WallOfFame.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Image as ImageIcon, Play, X } from 'lucide-react';

const WallOfFame = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'pages', 'wall-of-fame');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPageData(docSnap.data());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Wall of Fame data:', error);
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    let videoId = null;
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    
    return videoId 
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` 
      : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Wall of Fame...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      {/* Header Section with Banner Image */}
      <section className="relative overflow-hidden">
        {pageData?.bannerImage ? (
          <div className="relative h-[500px]">
            <img
              src={pageData.bannerImage}
              alt="Wall of Fame Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition mb-6 font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </Link>
                <Trophy className="w-20 h-20 text-yellow-400 mb-6" />
                <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
                  Wall of Fame
                </h1>
                <div className="h-2 w-32 bg-gradient-to-r from-yellow-400 to-transparent"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 relative border-b-4 border-yellow-400">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition mb-6 font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>

              <div className="text-center">
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
                  Wall of Fame
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Celebrating excellence in Norwell athletics
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content Section */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Description */}
            {pageData?.description && (
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-10 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {pageData.description}
                </p>
              </div>
            )}

            {/* Photo Gallery */}
            {pageData?.photos && pageData.photos.length > 0 && (
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-10 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
                
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <ImageIcon className="w-8 h-8 text-yellow-400" />
                  Gallery
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pageData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="group relative aspect-video bg-slate-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300 border border-slate-600 hover:border-yellow-400"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img
                        src={photo}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {pageData?.videoURL && (
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-10 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
                
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <Play className="w-8 h-8 text-yellow-400" />
                  Featured Video
                </h2>

                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-400/30">
                  <iframe
                    src={getYouTubeEmbedUrl(pageData.videoURL)}
                    title="Wall of Fame Video"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {/* Empty State */}
            {!pageData && (
              <div className="text-center py-20 bg-slate-800/50 border-2 border-dashed border-yellow-400/30 rounded-xl">
                <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400/70" />
                <h2 className="text-4xl font-bold text-white mb-4">
                  Wall of Fame Coming Soon
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  Content will appear here once it's added by the administrator.
                </p>
                <Link
                  to="/"
                  className="inline-block bg-yellow-400 text-slate-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Back to Home
                </Link>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-50"
          >
            <X className="w-10 h-10" />
          </button>

          <div className="max-w-7xl max-h-[90vh] relative">
            <img
              src={selectedPhoto}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-yellow-600 to-yellow-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Explore More
          </h2>
          <p className="text-xl text-slate-800 mb-8 max-w-2xl mx-auto">
            View inductees by class year or learn about the nomination process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/inductees"
              className="inline-block bg-slate-900 text-yellow-400 px-8 py-3 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View Inductees
            </Link>
            <Link
              to="/about"
              className="inline-block bg-white text-slate-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              About & Nominations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WallOfFame;
