// src/components/admin/ManageWallOfFame.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { Image, Save, AlertCircle, CheckCircle, X, Play } from 'lucide-react';

const ManageWallOfFame = () => {
  const [pageData, setPageData] = useState({
    description: '',
    photos: [],
    videoURL: ''
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pages', 'wall-of-fame');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPageData(data);
        setPhotoPreviews(data.photos || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Wall of Fame data:', error);
      showMessage('error', 'Error loading Wall of Fame data');
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const invalidFiles = files.filter(file => {
      const fileName = file.name.toLowerCase();
      return fileName.endsWith('.heic') || fileName.endsWith('.heif');
    });

    if (invalidFiles.length > 0) {
      showMessage('error', 'HEIC files are not supported. Please convert to JPG or PNG first.');
      e.target.value = '';
      return;
    }

    setPhotoFiles(files);
    
    // Generate previews
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setPhotoPreviews([...pageData.photos, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    const existingPhotoCount = pageData.photos.length;
    
    if (index < existingPhotoCount) {
      // Remove from existing photos
      const newPhotos = [...pageData.photos];
      newPhotos.splice(index, 1);
      setPageData({ ...pageData, photos: newPhotos });
    }
    
    // Update previews
    const newPreviews = [...photoPreviews];
    newPreviews.splice(index, 1);
    setPhotoPreviews(newPreviews);
    
    // Update file list if needed
    if (index >= existingPhotoCount && photoFiles.length > 0) {
      const fileIndex = index - existingPhotoCount;
      const newFiles = [...photoFiles];
      newFiles.splice(fileIndex, 1);
      setPhotoFiles(newFiles);
    }
  };

  const uploadPhotos = async () => {
    if (photoFiles.length === 0) return pageData.photos;

    setUploading(true);
    const uploadedURLs = [...pageData.photos];

    try {
      for (const file of photoFiles) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const storageRef = ref(storage, `wall-of-fame/photo-${timestamp}-${random}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedURLs.push(downloadURL);
      }
      
      setUploading(false);
      return uploadedURLs;
    } catch (error) {
      console.error('Error uploading photos:', error);
      setUploading(false);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let photos = pageData.photos;
      
      if (photoFiles.length > 0) {
        photos = await uploadPhotos();
      }

      const dataToSave = {
        description: pageData.description,
        photos: photos,
        videoURL: pageData.videoURL,
        updatedAt: new Date().toISOString()
      };

      const docRef = doc(db, 'pages', 'wall-of-fame');
      await setDoc(docRef, dataToSave);
      
      setPageData(dataToSave);
      setPhotoFiles([]);
      showMessage('success', 'Wall of Fame updated successfully!');
      setSaving(false);
    } catch (error) {
      console.error('Error saving Wall of Fame:', error);
      showMessage('error', 'Error saving Wall of Fame');
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-norwell-blue"></div>
        <p className="mt-4 text-gray-600">Loading Wall of Fame data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-norwell-blue mb-2">Manage Wall of Fame</h2>
        <p className="text-gray-600">Edit the Wall of Fame page content</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={pageData.description}
            onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
            placeholder="Enter Wall of Fame description..."
          />
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Photos
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Supported formats: JPG, PNG, GIF, WebP (HEIC files not supported)
          </p>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            multiple
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-norwell-blue file:text-white hover:file:bg-blue-700 mb-4"
          />
          
          {/* Photo Grid */}
          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {photoPreviews.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            YouTube Video URL
          </label>
          <div className="flex gap-2">
            <Play className="w-5 h-5 text-gray-400 mt-3" />
            <input
              type="url"
              value={pageData.videoURL}
              onChange={(e) => setPageData({ ...pageData, videoURL: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
          </p>
        </div>

        {/* Preview Section */}
        <div className="border-t-2 border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl p-8 space-y-8">
            {pageData.description && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <p className="text-gray-200 text-lg">{pageData.description}</p>
              </div>
            )}
            
            {photoPreviews.length > 0 && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h4 className="text-white font-bold mb-4">Gallery ({photoPreviews.length} photos)</h4>
                <div className="grid grid-cols-3 gap-3">
                  {photoPreviews.slice(0, 6).map((photo, index) => (
                    <img key={index} src={photo} alt={`Preview ${index + 1}`} className="w-full aspect-video object-cover rounded" />
                  ))}
                </div>
                {photoPreviews.length > 6 && (
                  <p className="text-gray-400 text-sm mt-2">+ {photoPreviews.length - 6} more photos</p>
                )}
              </div>
            )}
            
            {pageData.videoURL && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h4 className="text-white font-bold mb-4">Featured Video</h4>
                <div className="aspect-video bg-black rounded">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Play className="w-16 h-16" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-norwell-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving || uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                {uploading ? 'Uploading Photos...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Wall of Fame
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-600">
            Changes will appear immediately on the Wall of Fame page
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageWallOfFame;
