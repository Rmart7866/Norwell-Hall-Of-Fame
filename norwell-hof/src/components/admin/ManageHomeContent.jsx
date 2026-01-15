// src/components/admin/ManageHomeContent.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Save, Eye, EyeOff } from 'lucide-react';

const ManageHomeContent = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [pageData, setPageData] = useState({
    enabled: true,
    title: 'Nominate a Future Legend',
    subtitle: 'Know someone who deserves to be in the Hall of Fame?',
    description: 'Nominations are accepted annually for athletes, coaches, teams, and contributors who have made outstanding contributions to Norwell High School athletics.',
    buttonText: 'Learn About Nominations',
    buttonLink: '/about'
  });

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pages', 'home-content');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPageData(docSnap.data());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching page data:', error);
      setMessage({ type: 'error', text: 'Failed to load page data' });
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = doc(db, 'pages', 'home-content');
      await setDoc(docRef, pageData);
      
      setMessage({ type: 'success', text: 'Nominations section updated successfully!' });
      setSaving(false);
    } catch (error) {
      console.error('Error saving page data:', error);
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-norwell-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-norwell-blue">Manage Nominations Section</h2>
          <p className="text-gray-600 mt-1">Edit the nominations call-to-action at the bottom of the home page</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            {preview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {preview ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || preview}
            className="flex items-center gap-2 bg-norwell-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
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

      {preview ? (
        /* PREVIEW MODE */
        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              {pageData.title}
            </h2>
            <p className="text-2xl text-slate-800 mb-4">
              {pageData.subtitle}
            </p>
            <p className="text-xl text-slate-800 mb-8">
              {pageData.description}
            </p>
            <button className="bg-slate-900 text-yellow-400 px-8 py-3 rounded-lg font-bold text-lg">
              {pageData.buttonText}
            </button>
          </div>
        </div>
      ) : (
        /* EDIT MODE */
        <div className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pageData.enabled}
                onChange={(e) => setPageData({ ...pageData, enabled: e.target.checked })}
                className="w-5 h-5 text-norwell-blue rounded focus:ring-2 focus:ring-norwell-blue"
              />
              <div>
                <span className="text-lg font-semibold text-gray-900">Enable Nominations Section</span>
                <p className="text-sm text-gray-600">Show this section at the bottom of the home page</p>
              </div>
            </label>
          </div>

          {/* Nominations Section Editor */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Section Content</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={pageData.title}
                  onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                  placeholder="e.g., Nominate a Future Legend"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={pageData.subtitle}
                  onChange={(e) => setPageData({ ...pageData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                  placeholder="e.g., Know someone who deserves to be in the Hall of Fame?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={pageData.description}
                  onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                  placeholder="Provide details about the nominations process..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={pageData.buttonText}
                    onChange={(e) => setPageData({ ...pageData, buttonText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                    placeholder="e.g., Learn About Nominations"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    value={pageData.buttonLink}
                    onChange={(e) => setPageData({ ...pageData, buttonLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                    placeholder="e.g., /about or /nominations"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!preview && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Use the Preview button to see how your changes will look before saving. This section appears at the very bottom of the home page.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageHomeContent;
