// src/components/admin/ManageChampionshipPhotos.jsx
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Image, Trash2, Search, Star } from 'lucide-react';
import PhotoUploader from './PhotoUploader';

const ManageChampionshipPhotos = () => {
  const [championships, setChampionships] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChampionship, setSelectedChampionship] = useState('');
  const [formData, setFormData] = useState({
    championshipId: '',
    url: '',
    caption: '',
    order: 0,
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchChampionships();
    fetchPhotos();
  }, []);

  const fetchChampionships = async () => {
    try {
      const championshipsRef = collection(db, 'championships');
      const q = query(championshipsRef, orderBy('year', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const championshipsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setChampionships(championshipsData);
    } catch (error) {
      console.error('Error fetching championships:', error);
    }
  };

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const photosRef = collection(db, 'championship_photos');
      const q = query(photosRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPhotos(photosData);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.championshipId || !formData.url) {
      setMessage({ type: 'error', text: 'Please select a championship and provide a photo URL' });
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'championship_photos'), {
        championshipId: formData.championshipId,
        url: formData.url,
        caption: formData.caption,
        order: parseInt(formData.order),
        createdAt: new Date(),
      });
      
      setMessage({ type: 'success', text: 'Photo added successfully!' });
      setFormData({
        championshipId: '',
        url: '',
        caption: '',
        order: 0,
      });
      setShowForm(false);
      fetchPhotos();
    } catch (error) {
      console.error('Error adding photo:', error);
      setMessage({ type: 'error', text: error.message });
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'championship_photos', id));
      setMessage({ type: 'success', text: 'Photo deleted successfully!' });
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  const handleSetAsMainPhoto = async (photo) => {
    if (!window.confirm('Set this photo as the main championship photo?')) return;
    
    setLoading(true);
    try {
      // Update the championship document with this photo URL
      const championshipRef = doc(db, 'championships', photo.championshipId);
      await updateDoc(championshipRef, {
        photoURL: photo.url
      });
      
      setMessage({ type: 'success', text: 'Main photo updated successfully!' });
      fetchChampionships(); // Refresh to show the updated main photo
    } catch (error) {
      console.error('Error setting main photo:', error);
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (url) => {
    setFormData({ ...formData, url });
    setMessage({ type: 'success', text: 'Photo uploaded! URL added to form.' });
  };

  // Get championship title by ID
  const getChampionshipTitle = (championshipId) => {
    const championship = championships.find(c => c.id === championshipId);
    return championship ? `${championship.title} (${championship.year})` : 'Unknown';
  };

  // Check if photo is the main photo for its championship
  const isMainPhoto = (photo) => {
    const championship = championships.find(c => c.id === photo.championshipId);
    return championship && championship.photoURL === photo.url;
  };

  // Filter photos by selected championship
  const filteredPhotos = selectedChampionship
    ? photos.filter(photo => photo.championshipId === selectedChampionship)
    : photos.filter(photo => {
        const championship = championships.find(c => c.id === photo.championshipId);
        if (!championship) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
          championship.title.toLowerCase().includes(searchLower) ||
          championship.year.toString().includes(searchLower) ||
          photo.caption?.toLowerCase().includes(searchLower)
        );
      });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-norwell-blue">Manage Championship Photos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-norwell-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Photo
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Photo Form */}
      {showForm && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add Photo to Championship Gallery</h3>
          
          {/* Photo Uploader */}
          <div className="mb-6">
            <PhotoUploader
              onUploadComplete={handlePhotoUpload}
              folder="championships"
            />
            {formData.url && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-semibold mb-2">✓ Photo uploaded successfully!</p>
                <img src={formData.url} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Championship <span className="text-red-500">*</span>
              </label>
              <select
                name="championshipId"
                value={formData.championshipId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              >
                <option value="">Choose a championship...</option>
                {championships.map((championship) => (
                  <option key={championship.id} value={championship.id}>
                    {championship.title} - {championship.year} ({championship.sport})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Caption
              </label>
              <input
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                placeholder="Photo description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !formData.url}
                className="bg-norwell-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Adding...' : 'Add Photo'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Options */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by championship or caption..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
          />
        </div>

        {/* Championship Filter */}
        <div>
          <select
            value={selectedChampionship}
            onChange={(e) => setSelectedChampionship(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
          >
            <option value="">All Championships</option>
            {championships.map((championship) => (
              <option key={championship.id} value={championship.id}>
                {championship.title} - {championship.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Photos Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          All Photos ({filteredPhotos.length})
        </h3>
        {loading && photos.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-norwell-blue"></div>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">
              {searchTerm || selectedChampionship ? 'No photos match your filters' : 'No photos yet. Add your first one!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-norwell-blue transition-colors group relative"
              >
                {/* Main Photo Badge */}
                {isMainPhoto(photo) && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-slate-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    Main Photo
                  </div>
                )}

                {/* Photo */}
                <div className="aspect-square bg-gray-200">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Championship photo'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-semibold mb-1">
                      {getChampionshipTitle(photo.championshipId)}
                    </p>
                    {photo.caption && (
                      <p className="text-gray-300 text-xs line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {!isMainPhoto(photo) && (
                    <button
                      onClick={() => handleSetAsMainPhoto(photo)}
                      className="bg-yellow-400 text-slate-900 p-2 rounded-full hover:bg-yellow-500 transition shadow-lg"
                      title="Set as main photo"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-lg"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info Bar */}
                <div className="p-2 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-600 truncate">
                    {getChampionshipTitle(photo.championshipId)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageChampionshipPhotos;