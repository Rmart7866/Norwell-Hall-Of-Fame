// src/pages/public/Galleries.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Image as ImageIcon, X } from 'lucide-react';

const Galleries = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const photosRef = collection(db, 'photos');
        const querySnapshot = await getDocs(photosRef);
        
        const photosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPhotos(photosData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 pt-32">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading Galleries...</p>
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
            <ImageIcon className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Photo Gallery
            </h1>
            <p className="text-xl text-gray-300">
              Celebrating moments of excellence in Norwell athletics
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4">
          {photos.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-24 h-24 mx-auto mb-6 text-gray-500" />
              <h2 className="text-3xl font-bold text-white mb-4">No Photos Yet</h2>
              <p className="text-gray-400 text-lg">Photos will appear here once they are added to the gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square bg-slate-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 border border-slate-700 hover:border-yellow-400"
                  onClick={() => setSelectedPhoto(photo)}
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.05}s forwards`,
                    opacity: 0
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
                  
                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Gallery photo'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                      <ImageIcon className="w-16 h-16 text-gray-600" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-semibold line-clamp-2">
                          {photo.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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

          <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || 'Full size photo'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            
            {selectedPhoto.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-lg">
                <p className="text-white text-xl font-semibold text-center">
                  {selectedPhoto.caption}
                </p>
              </div>
            )}
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

export default Galleries;