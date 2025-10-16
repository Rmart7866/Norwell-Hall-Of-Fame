// src/components/admin/ManageInductees.jsx
import { useState, useEffect } from 'react';
import { createInductee, getAllInductees, getAllClasses, updateInductee } from '../../firebase/firestore';
import { Plus, Users, Trash2, Edit, Search } from 'lucide-react';

const ManageInductees = () => {
  const [inductees, setInductees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    classYear: new Date().getFullYear(),
    sport: '',
    graduationYear: '',
    bio: '',
    achievements: '',
    photoURL: '',
    videoURL: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [inducteesResult, classesResult] = await Promise.all([
      getAllInductees(),
      getAllClasses(),
    ]);
    
    if (!inducteesResult.error) {
      setInductees(inducteesResult.data);
    }
    
    if (!classesResult.error) {
      setClasses(classesResult.data);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const inducteeData = {
      name: formData.name,
      classYear: parseInt(formData.classYear),
      sport: formData.sport,
      graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null,
      bio: formData.bio,
      achievements: formData.achievements,
      photoURL: formData.photoURL,
      videoURL: formData.videoURL,
    };

    if (editingId) {
      // Update existing inductee
      const { error } = await updateInductee(editingId, inducteeData);
      
      if (error) {
        setMessage({ type: 'error', text: error });
      } else {
        setMessage({ type: 'success', text: 'Inductee updated successfully!' });
        setFormData({
          name: '',
          classYear: new Date().getFullYear(),
          sport: '',
          graduationYear: '',
          bio: '',
          achievements: '',
          photoURL: '',
          videoURL: '',
        });
        setEditingId(null);
        setShowForm(false);
        fetchData();
      }
    } else {
      // Create new inductee
      const { error } = await createInductee(inducteeData);

      if (error) {
        setMessage({ type: 'error', text: error });
      } else {
        setMessage({ type: 'success', text: 'Inductee created successfully!' });
        setFormData({
          name: '',
          classYear: new Date().getFullYear(),
          sport: '',
          graduationYear: '',
          bio: '',
          achievements: '',
          photoURL: '',
          videoURL: '',
        });
        setShowForm(false);
        fetchData();
      }
    }

    setLoading(false);
  };

  const handleEdit = (inductee) => {
    setEditingId(inductee.id);
    setFormData({
      name: inductee.name || '',
      classYear: inductee.classYear || new Date().getFullYear(),
      sport: inductee.sport || '',
      graduationYear: inductee.graduationYear || '',
      bio: inductee.bio || '',
      achievements: inductee.achievements || '',
      photoURL: inductee.photoURL || '',
      videoURL: inductee.videoURL || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      classYear: new Date().getFullYear(),
      sport: '',
      graduationYear: '',
      bio: '',
      achievements: '',
      photoURL: '',
      videoURL: '',
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const filteredInductees = inductees.filter((inductee) =>
    inductee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inductee.sport?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-norwell-blue">Manage Inductees</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-norwell-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Inductee
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

      {/* Add Inductee Form */}
      {showForm && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Inductee' : 'Add New Inductee'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Induction Class Year <span className="text-red-500">*</span>
                </label>
                <select
                  name="classYear"
                  value={formData.classYear}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                >
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.year}>
                      {classItem.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sport
                </label>
                <input
                  type="text"
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  placeholder="Football, Basketball, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="1995"
                  min="1900"
                  max="2100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell their story..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Achievements
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows="3"
                placeholder="3x All-League, State Champion, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Photo URL
              </label>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload to Firebase Storage first, then paste the URL here
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video URL (YouTube Embed)
              </label>
              <input
                type="url"
                name="videoURL"
                value={formData.videoURL}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use YouTube embed format: https://www.youtube.com/embed/VIDEO_ID
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-norwell-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Inductee' : 'Create Inductee')}
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
            placeholder="Search inductees by name or sport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
          />
        </div>
      </div>

      {/* Inductees List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          All Inductees ({filteredInductees.length})
        </h3>
        {loading && inductees.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-norwell-blue"></div>
          </div>
        ) : filteredInductees.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No inductees match your search' : 'No inductees yet. Create your first one!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInductees.map((inductee) => (
              <div
                key={inductee.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-norwell-blue transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {inductee.photoURL ? (
                    <img
                      src={inductee.photoURL}
                      alt={inductee.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{inductee.name}</h4>
                    <p className="text-sm text-gray-600">
                      {inductee.sport && <span>{inductee.sport} • </span>}
                      Class of {inductee.classYear}
                      {inductee.graduationYear && <span> • Graduated {inductee.graduationYear}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(inductee)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit inductee"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default ManageInductees;