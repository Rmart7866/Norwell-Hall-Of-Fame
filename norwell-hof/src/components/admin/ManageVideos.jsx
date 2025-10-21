// src/components/admin/ManageVideos.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { createVideo, getAllClasses } from '../../firebase/firestore'; // Assuming createVideo is still needed for simplicity, even though addDoc is used below
import { deleteVideo } from './HandleDelete'; // Assuming correct relative path and deleteVideo is updated to return { error }
import { Plus, Video as VideoIcon, Trash2, Edit, Loader2, X } from 'lucide-react';

const ManageVideos = () => {
  const [classes, setClasses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(true);
  
  // 🏆 NEW STATE FOR EDITING, MATCHING Championships FILE 🏆
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 

  const [formData, setFormData] = useState({
    classYear: new Date().getFullYear(),
    title: '',
    url: '',
    description: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchClasses();
    fetchVideos();
  }, []);

  const fetchClasses = async () => {
    // Assuming getAllClasses returns { data }
    // If it's a simple array of class objects, this needs adjustment
    // E.g., const data = await getAllClasses(); setClasses(data)
    try {
        const { data } = await getAllClasses();
        if (data) setClasses(data);
    } catch (e) {
        console.error("Error fetching classes:", e);
    }
  };

  const fetchVideos = async () => {
    setVideosLoading(true);
    try {
      const videosRef = collection(db, 'videos');
      // Using 'uploadedAt' for sorting, similar to 'createdAt' in championships
      const q = query(videosRef, orderBy('uploadedAt', 'desc')); 
      const querySnapshot = await getDocs(q);
      
      const videosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setMessage({ type: 'error', text: 'Failed to load video list.' });
    } finally {
      setVideosLoading(false);
    }
  };

  /* --- HANDLERS MATCHING Championships FILE LOGIC --- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.url.includes('youtu.be/') && !formData.url.includes('youtube.com/')) {
        setMessage({ type: 'error', text: 'Please enter a valid YouTube URL.' });
        setLoading(false);
        return;
    }

    const videoData = {
        classYear: parseInt(formData.classYear),
        title: formData.title,
        url: formData.url,
        description: formData.description,
    };
    
    try {
        if (editingId) {
            // UPDATE EXISTING VIDEO
            const docRef = doc(db, 'videos', editingId);
            await updateDoc(docRef, videoData);
            setMessage({ type: 'success', text: 'Video updated successfully!' });
        } else {
            // CREATE NEW VIDEO (using uploadedAt timestamp)
            await addDoc(collection(db, 'videos'), {
                ...videoData,
                uploadedAt: new Date(), 
            });
            setMessage({ type: 'success', text: 'Video added successfully!' });
        }
        
        // Reset form state regardless of edit/create
        handleCancelEdit();
        fetchVideos(); // Refresh the list
        
    } catch (error) {
        console.error('Error saving video:', error);
        setMessage({ type: 'error', text: error.message });
    }

    setLoading(false);
  };
  
  const handleEdit = (video) => {
    // Set the state to start editing
    setEditingId(video.id);
    setFormData({
        classYear: video.classYear || new Date().getFullYear(),
        title: video.title || '',
        url: video.url || '',
        description: video.description || '',
    });
    setShowForm(true); // Open the form
    // Scroll to the top where the form appears
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };
  
  const handleDeleteVideo = async (videoId, videoTitle) => {
    if (window.confirm(`Are you sure you want to delete the video: "${videoTitle}"?`)) {
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Assuming deleteVideo utility handles Firestore deletion
        const { error } = await deleteVideo(videoId); 

        if (error) {
            setMessage({ type: 'error', text: `Failed to delete video: ${error}` });
        } else {
            setMessage({ type: 'success', text: `Video "${videoTitle}" deleted successfully!` });
            
            // Remove from local state immediately
            setVideos(prev => prev.filter(v => v.id !== videoId));
            
            // Clear editing state if the deleted item was being edited
            if (editingId === videoId) {
                handleCancelEdit();
            }
        }
        setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
        classYear: new Date().getFullYear(),
        title: '',
        url: '',
        description: '',
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // -------------------------------------------------------------------
  // --- RENDER START ---
  // -------------------------------------------------------------------

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-norwell-blue">Manage Videos</h2>
        <button
          onClick={() => {
              if(showForm && editingId) {
                  // If closing an edit form, cancel edit mode
                  handleCancelEdit();
              } else {
                  // Toggle form visibility for add mode
                  setShowForm(!showForm);
                  // Ensure we are in add mode when opening
                  if(!showForm) setEditingId(null); 
              }
          }}
          className="flex items-center gap-2 bg-norwell-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add New Video'}
        </button>
      </div>

      {/* Message Banner */}
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

      {/* Add/Edit Video Form */}
      {showForm && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Video' : 'Add New Video'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Class Year Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Class Year <span className="text-red-500">*</span>
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
                    Class of {classItem.year}
                  </option>
                ))}
              </select>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="2024 Induction Ceremony"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                YouTube URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://youtu.be/N8jFW_bXo-c"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use the full URL, watch URL, or short `youtu.be` link.
              </p>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of the video..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-norwell-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading 
                    ? (editingId ? 'Updating...' : 'Adding...') 
                    : (editingId ? 'Update Video' : 'Add Video')
                }
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

      {/* Video List Table */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-10">Current Videos ({videos.length})</h3>
      
      {videosLoading ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Loader2 className="w-10 h-10 mx-auto mb-4 text-norwell-blue animate-spin" />
            <p className="text-gray-600 text-lg">Loading video list...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <VideoIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No videos have been added yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {videos.map((video) => (
                <tr key={video.id} className={editingId === video.id ? 'bg-yellow-50/50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {video.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Class of {video.classYear}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-norwell-blue hover:underline"
                    >
                        {video.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* EDIT Button */}
                    <button
                      onClick={() => handleEdit(video)}
                      disabled={loading}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                      title="Edit Video"
                    >
                      <Edit className="w-5 h-5 inline-block" />
                    </button>
                    {/* DELETE Button */}
                    <button
                      onClick={() => handleDeleteVideo(video.id, video.title)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                      title="Delete Video"
                    >
                      <Trash2 className="w-5 h-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageVideos;