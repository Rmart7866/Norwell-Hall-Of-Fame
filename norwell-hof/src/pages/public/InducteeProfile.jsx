// src/pages/public/InducteeProfile.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInductee, getPhotosByInductee } from '../../firebase/firestore';
import { ArrowLeft, Calendar, Award, Trophy, User, Image as ImageIcon, Play } from 'lucide-react';

const InducteeProfile = () => {
  const { id } = useParams();
  const [inductee, setInductee] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchInducteeData = async () => {
      setLoading(true);
      
      // Fetch inductee details
      const { data: inducteeData, error: inducteeError } = await getInductee(id);
      
      if (inducteeError) {
        setError(inducteeError);
        setLoading(false);
        return;
      }
      
      setInductee(inducteeData);
      
      // Fetch photos
      const { data: photosData } = await getPhotosByInductee(id);
      setPhotos(photosData || []);
      
      setLoading(false);
    };

    fetchInducteeData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !inductee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 px-4 pt-32">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Inductee Not Found</h2>
          <p className="text-red-600 mb-6">{error || 'Unable to load inductee information'}</p>
          <Link
            to="/inductees"
            className="inline-block bg-slate-900 text-yellow-500 px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Back to Inductees
          </Link>
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
          <Link
            to={`/inductees/class/${inductee.classYear}`}
            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition mb-6 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Class of {inductee.classYear}
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {inductee.name}
            </h1>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-6 py-2 rounded-full font-bold text-lg shadow-lg">
              <Trophy className="w-5 h-5" />
              Class of {inductee.classYear}
            </div>
          </div>
        </div>
      </section>

      {/* Animated fog/mist background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-yellow-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
      </div>

      {/* Profile Content */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Main Profile Card */}
            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>

              <div className="md:flex">
                {/* Photo Section */}
                <div className="md:w-2/5 bg-gradient-to-br from-slate-900 to-blue-900 p-8 flex items-center justify-center">
                  {inductee.photoURL ? (
                    <img
                      src={inductee.photoURL}
                      alt={inductee.name}
                      className="w-full max-w-sm rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-12">
                      <User className="w-48 h-48 text-yellow-500 opacity-50" />
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="md:w-3/5 p-8">
                  <div className="space-y-6">
                    {inductee.sport && (
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 font-medium">Sport</p>
                        <p className="text-2xl text-white font-bold">{inductee.sport}</p>
                      </div>
                    )}

                    {inductee.graduationYear && (
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-1 font-medium">Graduation Year</p>
                        <p className="text-2xl text-white font-bold">{inductee.graduationYear}</p>
                      </div>
                    )}

                    {inductee.achievements && (
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2 font-medium">Key Achievements</p>
                        <p className="text-gray-300 leading-relaxed">{inductee.achievements}</p>
                      </div>
                    )}

                    {!inductee.sport && !inductee.graduationYear && !inductee.achievements && (
                      <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6 text-center">
                        <p className="text-gray-400 italic">
                          Additional profile information coming soon...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Section */}
            {inductee.bio && (
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
                
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  Biography
                </h2>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  {inductee.bio.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {inductee.videoURL && (
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
                
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Play className="w-8 h-8 text-yellow-500" />
                  Induction Video
                </h2>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={inductee.videoURL}
                    title={`${inductee.name} Induction Video`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Photo Gallery Section */}
            {photos.length > 0 ? (
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
                
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <ImageIcon className="w-8 h-8 text-yellow-500" />
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-square bg-slate-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-yellow-500/20 transition-all hover:scale-105"
                      onClick={() => setSelectedPhoto(photo.url)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Photo'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl text-center relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
                
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-bold text-white mb-2">No Photos Available</h3>
                <p className="text-gray-400">Photos will be added soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-6xl max-h-[90vh] relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-yellow-500 transition"
            >
              ×
            </button>
            <img
              src={selectedPhoto}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Navigation Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-600 to-yellow-700">
        <div className="container mx-auto px-4 text-center">
          <Link
            to={`/inductees/class/${inductee.classYear}`}
            className="inline-flex items-center gap-2 bg-slate-900 text-yellow-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Class of {inductee.classYear}
          </Link>
          <Link
            to="/inductees"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Classes
          </Link>
        </div>
      </section>
    </div>
  );
};

export default InducteeProfile;