// src/components/admin/ManageAboutPage.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Save, Eye, EyeOff, Plus, Trash2, Edit3 } from 'lucide-react';

const ManageAboutPage = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [pageData, setPageData] = useState({
    historySection: {
      title: 'Hall of Fame Committee',
      paragraphs: [
        'In November 2010, the first class was inducted into the Norwell High School Athletic Hall of Fame. Every two years, we add to the great tradition and induct a new class to the Hall of Fame.',
        'Our committee is comprised of former and present Norwell High School student-athletes, coaches, parents, faculty, and fans and supporters of Clipper athletics. We have all seen first hand the value of high school athletics to both the student-athletes themselves, and to our community as a whole.',
        'It is our pleasure to honor these men and women and to welcome them to the Norwell High School Athletic Hall of Fame.'
      ],
      highlightLastParagraph: true
    },
    committeeSection: {
      title: 'Committee Members',
      introText: 'The Norwell High School Athletic Hall of Fame Committee welcomes Norwell Athletic Director JJ Niamkey to the team. The remaining committee members include:',
      members: [
        { name: 'Marybeth Shea', role: 'Chair' },
        { name: 'Dan Carlton', role: '' },
        { name: 'Leann Cavicchi', role: '' },
        { name: 'Kathy Dwyer', role: '' },
        { name: 'Ron Ghilardi', role: '' },
        { name: 'Chris Glynn', role: '' },
        { name: 'Chuck Martin', role: '' },
        { name: 'Dave Marsden', role: '' },
        { name: 'Jenn Schad', role: '' },
        { name: 'Jay Swartz', role: '' },
        { name: 'Peter Hajjar', role: '' }
      ]
    },
    faqSection: {
      title: 'Frequently Asked Questions',
      questions: [
        {
          question: 'I filled out the application. Do I need to do more?',
          answer: 'Yes. In order to insure the most comprehensive review of your nominee please include as much supporting documentation that you can. This can include school records, newspaper articles, recommendations from coaches, etc. This information allows the Hall of Fame board to truly understand the level of accomplishment achieved by your nominee. When submitting this information please send copies only.'
        },
        {
          question: 'I can think of a few athletes who deserve consideration but I haven\'t seen them as entrants. Why haven\'t they been considered?',
          answer: 'They likely have not been nominated. The Hall of Fame Board only reviews and votes upon individuals or teams that have been nominated for consideration. If you would like us to consider a candidate, please submit an application!'
        },
        {
          question: 'Does the Norwell Hall of Fame only consist of individual athletes?',
          answer: 'No. The Hall of Fame currently consists of athletes, coaches, and friends of Norwell High School athletics. We inducted an entire team (1972 football team) in the 2012 class!'
        },
        {
          question: 'Who can nominate someone?',
          answer: 'Anyone can nominate an athlete, coach, team or friend of Norwell Athletics. The nominator should include as much information as possible so their candidate gets a thorough review.'
        },
        {
          question: 'How long are applications active?',
          answer: 'The committee reviews applications every 2 years and applications remain eligible for consideration for 5 cycles (10 years.)'
        },
        {
          question: 'When are applications accepted and when are inductees notified?',
          answer: 'Applications are accepted anytime with a cut-off in the spring of the current induction year. Inductees are notified as soon as decisions are made – in the spring of the induction year.'
        }
      ]
    }
  });

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pages', 'about');
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
      const docRef = doc(db, 'pages', 'about');
      await setDoc(docRef, pageData);
      
      setMessage({ type: 'success', text: 'About page updated successfully!' });
      setSaving(false);
    } catch (error) {
      console.error('Error saving page data:', error);
      setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
      setSaving(false);
    }
  };

  const updateHistoryParagraph = (index, value) => {
    const newParagraphs = [...pageData.historySection.paragraphs];
    newParagraphs[index] = value;
    setPageData({
      ...pageData,
      historySection: {
        ...pageData.historySection,
        paragraphs: newParagraphs
      }
    });
  };

  const addHistoryParagraph = () => {
    setPageData({
      ...pageData,
      historySection: {
        ...pageData.historySection,
        paragraphs: [...pageData.historySection.paragraphs, '']
      }
    });
  };

  const removeHistoryParagraph = (index) => {
    const newParagraphs = pageData.historySection.paragraphs.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      historySection: {
        ...pageData.historySection,
        paragraphs: newParagraphs
      }
    });
  };

  const updateCommitteeMember = (index, field, value) => {
    const newMembers = [...pageData.committeeSection.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setPageData({
      ...pageData,
      committeeSection: {
        ...pageData.committeeSection,
        members: newMembers
      }
    });
  };

  const addCommitteeMember = () => {
    setPageData({
      ...pageData,
      committeeSection: {
        ...pageData.committeeSection,
        members: [...pageData.committeeSection.members, { name: '', role: '' }]
      }
    });
  };

  const removeCommitteeMember = (index) => {
    const newMembers = pageData.committeeSection.members.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      committeeSection: {
        ...pageData.committeeSection,
        members: newMembers
      }
    });
  };

  const updateFAQ = (index, field, value) => {
    const newQuestions = [...pageData.faqSection.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setPageData({
      ...pageData,
      faqSection: {
        ...pageData.faqSection,
        questions: newQuestions
      }
    });
  };

  const addFAQ = () => {
    setPageData({
      ...pageData,
      faqSection: {
        ...pageData.faqSection,
        questions: [...pageData.faqSection.questions, { question: '', answer: '' }]
      }
    });
  };

  const removeFAQ = (index) => {
    const newQuestions = pageData.faqSection.questions.filter((_, i) => i !== index);
    setPageData({
      ...pageData,
      faqSection: {
        ...pageData.faqSection,
        questions: newQuestions
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
          <h2 className="text-3xl font-bold text-norwell-blue">Manage About Page</h2>
          <p className="text-gray-600 mt-1">Edit the content displayed on the About page</p>
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
          {/* History Section Preview */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-slate-600 pb-4">
              {pageData.historySection.title}
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              {pageData.historySection.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    pageData.historySection.highlightLastParagraph &&
                    index === pageData.historySection.paragraphs.length - 1
                      ? 'text-white font-semibold text-xl pt-4'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Committee Section Preview */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-600 pb-4">
              {pageData.committeeSection.title}
            </h3>
            <div className="mb-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                {pageData.committeeSection.introText}
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {pageData.committeeSection.members.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <span className="text-white font-semibold text-lg">{member.name}</span>
                    {member.role && (
                      <span className="text-yellow-400 text-sm ml-2 font-medium">({member.role})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section Preview */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8 border-b border-slate-600 pb-4">
              {pageData.faqSection.title}
            </h2>
            <div className="space-y-8">
              {pageData.faqSection.questions.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">
                    Q. {faq.question}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">A. {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* EDIT MODE */
        <div className="space-y-8">
          {/* History Section Editor */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-norwell-blue" />
                <h3 className="text-xl font-bold text-gray-800">History Section</h3>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={pageData.historySection.title}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      historySection: { ...pageData.historySection, title: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Paragraphs
                  </label>
                  <button
                    onClick={addHistoryParagraph}
                    className="flex items-center gap-1 text-norwell-blue text-sm font-semibold hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Paragraph
                  </button>
                </div>

                {pageData.historySection.paragraphs.map((paragraph, index) => (
                  <div key={index} className="mb-3 relative">
                    <textarea
                      value={paragraph}
                      onChange={(e) => updateHistoryParagraph(index, e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                      placeholder={`Paragraph ${index + 1}`}
                    />
                    {pageData.historySection.paragraphs.length > 1 && (
                      <button
                        onClick={() => removeHistoryParagraph(index)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                        title="Remove paragraph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlightLast"
                  checked={pageData.historySection.highlightLastParagraph}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      historySection: {
                        ...pageData.historySection,
                        highlightLastParagraph: e.target.checked
                      }
                    })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="highlightLast" className="text-sm text-gray-700">
                  Highlight last paragraph (larger, bold text)
                </label>
              </div>
            </div>
          </div>

          {/* Committee Section Editor */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-norwell-blue" />
                <h3 className="text-xl font-bold text-gray-800">Committee Section</h3>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={pageData.committeeSection.title}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      committeeSection: { ...pageData.committeeSection, title: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Introduction Text
                </label>
                <textarea
                  value={pageData.committeeSection.introText}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      committeeSection: { ...pageData.committeeSection, introText: e.target.value }
                    })
                  }
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Committee Members
                  </label>
                  <button
                    onClick={addCommitteeMember}
                    className="flex items-center gap-1 text-norwell-blue text-sm font-semibold hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>

                {pageData.committeeSection.members.map((member, index) => (
                  <div key={index} className="mb-3 bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateCommitteeMember(index, 'name', e.target.value)}
                          placeholder="Member Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent mb-2"
                        />
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateCommitteeMember(index, 'role', e.target.value)}
                          placeholder="Role (optional, e.g., Chair)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={() => removeCommitteeMember(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                        title="Remove member"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section Editor */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-norwell-blue" />
                <h3 className="text-xl font-bold text-gray-800">FAQ Section</h3>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={pageData.faqSection.title}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      faqSection: { ...pageData.faqSection, title: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Questions & Answers
                  </label>
                  <button
                    onClick={addFAQ}
                    className="flex items-center gap-1 text-norwell-blue text-sm font-semibold hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add FAQ
                  </button>
                </div>

                {pageData.faqSection.questions.map((faq, index) => (
                  <div key={index} className="mb-4 bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-3 items-start">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Question
                          </label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                            placeholder="Enter question"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Answer
                          </label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                            placeholder="Enter answer"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-norwell-blue focus:border-transparent"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeFAQ(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                        title="Remove FAQ"
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
            <strong>💡 Tip:</strong> Use the Preview button to see how your changes will look on the public About page before saving.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageAboutPage;
