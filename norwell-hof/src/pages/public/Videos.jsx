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
                // Using 'uploadedAt' for sorting (newest first)
                const q = query(videosRef, orderBy('uploadedAt', 'desc')); 
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
        
        let videoId = null;
        
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        }
        
        // Added modestbranding and rel=0
        return videoId 
            ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` 
            : null;
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
        
        // Using hqdefault.jpg (High Quality Default) for reliability
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
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
                {/* Background effects enhanced */}
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
                        /* Empty State - Enhanced */
                        <div className="text-center py-24 bg-slate-800/50 border-2 border-dashed border-yellow-400/30 rounded-xl max-w-lg mx-auto shadow-xl">
                            <Play className="w-24 h-24 mx-auto mb-6 text-yellow-400/70 animate-pulse" />
                            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-wider">
                                No Videos Yet
                            </h2>
                            <p className="text-gray-300 text-lg">
                                Check back soon! New highlights and ceremony videos will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                            {videos.map((video, index) => {
                                const thumbnailUrl = getYouTubeThumbnail(video.url);
                                
                                return (
                                    <div
                                        key={video.id}
                                        /* Video Card - Enhanced Styling */
                                        className="group bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-2xl hover:shadow-yellow-400/50 transition-all duration-500 cursor-pointer transform hover:translate-y-[-4px] hover:scale-[1.01]"
                                        onClick={() => setSelectedVideo(video)}
                                        style={{
                                            animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                                            opacity: 0
                                        }}
                                    >
                                        {/* Top glow bar for premium feel */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
                                            {thumbnailUrl ? (
                                                <img
                                                    src={thumbnailUrl}
                                                    alt={video.title || 'Video thumbnail'}
                                                    /* Slower, dramatic zoom on hover */
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Play className="w-24 h-24 text-gray-600" />
                                                </div>
                                            )}
                                            
                                            {/* Play overlay - Enhanced with glowing ring */}
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors duration-300">
                                                <div className="relative">
                                                    {/* Glowing Ring Effect */}
                                                    <div className="absolute inset-[-4px] rounded-full bg-yellow-400 opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-500 animate-ping-slow"></div>
                                                    
                                                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center transition-transform duration-300 shadow-xl relative">
                                                        <Play className="w-10 h-10 text-slate-900 ml-1" fill="currentColor" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Video Info */}
                                        <div className="p-6">
                                            <h3 className="text-2xl font-extrabold text-white mb-2 line-clamp-2 leading-tight">
                                                {video.title || 'Untitled Video'}
                                            </h3>
                                            
                                            {video.description && (
                                                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                                    {video.description}
                                                </p>
                                            )}
                                            
                                            {video.classYear && (
                                                /* Class Tag - Enhanced */
                                                <div className="inline-block bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-4 py-1.5 rounded-lg text-sm font-bold tracking-wider mt-2">
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

            {/* Video Modal - Enhanced */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedVideo(null)}
                >
                    <button
                        onClick={() => setSelectedVideo(null)}
                        /* Close Button - Enhanced */
                        className="absolute top-8 right-8 text-white hover:text-yellow-400 transition-colors z-[51] p-2 bg-slate-900/70 rounded-full border border-slate-700 hover:border-yellow-400/50"
                        title="Close Video"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="max-w-6xl w-full relative" onClick={(e) => e.stopPropagation()}>
                        {/* Video Player - Enhanced Border */}
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-blue-500/20 mb-6 border-4 border-yellow-400/50">
                            <iframe
                                src={getYouTubeEmbedUrl(selectedVideo.url)}
                                title={selectedVideo.title || 'Video'}
                                className="w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                        </div>

                        {/* Video Details - Sleek Dark Box */}
                        <div className="relative bg-slate-900/90 border-2 border-slate-700 rounded-xl p-6 shadow-2xl">
                            {/* Subtle top glow line */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/80 to-transparent"></div>
                            
                            <h2 className="text-4xl font-extrabold text-white mb-3">
                                {selectedVideo.title || 'Untitled Video'}
                            </h2>
                            
                            {selectedVideo.classYear && (
                                /* Tag - Enhanced */
                                <div className="inline-block bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 px-4 py-2 rounded-full text-md font-bold tracking-wider mb-4">
                                    Class of {selectedVideo.classYear}
                                </div>
                            )}
                            
                            {selectedVideo.description && (
                                <p className="text-gray-300 leading-relaxed text-lg border-t border-slate-700 pt-4 mt-4">
                                    {selectedVideo.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom animations */}
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
                @keyframes ping-slow {
                    75%, 100% {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }
                .animate-ping-slow {
                    animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default Videos;