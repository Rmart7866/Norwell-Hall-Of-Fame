// src/pages/public/About.jsx
import { Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-12 shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
              
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-slate-600 pb-4">
                Hall of Fame Committee
              </h2>

              <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
                <p>
                  In November 2010, the first class was inducted into the Norwell High School Athletic Hall of Fame. Every two years, we add to the great tradition and induct a new class to the Hall of Fame.
                </p>
                
                <p>
                  Our committee is comprised of former and present Norwell High School student-athletes, coaches, parents, faculty, and fans and supporters of Clipper athletics. We have all seen first hand the value of high school athletics to both the student-athletes themselves, and to our community as a whole.
                </p>

                <p className="text-white font-semibold text-xl pt-4">
                  It is our pleasure to honor these men and women and to welcome them to the Norwell High School Athletic Hall of Fame.
                </p>
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
                Committee Members
              </h3>

              <div className="mb-8">
                <p className="text-gray-300 text-lg leading-relaxed">
                  The Norwell High School Athletic Hall of Fame Committee welcomes Norwell Athletic Director JJ Niamkey to the team. The remaining committee members include:
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { name: 'Marybeth Shea', role: 'Chair' },
                    { name: 'Dan Carlton', role: null },
                    { name: 'Leann Cavicchi', role: null },
                    { name: 'Kathy Dwyer', role: null },
                    { name: 'Ron Ghilardi', role: null },
                    { name: 'Chris Glynn', role: null },
                    { name: 'Chuck Martin', role: null },
                    { name: 'Dave Marsden', role: null },
                    { name: 'Jenn Schad', role: null },
                    { name: 'Jay Swartz', role: null },
                    { name: 'Peter Hajjar', role: null }
                  ].map((member, index) => (
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
                Frequently Asked Questions
              </h2>

              <div className="space-y-8">
                {/* FAQ 1 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">
                    Q. I filled out the application. Do I need to do more?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    A. Yes. In order to insure the most comprehensive review of your nominee please include as much supporting documentation that you can. This can include school records, newspaper articles, recommendations from coaches, etc. This information allows the Hall of Fame board to truly understand the level of accomplishment achieved by your nominee. When submitting this information please send copies only.
                  </p>
                </div>

                {/* FAQ 2 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">
                    Q. I can think of a few athletes who deserve consideration but I haven't seen them as entrants. Why haven't they been considered?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    A. They likely have not been nominated. The Hall of Fame Board only reviews and votes upon individuals or teams that have been nominated for consideration. If you would like us to consider a candidate, please submit an application!
                  </p>
                </div>

                {/* FAQ 3 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">
                    Q. Does the Norwell Hall of Fame only consist of individual athletes?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    A. No. The Hall of Fame currently consists of athletes, coaches, and friends of Norwell High School athletics. We inducted an entire team (1972 football team) in the 2012 class!
                  </p>
                </div>

                {/* FAQ 4 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">
                    Q. Who can nominate someone?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    A. Anyone can nominate an athlete, coach, team or friend of Norwell Athletics. The nominator should include as much information as possible so their candidate gets a thorough review.
                  </p>
                </div>

                {/* FAQ 5 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">
                    Q. How long are applications active?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    A. The committee reviews applications every 2 years and applications remain eligible for consideration for 5 cycles (10 years.)
                  </p>
                </div>

                {/* FAQ 6 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">
                    Q. When are applications accepted and when are inductees notified?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    A. Applications are accepted anytime with a cut-off in the spring of the current induction year. Inductees are notified as soon as decisions are made – in the spring of the induction year.
                  </p>
                </div>
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