// src/components/admin/ManageClassImages.jsx
import { useState, useEffect } from 'react';
import { getAllClasses } from '../../firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { Image as ImageIcon, Upload, Trash2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

const ManageClassImages = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Track which class is being edited
  const [editingClassId, setEditingClassId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await getAllClasses();
    if (!error && data) {
      setClasses(data);
    } else if (error) {
      showMessage('error', `Failed to load classes: ${error}`);
    }
    setLoading(false);
  };

  const handleFileSelect = (e, classId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image must be less than 5MB');
      return;
    }

    setEditingClassId(classId);
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    showMessage('', '');
  };

  const uploadImage = async (file, year) => {
    const timestamp = Date.now();
    const fileName = `class-images/${year}-${timestamp}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const deleteImage = async (imageURL) => {
    if (!imageURL) return;
    
    try {
      const filePathMatch = imageURL.match(/class-images%2F[^?]+/);
      if (filePathMatch) {
        const filePath = decodeURIComponent(filePathMatch[0]);
        const imageRef = ref(storage, filePath);
        await deleteObject(imageRef);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      // Don't throw - continue even if deletion fails
    }
  };

  const handleSaveImage = async (classItem) => {
    if (!selectedFile) {
      showMessage('error', 'Please select an image first');
      return;
    }

    setUploading(true);
    showMessage('', '');

    try {
      // Upload new image
      const imageURL = await uploadImage(selectedFile, classItem.year);
      
      // Delete old image if exists
      if (classItem.imageURL) {
        await deleteImage(classItem.imageURL);
      }

      // Update Firestore
      const docRef = doc(db, 'classes', classItem.id);
      await updateDoc(docRef, { imageURL });

      // Update local state
      setClasses(classes.map(c => 
        c.id === classItem.id ? { ...c, imageURL } : c
      ));

      showMessage('success', 'Image uploaded successfully!');
      cancelEdit();
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', `Failed to upload image: ${error.message}`);
    }

    setUploading(false);
  };

  const handleRemoveImage = async (classItem) => {
    if (!window.confirm(`Remove image for ${classItem.year} class?`)) {
      return;
    }

    setUploading(true);
    showMessage('', '');

    try {
      // Delete from storage
      if (classItem.imageURL) {
        await deleteImage(classItem.imageURL);
      }

      // Update Firestore
      const docRef = doc(db, 'classes', classItem.id);
      await updateDoc(docRef, { imageURL: null });

      // Update local state
      setClasses(classes.map(c => 
        c.id === classItem.id ? { ...c, imageURL: null } : c
      ));

      showMessage('success', 'Image removed successfully!');
      cancelEdit();
    } catch (error) {
      console.error('Error removing image:', error);
      showMessage('error', `Failed to remove image: ${error.message}`);
    }

    setUploading(false);
  };

  const cancelEdit = () => {
    setEditingClassId(null);
    setSelectedFile(null);
    setPreviewURL(null);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    if (text) {
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-norwell-blue"></div>
        <p className="mt-4 text-gray-600">Loading classes...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-norwell-blue mb-2">Manage Class Images</h2>
        <p className="text-gray-600">Add or update images for Hall of Fame induction classes</p>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => {
          const isEditing = editingClassId === classItem.id;
          const displayImage = isEditing && previewURL ? previewURL : classItem.imageURL;

          return (
            <div
              key={classItem.id}
              className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${
                isEditing ? 'border-norwell-blue shadow-lg' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Image Area */}
              <div className="relative h-48 bg-gray-100">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={`Class of ${classItem.year}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mb-2" />
                    <p className="text-sm">No image</p>
                  </div>
                )}

                {/* Preview Badge */}
                {isEditing && previewURL && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                    Preview
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Class of {classItem.year}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {classItem.inducteeCount || 0} Inductees
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveImage(classItem)}
                        disabled={uploading || !selectedFile}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={uploading}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {classItem.imageURL && (
                      <button
                        onClick={() => handleRemoveImage(classItem)}
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Current Image
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, classItem.id)}
                        className="hidden"
                        id={`file-${classItem.id}`}
                      />
                      <div className="flex items-center justify-center gap-2 bg-norwell-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        {classItem.imageURL ? 'Change Image' : 'Add Image'}
                      </div>
                    </label>

                    {classItem.imageURL && (
                      <button
                        onClick={() => handleRemoveImage(classItem)}
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Image
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">No classes found</p>
          <p className="text-gray-500 text-sm mt-2">Create classes first in "Manage Classes"</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Images should be landscape-oriented and at least 1200x600px for best results. 
          Supported formats: JPG, PNG up to 5MB.
        </p>
      </div>
    </div>
  );
};

export default ManageClassImages;
