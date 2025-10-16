// src/pages/public/Videos.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Play, X } from 'lucide-react';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const videosRef = collection(db, 'videos');
        const q = query(videosRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const videosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setVideos(videosData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    
    let videoId = null;
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Videos...</p>
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
            <Play className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Video Gallery
            </h1>
            <p className="text-xl text-gray-300">
              Watch highlights and ceremony videos from Norwell athletics
            </p>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4">
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <Play className="w-24 h-24 mx-auto mb-6 text-gray-500" />
              <h2 className="text-3xl font-bold text-white mb-4">No Videos Yet</h2>
              <p className="text-gray-400 text-lg">Videos will appear here once they are added to the gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {videos.map((video, index) => {
                const thumbnailUrl = getYouTubeThumbnail(video.url);
                
                return (
                  <div
                    key={video.id}
                    className="group bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-2xl hover:shadow-yellow-400/20 hover:border-yellow-400 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                      opacity: 0
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
                    
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={video.title || 'Video thumbnail'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-24 h-24 text-gray-600" />
                        </div>
                      )}
                      
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-300">
                        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                          <Play className="w-10 h-10 text-slate-900 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {video.title || 'Untitled Video'}
                      </h3>
                      
                      {video.description && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                          {video.description}
                        </p>
                      )}
                      
                      {video.classYear && (
                        <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                          Class of {video.classYear}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-50"
          >
            <X className="w-10 h-10" />
          </button>

          <div className="max-w-6xl w-full relative" onClick={(e) => e.stopPropagation()}>
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.url)}
                title={selectedVideo.title || 'Video'}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Video Details */}
            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h2 className="text-3xl font-bold text-white mb-3">
                {selectedVideo.title || 'Untitled Video'}
              </h2>
              
              {selectedVideo.classYear && (
                <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Class of {selectedVideo.classYear}
                </div>
              )}
              
              {selectedVideo.description && (
                <p className="text-gray-300 leading-relaxed">
                  {selectedVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Videos;