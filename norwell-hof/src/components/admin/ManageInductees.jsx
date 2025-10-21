// src/components/admin/ManageInductees.jsx
import { useState, useEffect } from 'react';
// IMPORT NEW deleteInductee FUNCTION HERE
import { createInductee, getAllInductees, getAllClasses, updateInductee, createPhoto, deleteInductee } from '../../firebase/firestore'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { Plus, Users, Trash2, Edit, Search, Upload, X, Star, Image as ImageIcon, Move } from 'lucide-react';
import { deleteInducteeWithPhoto } from './HandleDelete.jsx';

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
    photoPosition: 'center',
    secondPhotoURL: '',
    secondPhotoPosition: 'center',
    videoURL: '',
  });
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const positionOptions = [
    { value: 'top', label: 'Top' },
    { value: 'center', label: 'Center' },
    { value: 'bottom', label: 'Bottom' },
  ];

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, photoType = 'gallery') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      if (photoType === 'primary' || photoType === 'secondary') {
        uploadSinglePhoto(imageFiles[0], photoType);
      } else {
        uploadMultiplePhotos(imageFiles);
      }
    }
  };

  const handleFileSelect = (e, photoType = 'gallery') => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      if (photoType === 'primary' || photoType === 'secondary') {
        uploadSinglePhoto(imageFiles[0], photoType);
      } else {
        uploadMultiplePhotos(imageFiles);
      }
    }
  };

  const uploadSinglePhoto = async (file, photoType) => {
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    const uploadId = Date.now();
    setUploadingPhotos(prev => [...prev, { id: uploadId, name: file.name, progress: 0, type: photoType }]);

    try {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, `inductees/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingPhotos(prev => 
            prev.map(p => p.id === uploadId ? { ...p, progress } : p)
          );
        },
        (error) => {
          console.error('Upload error:', error);
          setMessage({ type: 'error', text: `Upload failed: ${error.message}` });
          setUploadingPhotos(prev => prev.filter(p => p.id !== uploadId));
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          if (photoType === 'primary') {
            setFormData(prev => ({ ...prev, photoURL: downloadURL }));
            setMessage({ type: 'success', text: 'Primary photo uploaded!' });
          } else if (photoType === 'secondary') {
            setFormData(prev => ({ ...prev, secondPhotoURL: downloadURL }));
            setMessage({ type: 'success', text: 'Secondary photo uploaded!' });
          }
          
          setUploadingPhotos(prev => prev.filter(p => p.id !== uploadId));
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: `Upload failed: ${error.message}` });
      setUploadingPhotos(prev => prev.filter(p => p.id !== uploadId));
    }
  };

  const uploadMultiplePhotos = async (files) => {
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length < files.length) {
      setMessage({ type: 'error', text: 'Some files were skipped (size > 5MB)' });
    }

    for (const file of validFiles) {
      const uploadId = Date.now() + Math.random();
      setUploadingPhotos(prev => [...prev, { id: uploadId, name: file.name, progress: 0, type: 'gallery' }]);

      try {
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `inductees/gallery/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadingPhotos(prev => 
              prev.map(p => p.id === uploadId ? { ...p, progress } : p)
            );
          },
          (error) => {
            console.error('Upload error:', error);
            setUploadingPhotos(prev => prev.filter(p => p.id !== uploadId));
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            setGalleryPhotos(prev => [...prev, {
              id: uploadId,
              url: downloadURL,
              caption: '',
              order: prev.length
            }]);
            
            setUploadingPhotos(prev => prev.filter(p => p.id !== uploadId));
          }
        );
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingPhotos(prev => prev.filter(p => p.id !== uploadId));
      }
    }
  };

  const removeGalleryPhoto = (photoId) => {
    setGalleryPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const updatePhotoCaption = (photoId, caption) => {
    setGalleryPhotos(prev => 
      prev.map(p => p.id === photoId ? { ...p, caption } : p)
    );
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
      photoPosition: formData.photoPosition,
      secondPhotoURL: formData.secondPhotoURL,
      secondPhotoPosition: formData.secondPhotoPosition,
      videoURL: formData.videoURL,
    };

    try {
      let inducteeId;
      
      if (editingId) {
        const { error } = await updateInductee(editingId, inducteeData);
        if (error) throw new Error(error);
        inducteeId = editingId;
        setMessage({ type: 'success', text: 'Inductee updated successfully!' });
      } else {
        const { id, error } = await createInductee(inducteeData);
        if (error) throw new Error(error);
        inducteeId = id;
        setMessage({ type: 'success', text: 'Inductee created successfully!' });
      }

      for (const photo of galleryPhotos) {
        await createPhoto({
          inducteeId: inducteeId,
          url: photo.url,
          caption: photo.caption,
          order: photo.order
        });
      }

      setFormData({
        name: '',
        classYear: new Date().getFullYear(),
        sport: '',
        graduationYear: '',
        bio: '',
        achievements: '',
        photoURL: '',
        photoPosition: 'center',
        secondPhotoURL: '',
        secondPhotoPosition: 'center',
        videoURL: '',
      });
      setGalleryPhotos([]);
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }

    setLoading(false);
  };

  // ------------------------------------------------------------------
  // NEW CODE: handleDelete FUNCTION
  // ------------------------------------------------------------------
  const handleDelete = async (inductee) => {
    // 1. Confirmation Dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete inductee: ${inductee.name} (Class of ${inductee.classYear})? \n\nThis action cannot be undone and will permanently remove the inductee and all associated photo data.`
    );

    if (!confirmDelete) {
      return; // Stop if the user cancels
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 2. Call the new utility function, passing the inductee object
      const { error } = await deleteInducteeWithPhoto(inductee); // <-- UPDATED CALL
      
      if (error) {
        // This error comes from the deleteInducteeWithPhoto utility
        throw new Error(error); 
      }

      // 3. Update local state
      setMessage({ type: 'success', text: `Inductee '${inductee.name}' deleted successfully.` });
      // Efficiently remove the deleted inductee from the list
      setInductees(prevInductees => prevInductees.filter(i => i.id !== inductee.id));
      
      // If the deleted inductee was being edited, clear the form
      if (editingId === inductee.id) {
        handleCancelEdit();
      }

    } catch (error) {
      console.error('Error deleting inductee:', error);
      setMessage({ type: 'error', text: `Failed to delete inductee: ${error.message}` });
    }

    setLoading(false);
};
  // ------------------------------------------------------------------
  // END NEW CODE
  // ------------------------------------------------------------------


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
      photoPosition: inductee.photoPosition || 'center',
      secondPhotoURL: inductee.secondPhotoURL || '',
      secondPhotoPosition: inductee.secondPhotoPosition || 'center',
      videoURL: inductee.videoURL || '',
    });
    setGalleryPhotos([]);
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
      photoPosition: 'center',
      secondPhotoURL: '',
      secondPhotoPosition: 'center',
      videoURL: '',
    });
    setGalleryPhotos([]);
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

  const getObjectPosition = (position) => {
    switch(position) {
      case 'top': return 'object-top';
      case 'bottom': return 'object-bottom';
      default: return 'object-center';
    }
  };

  const DropZone = ({ onDrop, onFileSelect, label, accept = "image/*", multiple = false }) => (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={(e) => onDrop(e)}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        dragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 bg-gray-50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
      <p className="text-gray-600 font-medium mb-1">{label}</p>
      <p className="text-sm text-gray-500">
        {multiple ? 'PNG, JPG, GIF up to 5MB each' : 'PNG, JPG, GIF up to 5MB'}
      </p>
    </div>
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
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {editingId ? 'Edit Inductee' : 'Add New Inductee'}
          </h3>

          {/* Photo Upload Section */}
          <div className="mb-8 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Card Photos
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Photo (Front of Card)
                  </label>
                  {formData.photoURL ? (
                    <div className="space-y-3">
                      <div className="relative group">
                        <div className="h-80 bg-slate-900 rounded-lg overflow-hidden">
                          <img 
                            src={formData.photoURL} 
                            alt="Primary" 
                            className={`w-full h-full object-cover ${getObjectPosition(formData.photoPosition)}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, photoURL: '', photoPosition: 'center' }))}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                          <Move className="w-3 h-3" />
                          Photo Position
                        </label>
                        <div className="flex gap-2">
                          {positionOptions.map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, photoPosition: option.value }))}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                formData.photoPosition === option.value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <DropZone
                      onDrop={(e) => handleDrop(e, 'primary')}
                      onFileSelect={(e) => handleFileSelect(e, 'primary')}
                      label="Drag & drop or click to upload"
                    />
                  )}
                </div>

                {/* Secondary Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Secondary Photo (Back of Card - Optional)
                  </label>
                  {formData.secondPhotoURL ? (
                    <div className="space-y-3">
                      <div className="relative group">
                        <div className="h-80 bg-slate-900 rounded-lg overflow-hidden">
                          <img 
                            src={formData.secondPhotoURL} 
                            alt="Secondary" 
                            className={`w-full h-full object-cover ${getObjectPosition(formData.secondPhotoPosition)}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, secondPhotoURL: '', secondPhotoPosition: 'center' }))}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                          <Move className="w-3 h-3" />
                          Photo Position
                        </label>
                        <div className="flex gap-2">
                          {positionOptions.map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, secondPhotoPosition: option.value }))}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                formData.secondPhotoPosition === option.value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <DropZone
                      onDrop={(e) => handleDrop(e, 'secondary')}
                      onFileSelect={(e) => handleFileSelect(e, 'secondary')}
                      label="Drag & drop or click to upload"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Photos */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                Photo Gallery (Optional)
              </h4>
              
              <DropZone
                onDrop={(e) => handleDrop(e, 'gallery')}
                onFileSelect={(e) => handleFileSelect(e, 'gallery')}
                label="Drag & drop multiple photos or click to upload"
                multiple={true}
              />

              {uploadingPhotos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadingPhotos.map((upload) => (
                    <div key={upload.id} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700 font-medium truncate">{upload.name}</span>
                        <span className="text-sm text-gray-500">{Math.round(upload.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${upload.progress}%` }}
                        />
                    </div>
                    </div>
                  ))}
                </div>
              )}

              {galleryPhotos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img 
                        src={photo.url} 
                        alt="Gallery" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryPhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        placeholder="Add caption..."
                        value={photo.caption}
                        onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                        className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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

            <div className="flex gap-3 pt-4">
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
                  <button 
                    onClick={() => handleDelete(inductee)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete inductee"
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

export default ManageInductees;