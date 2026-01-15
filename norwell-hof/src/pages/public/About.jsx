// src/pages/public/About.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Award } from 'lucide-react';

const About = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default content (fallback if Firestore data doesn't exist yet)
  const defaultData = {
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
  };

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'pages', 'about');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPageData(docSnap.data());
        } else {
          // Use default data if no custom data exists
          setPageData(defaultData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page data:', error);
        // Fallback to default data on error
        setPageData(defaultData);
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-xl text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-12 shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
              
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-slate-600 pb-4">
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
          </div>
        </div>
      </section>

      {/* Committee Members Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-12 shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
              
              <h3 className="text-3xl font-bold text-white mb-6 border-b border-slate-600 pb-4">
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
                      <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <div>
                        <span className="text-white font-semibold text-lg">{member.name}</span>
                        {member.role && (
                          <span className="text-yellow-400 text-sm ml-2 font-medium">({member.role})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-12 shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
              
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-slate-600 pb-4">
                {pageData.faqSection.title}
              </h2>

              <div className="space-y-8">
                {pageData.faqSection.questions.map((faq, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-bold text-yellow-400 mb-3">
                      Q. {faq.question}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      A. {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-900 border-t-2 border-yellow-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Explore the Hall of Fame
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Browse our inductees and learn about the outstanding athletes and contributors who have shaped Norwell athletics.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/inductees"
              className="inline-block bg-yellow-400 text-slate-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              View Inductees
            </a>
            <a
              href="/athletes"
              className="inline-block bg-slate-800 text-yellow-400 border-2 border-yellow-400 px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Browse by Graduation Year
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
