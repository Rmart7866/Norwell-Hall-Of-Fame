// src/components/admin/ManageHomeBanner.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { Image, Save, AlertCircle, CheckCircle } from 'lucide-react';

const ManageHomeBanner = () => {
  const [bannerData, setBannerData] = useState({
    title: '',
    description: '',
    imageURL: '',
    enabled: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pages', 'home-banner');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setBannerData(docSnap.data());
        setImagePreview(docSnap.data().imageURL);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banner data:', error);
      showMessage('error', 'Error loading banner data');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return bannerData.imageURL;

    setUploading(true);
    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `home-banner/banner-${timestamp}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let imageURL = bannerData.imageURL;
      
      if (imageFile) {
        imageURL = await uploadImage();
      }

      const dataToSave = {
        ...bannerData,
        imageURL,
        updatedAt: new Date().toISOString()
      };

      const docRef = doc(db, 'pages', 'home-banner');
      await setDoc(docRef, dataToSave);
      
      setBannerData(dataToSave);
      setImageFile(null);
      showMessage('success', 'Banner updated successfully!');
      setSaving(false);
    } catch (error) {
      console.error('Error saving banner:', error);
      showMessage('error', 'Error saving banner');
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
        <p className="mt-4 text-gray-600">Loading banner data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-norwell-blue mb-2">Manage Home Banner</h2>
        <p className="text-gray-600">Configure the promotional banner that appears on the home page</p>
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
        {/* Enable/Disable Toggle */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={bannerData.enabled}
              onChange={(e) => setBannerData({ ...bannerData, enabled: e.target.checked })}
              className="w-5 h-5 text-norwell-blue rounded focus:ring-2 focus:ring-norwell-blue"
            />
            <div>
              <span className="text-lg font-semibold text-gray-900">Enable Banner</span>
              <p className="text-sm text-gray-600">Show this banner section on the home page</p>
            </div>
          </label>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Banner Title
          </label>
          <input
            type="text"
            value={bannerData.title}
            onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
            placeholder="Enter banner title..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Banner Description
          </label>
          <textarea
            value={bannerData.description}
            onChange={(e) => setBannerData({ ...bannerData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
            placeholder="Enter banner description..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Banner Image
          </label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-norwell-blue file:text-white hover:file:bg-blue-700"
            />
            
            {imagePreview && (
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Banner preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                  Preview
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {bannerData.enabled && (bannerData.title || bannerData.description || imagePreview) && (
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl overflow-hidden shadow-2xl">
              {/* Banner Image */}
              {imagePreview && (
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                </div>
              )}
              
              {/* Content Overlay */}
              {(bannerData.title || bannerData.description) && (
                <div className={`${imagePreview ? 'absolute inset-0' : 'relative py-20'} flex items-center`}>
                  <div className="container mx-auto px-8">
                    <div className="max-w-3xl">
                      {bannerData.title && (
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                          {bannerData.title}
                        </h2>
                      )}
                      {bannerData.description && (
                        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-lg">
                          {bannerData.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                {uploading ? 'Uploading Image...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Banner
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-600">
            Changes will appear immediately on the home page
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageHomeBanner;
