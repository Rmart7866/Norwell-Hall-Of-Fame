// src/components/admin/PhotoUploader.jsx
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { Upload, X, CheckCircle, AlertCircle, Image } from 'lucide-react';

const PhotoUploader = ({ onUploadComplete, folder = 'photos' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${selectedFile.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${filename}`);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(prog);
        },
        (error) => {
          console.error('Upload error:', error);
          setError(`Upload failed: ${error.message}`);
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setSuccess('Upload successful!');
          setUploading(false);
          setProgress(100);
          
          // Call the callback with the URL
          if (onUploadComplete) {
            onUploadComplete(downloadURL);
          }

          // Reset after 2 seconds
          setTimeout(() => {
            setSelectedFile(null);
            setPreviewURL('');
            setProgress(0);
            setSuccess('');
          }, 2000);
        }
      );
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message}`);
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewURL('');
    setError('');
    setSuccess('');
    setProgress(0);
  };

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="w-6 h-6 text-norwell-blue" />
        Upload Photo
      </h3>

      {/* File Input */}
      {!selectedFile && (
        <div className="mb-4">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-norwell-blue transition-colors cursor-pointer">
              <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">Click to select an image</p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </label>
        </div>
      )}

      {/* Preview */}
      {selectedFile && previewURL && (
        <div className="mb-4">
          <div className="relative">
            <img
              src={previewURL}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            {!uploading && (
              <button
                onClick={clearSelection}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">{selectedFile.name}</p>
          <p className="text-xs text-gray-500">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploading && !success && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-norwell-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Photo
        </button>
      )}

      <p className="text-xs text-gray-500 mt-4">
        💡 Tip: After uploading, copy the URL and paste it into your form
      </p>
    </div>
  );
};

export default PhotoUploader;