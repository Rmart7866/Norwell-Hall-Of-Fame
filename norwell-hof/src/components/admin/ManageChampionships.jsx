// src/components/admin/ManageChampionships.jsx
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Trophy, Trash2, Edit, Search } from 'lucide-react';
import PhotoUploader from './PhotoUploader';

const ManageChampionships = () => {
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    coach: '',
    sport: '',
    description: '',
    photoURL: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchChampionships();
  }, []);

  const fetchChampionships = async () => {
    setLoading(true);
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
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const championshipData = {
      title: formData.title,
      year: parseInt(formData.year),
      coach: formData.coach,
      sport: formData.sport,
      description: formData.description,
      photoURL: formData.photoURL,
      createdAt: new Date(),
    };

    try {
      if (editingId) {
        const docRef = doc(db, 'championships', editingId);
        await updateDoc(docRef, championshipData);
        setMessage({ type: 'success', text: 'Championship updated successfully!' });
      } else {
        await addDoc(collection(db, 'championships'), championshipData);
        setMessage({ type: 'success', text: 'Championship created successfully!' });
      }
      
      setFormData({
        title: '',
        year: new Date().getFullYear(),
        coach: '',
        sport: '',
        description: '',
        photoURL: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchChampionships();
    } catch (error) {
      console.error('Error saving championship:', error);
      setMessage({ type: 'error', text: error.message });
    }

    setLoading(false);
  };

  const handleEdit = (championship) => {
    setEditingId(championship.id);
    setFormData({
      title: championship.title || '',
      year: championship.year || new Date().getFullYear(),
      coach: championship.coach || '',
      sport: championship.sport || '',
      description: championship.description || '',
      photoURL: championship.photoURL || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this championship?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'championships', id));
      setMessage({ type: 'success', text: 'Championship deleted successfully!' });
      fetchChampionships();
    } catch (error) {
      console.error('Error deleting championship:', error);
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      coach: '',
      sport: '',
      description: '',
      photoURL: '',
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (url) => {
    setFormData({ ...formData, photoURL: url });
  };

  const filteredChampionships = championships.filter((championship) =>
    championship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    championship.sport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    championship.coach?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-norwell-blue">Manage Championships</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-norwell-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Championship
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

      {/* Add/Edit Championship Form */}
      {showForm && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Championship' : 'Add New Championship'}
          </h3>

          {/* Photo Uploader */}
          <div className="mb-6">
            <PhotoUploader
              onUploadComplete={handlePhotoUpload}
              folder="championships"
            />
            {formData.photoURL && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-semibold mb-2">✓ Photo uploaded successfully!</p>
                <img src={formData.photoURL} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="State Championship, League Title, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max="2100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coach
                </label>
                <input
                  type="text"
                  name="coach"
                  value={formData.coach}
                  onChange={handleChange}
                  placeholder="Coach Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sport <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  required
                  placeholder="Football, Basketball, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Details about the championship..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-norwell-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Championship' : 'Create Championship')}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search championships by title, sport, or coach..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Championships List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          All Championships ({filteredChampionships.length})
        </h3>
        {loading && championships.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-norwell-blue"></div>
          </div>
        ) : filteredChampionships.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No championships match your search' : 'No championships yet. Create your first one!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChampionships.map((championship) => (
              <div
                key={championship.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-norwell-blue transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {championship.photoURL ? (
                    <img
                      src={championship.photoURL}
                      alt={championship.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{championship.title}</h4>
                    <p className="text-sm text-gray-600">
                      {championship.sport} • {championship.year}
                      {championship.coach && <span> • Coach: {championship.coach}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(championship)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit championship"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(championship.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete championship"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageChampionships;