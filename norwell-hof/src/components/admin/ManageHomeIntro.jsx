// src/components/admin/ManageHomeIntro.jsx
//
// Edits the intro block that sits directly under the hero image on the home
// page, above Latest Inductees. Stored at pages/home-intro, the same shape and
// the same setDoc pattern as ManageHomeBanner so the two behave identically.
//
// Separate from pages/home-content on purpose: that document is the nominations
// call to action at the BOTTOM of the page and has its own button fields. This
// one is a title, a few paragraphs and an optional photo.
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

const ManageHomeIntro = () => {
  const [introData, setIntroData] = useState({
    title: '',
    body: '',
    imageURL: '',
    imageSide: 'right',
    imagePosition: 'center',
    imageCaption: '',
    enabled: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchIntroData();
  }, []);

  const fetchIntroData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pages', 'home-intro');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Spread over the defaults rather than replacing them, so a document
        // saved before a field existed does not leave that field undefined and
        // turn its input into an uncontrolled one.
        setIntroData((prev) => ({ ...prev, ...docSnap.data() }));
        setImagePreview(docSnap.data().imageURL || null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home intro:', error);
      showMessage('error', 'Error loading the intro section');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'That image is over 5MB. Please use a smaller file.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return introData.imageURL;
    setUploading(true);
    try {
      const storageRef = ref(storage, `home-intro/intro-${Date.now()}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      setUploading(false);
      return downloadURL;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const imageURL = imageFile ? await uploadImage() : introData.imageURL;
      const dataToSave = { ...introData, imageURL, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'pages', 'home-intro'), dataToSave);
      setIntroData(dataToSave);
      setImageFile(null);
      showMessage('success', 'Intro section updated.');
      setSaving(false);
    } catch (error) {
      console.error('Error saving home intro:', error);
      showMessage('error', 'Error saving the intro section');
      setSaving(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setIntroData({ ...introData, imageURL: '' });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Blank lines separate paragraphs, matching how the About page stores its
  // history section as an array of paragraphs.
  const paragraphs = String(introData.body || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-norwell-blue"></div>
        <p className="mt-4 text-gray-600">Loading intro section...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-norwell-blue mb-2">Manage Home Intro</h2>
        <p className="text-gray-600">
          The welcome block directly under the main banner image, above Latest Inductees.
        </p>
      </div>

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

      <div className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={introData.enabled}
              onChange={(e) => setIntroData({ ...introData, enabled: e.target.checked })}
              className="w-5 h-5 text-norwell-blue rounded focus:ring-2 focus:ring-norwell-blue"
            />
            <div>
              <span className="text-lg font-semibold text-gray-900">Show this section</span>
              <p className="text-sm text-gray-600">Turn off to hide it without losing what you wrote</p>
            </div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Heading</label>
          <input
            type="text"
            value={introData.title}
            onChange={(e) => setIntroData({ ...introData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
            placeholder="Welcome to the Clipper Hall of Fame"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraph</label>
          <textarea
            value={introData.body}
            onChange={(e) => setIntroData({ ...introData, body: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
            placeholder="Write a paragraph here. Leave a blank line between paragraphs to start a new one."
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave a blank line between paragraphs. {paragraphs.length > 0
              ? `${paragraphs.length} paragraph${paragraphs.length === 1 ? '' : 's'} will show.`
              : 'Nothing written yet.'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-norwell-blue file:text-white hover:file:bg-blue-700"
          />
          {imagePreview && (
            <div className="mt-4 relative border-2 border-gray-300 rounded-lg overflow-hidden">
              <img src={imagePreview} alt="Intro preview" className="w-full h-64 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-700"
              >
                Remove photo
              </button>
            </div>
          )}
        </div>

        {imagePreview && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Photo side</label>
              <select
                value={introData.imageSide}
                onChange={(e) => setIntroData({ ...introData, imageSide: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              >
                <option value="right">Right of the text</option>
                <option value="left">Left of the text</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Crop</label>
              <select
                value={introData.imagePosition}
                onChange={(e) => setIntroData({ ...introData, imagePosition: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
              >
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Caption</label>
              <input
                type="text"
                value={introData.imageCaption}
                onChange={(e) => setIntroData({ ...introData, imageCaption: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                placeholder="Optional"
              />
            </div>
          </div>
        )}

        {introData.enabled && (introData.title || paragraphs.length > 0 || imagePreview) && (
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl p-8 md:p-12">
              <div className={`flex flex-col gap-8 items-center ${
                imagePreview ? (introData.imageSide === 'left' ? 'md:flex-row-reverse' : 'md:flex-row') : ''
              }`}>
                <div className={imagePreview ? 'md:w-3/5' : 'max-w-3xl mx-auto text-center'}>
                  {introData.title && (
                    <>
                      <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        {introData.title}
                      </h2>
                      <div className={`h-1 w-32 bg-gradient-to-r from-yellow-400 to-transparent mb-6 ${imagePreview ? '' : 'mx-auto'}`}></div>
                    </>
                  )}
                  {paragraphs.map((text, i) => (
                    <p key={i} className="text-lg text-gray-200 leading-relaxed mb-4 last:mb-0">{text}</p>
                  ))}
                </div>
                {imagePreview && (
                  <div className="md:w-2/5 w-full">
                    <div className="border-4 border-yellow-400/70 rounded-lg overflow-hidden shadow-2xl">
                      <img src={imagePreview} alt={introData.imageCaption || ''} className="w-full h-72 object-cover" />
                    </div>
                    {introData.imageCaption && (
                      <p className="text-sm text-gray-400 mt-2 text-center italic">{introData.imageCaption}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-norwell-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving || uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                {uploading ? 'Uploading photo...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Intro
              </>
            )}
          </button>
          <p className="text-sm text-gray-600">Changes appear immediately on the home page</p>
        </div>
      </div>
    </div>
  );
};

export default ManageHomeIntro;
