// src/components/admin/ManageHomeContent.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Save, Eye, EyeOff, Plus, Trash2, Edit3 } from 'lucide-react';

const ManageHomeContent = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [pageData, setPageData] = useState({
    enabled: true,
    nominationsSection: {
      title: 'Nominate a Future Legend',
      subtitle: 'Know someone who deserves to be in the Hall of Fame?',
      description: 'Nominations are accepted annually for athletes, coaches, teams, and contributors who have made outstanding contributions to Norwell High School athletics.',
      buttonText: 'Learn About Nominations',
      buttonLink: '/about'
    },
    statsSection: {
      enabled: true,
      stats: [
        { label: 'Years of Excellence', value: '50+', icon: 'trophy' },
        { label: 'Hall of Fame Inductees', value: '100+', icon: 'users' },
        { label: 'State Championships', value: '25+', icon: 'award' }
      ]
    },
    ctaSection: {
      title: 'Explore the Hall of Fame',
      description: 'Discover the legendary athletes, coaches, and teams that have shaped Norwell athletics.',
      buttons: [
        { text: 'View All Inductees', link: '/inductees', style: 'primary' },
        { text: 'Championships', link: '/championships', style: 'secondary' }
      ]
    }
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
      
      setMessage({ type: 'success', text: 'Home content updated successfully!' });
      setSaving(false);
    } catch (error) {
      console.error('Error saving page data:', error);
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
      setSaving(false);
    }
  };

  const updateStat = (index, field, value) => {
    const newStats = [...pageData.statsSection.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setPageData({
      ...pageData,
      statsSection: {
        ...pageData.statsSection,
        stats: newStats
      }
    });
  };

  const addStat = () => {
    setPageData({
      ...pageData,
      statsSection: {
        ...pageData.statsSection,
        stats: [...pageData.statsSection.stats, { label: '', value: '', icon: 'trophy' }]
      }
    });
  };

  const removeStat = (index) => {
    const newStats = pageData.statsSection.stats.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      statsSection: {
        ...pageData.statsSection,
        stats: newStats
      }
    });
  };

  const updateButton = (index, field, value) => {
    const newButtons = [...pageData.ctaSection.buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setPageData({
      ...pageData,
      ctaSection: {
        ...pageData.ctaSection,
        buttons: newButtons
      }
    });
  };

  const addButton = () => {
    setPageData({
      ...pageData,
      ctaSection: {
        ...pageData.ctaSection,
        buttons: [...pageData.ctaSection.buttons, { text: '', link: '', style: 'primary' }]
      }
    });
  };

  const removeButton = (index) => {
    const newButtons = pageData.ctaSection.buttons.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      ctaSection: {
        ...pageData.ctaSection,
        buttons: newButtons
      }
    });
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
          <h2 className="text-3xl font-bold text-norwell-blue">Manage Home Page Content</h2>
          <p className="text-gray-600 mt-1">Edit the bottom sections of the home page</p>
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
        <div className="space-y-8">
          {/* Nominations Section Preview */}
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">
                {pageData.nominationsSection.title}
              </h2>
              <p className="text-2xl text-slate-800 mb-4">
                {pageData.nominationsSection.subtitle}
              </p>
              <p className="text-xl text-slate-800 mb-8">
                {pageData.nominationsSection.description}
              </p>
              <button className="bg-slate-900 text-yellow-400 px-8 py-3 rounded-lg font-bold text-lg">
                {pageData.nominationsSection.buttonText}
              </button>
            </div>
          </div>

          {/* Stats Section Preview */}
          {pageData.statsSection.enabled && (
            <div className="bg-slate-800 rounded-xl p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pageData.statsSection.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-5xl font-black text-yellow-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xl text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section Preview */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-4 text-white">
                {pageData.ctaSection.title}
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                {pageData.ctaSection.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {pageData.ctaSection.buttons.map((button, index) => (
                  <button
                    key={index}
                    className={`px-8 py-3 rounded-lg font-bold text-lg ${
                      button.style === 'primary'
                        ? 'bg-yellow-400 text-slate-900'
                        : 'bg-white text-slate-900'
                    }`}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT MODE */
        <div className="space-y-8">
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
                <span className="text-lg font-semibold text-gray-900">Enable Bottom Content Sections</span>
                <p className="text-sm text-gray-600">Show these sections at the bottom of the home page</p>
              </div>
            </label>
          </div>

          {/* Nominations Section Editor */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Edit3 className="w-6 h-6 text-norwell-blue" />
              <h3 className="text-xl font-bold text-gray-800">Nominations Section</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={pageData.nominationsSection.title}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      nominationsSection: { ...pageData.nominationsSection, title: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={pageData.nominationsSection.subtitle}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      nominationsSection: { ...pageData.nominationsSection, subtitle: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={pageData.nominationsSection.description}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      nominationsSection: { ...pageData.nominationsSection, description: e.target.value }
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={pageData.nominationsSection.buttonText}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        nominationsSection: { ...pageData.nominationsSection, buttonText: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    value={pageData.nominationsSection.buttonLink}
                    onChange={(e) =>
                      setPageData({
                        ...pageData,
                        nominationsSection: { ...pageData.nominationsSection, buttonLink: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section Editor */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-norwell-blue" />
                <h3 className="text-xl font-bold text-gray-800">Stats Section</h3>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.statsSection.enabled}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      statsSection: { ...pageData.statsSection, enabled: e.target.checked }
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Enable Stats</span>
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Statistics</label>
                <button
                  onClick={addStat}
                  className="flex items-center gap-1 text-norwell-blue text-sm font-semibold hover:text-blue-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Stat
                </button>
              </div>

              {pageData.statsSection.stats.map((stat, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        placeholder="Value (e.g., 50+)"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        placeholder="Label"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => removeStat(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Remove stat"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section Editor */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Edit3 className="w-6 h-6 text-norwell-blue" />
              <h3 className="text-xl font-bold text-gray-800">Call to Action Section</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={pageData.ctaSection.title}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      ctaSection: { ...pageData.ctaSection, title: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={pageData.ctaSection.description}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      ctaSection: { ...pageData.ctaSection, description: e.target.value }
                    })
                  }
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Buttons</label>
                  <button
                    onClick={addButton}
                    className="flex items-center gap-1 text-norwell-blue text-sm font-semibold hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Button
                  </button>
                </div>

                {pageData.ctaSection.buttons.map((button, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={button.text}
                          onChange={(e) => updateButton(index, 'text', e.target.value)}
                          placeholder="Button Text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={button.link}
                            onChange={(e) => updateButton(index, 'link', e.target.value)}
                            placeholder="Link (e.g., /inductees)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                          />
                          <select
                            value={button.style}
                            onChange={(e) => updateButton(index, 'style', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                          >
                            <option value="primary">Primary (Yellow)</option>
                            <option value="secondary">Secondary (White)</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => removeButton(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                        title="Remove button"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!preview && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Use the Preview button to see how your changes will look on the home page before saving.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageHomeContent;
