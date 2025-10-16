// src/components/admin/ManageClasses.jsx
import { useState, useEffect } from 'react';
import { createClass, getAllClasses, updateInductee } from '../../firebase/firestore';
import { Plus, Calendar, Trash2, Edit } from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    inducteeCount: 0,
    ceremonyDate: '',
    description: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await getAllClasses();
    if (!error) {
      setClasses(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const classData = {
      year: parseInt(formData.year),
      inducteeCount: parseInt(formData.inducteeCount),
      ceremonyDate: formData.ceremonyDate,
      description: formData.description,
    };

    if (editingId) {
      // Update existing class
      const { error } = await updateInductee(editingId, classData);
      
      if (error) {
        setMessage({ type: 'error', text: error });
      } else {
        setMessage({ type: 'success', text: 'Class updated successfully!' });
        setFormData({
          year: new Date().getFullYear(),
          inducteeCount: 0,
          ceremonyDate: '',
          description: '',
        });
        setEditingId(null);
        setShowForm(false);
        fetchClasses();
      }
    } else {
      // Create new class
      const { error } = await createClass(classData);

      if (error) {
        setMessage({ type: 'error', text: error });
      } else {
        setMessage({ type: 'success', text: 'Class created successfully!' });
        setFormData({
          year: new Date().getFullYear(),
          inducteeCount: 0,
          ceremonyDate: '',
          description: '',
        });
        setShowForm(false);
        fetchClasses();
      }
    }

    setLoading(false);
  };

  const handleEdit = (classItem) => {
    setEditingId(classItem.id);
    setFormData({
      year: classItem.year || new Date().getFullYear(),
      inducteeCount: classItem.inducteeCount || 0,
      ceremonyDate: classItem.ceremonyDate || '',
      description: classItem.description || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      year: new Date().getFullYear(),
      inducteeCount: 0,
      ceremonyDate: '',
      description: '',
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-norwell-blue">Manage Classes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-norwell-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Class
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

      {/* Add Class Form */}
      {showForm && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Induction Class' : 'Add New Induction Class'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Number of Inductees
                </label>
                <input
                  type="number"
                  name="inducteeCount"
                  value={formData.inducteeCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ceremony Date
              </label>
              <input
                type="text"
                name="ceremonyDate"
                value={formData.ceremonyDate}
                onChange={handleChange}
                placeholder="e.g., May 15, 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of this induction class..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-norwell-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Class' : 'Create Class')}
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

      {/* Classes List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Classes</h3>
        {loading && classes.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-norwell-blue"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No classes yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-norwell-blue transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-2xl font-bold text-norwell-blue">
                      Class of {classItem.year}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {classItem.inducteeCount || 0} Inductees
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(classItem)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit class"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {classItem.ceremonyDate && (
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Ceremony:</span> {classItem.ceremonyDate}
                  </p>
                )}

                {classItem.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {classItem.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;