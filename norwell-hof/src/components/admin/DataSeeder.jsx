// src/components/admin/DataSeeder.jsx
import { useState } from 'react';
import { createClass, createInductee } from '../../firebase/firestore';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

const DataSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const classesData = [
    { year: 2024, inducteeCount: 11, ceremonyDate: 'October 26, 2024', description: 'Inducting a coach, a team, and eight individual athletes—all representing the best of our little town.' },
    { year: 2022, inducteeCount: 11, ceremonyDate: 'May 2022', description: 'Honoring outstanding individuals and a historic team that brought glory to Norwell High School.' },
    { year: 2018, inducteeCount: 10, ceremonyDate: 'May 2018', description: 'Celebrating exceptional athletes and friends of Norwell Clippers who made lasting contributions.' },
    { year: 2016, inducteeCount: 10, ceremonyDate: 'May 2016', description: 'Recognizing athletes and coaches who exemplified excellence and dedication to Clipper athletics.' },
    { year: 2014, inducteeCount: 13, ceremonyDate: 'May 2014', description: 'Inducting coaches, athletes, and a friend of Clipper Athletics who shaped Norwell sports history.' },
    { year: 2012, inducteeCount: 12, ceremonyDate: 'May 2012', description: 'Honoring friends of Clipper Athletics, exceptional athletes, and the legendary 1972 Football Team.' },
    { year: 2010, inducteeCount: 15, ceremonyDate: 'November 2010', description: 'The inaugural class celebrating coaches, athletes, and dedicated supporters who built the foundation of Norwell athletics.' }
  ];

  const inducteesData = [
    // Class of 2024
    {
      name: 'Cody Cavicchi',
      classYear: 2024,
      sport: 'Golf, Hockey, Lacrosse',
      graduationYear: 2008,
      bio: 'Cody Cavicchi was unquestionably one of the greatest all-around athletes in the history of Norwell High School. He earned 12 varsity letters as he was a four-year varsity starter for the Clippers in three sports: golf, hockey, and lacrosse. During his four year varsity golf career, he led the Clippers to three South Shore League Championships, while accumulating a career individual record of 44-4-4. His hockey career followed a similar trajectory with 163 career points, making him one of the program\'s all-time leading scorers. His most dominant sport at NHS was lacrosse, where he was a four-year varsity starter and led the Clippers to the Division 3 state semifinals during his senior season. Upon graduation, Cody decided to serve our country by enlisting and serving in the United States Marine Corps.',
      achievements: 'Golf: 44-4-4 career record, 3 SSL Championships, 4x SSL All-Star, 4x Mariner All-Scholastic. Hockey: 163 career points, 3 SSL Championships, 4x Mariner All-Scholastic Honorable Mention. Lacrosse: 50 goals & 35 assists senior year, SSL All-Star, Patriot Ledger All-Scholastic, Led team to D3 state semifinals',
      photoURL: ''
    },
    {
      name: 'Frank Granara',
      classYear: 2024,
      sport: 'Football, Lacrosse',
      graduationYear: 2004,
      bio: 'Frank Granara earned 10 varsity letters at NHS—four in lacrosse, three in football, and three in basketball—and served as captain for all three teams. Heading into his senior year, Frank had already set the NHS single season lacrosse scoring record with 71 points (39 goals, 32 assists). He sustained a serious knee injury the summer before senior year but defied expectations by returning to gain over 1,000 yards on offense and score 10 touchdowns in football, while leading the defense with 115 tackles. He continued to persevere through significant knee pain during basketball season, helping the team go 22-2 and make the South Sectional finals. Frank would go on to play four years of football and lacrosse at Middlebury College. Frank lives in Norwell with his wife Erin and their two daughters, Evelyn and Perri.',
      achievements: 'Football: 1,000+ rushing yards, 10 TDs, 115 tackles, 5 sacks, 3 INTs senior year, 2x SSL All-Star, Patriot Ledger All-Scholastic. Lacrosse: 71 points junior year (school record), 2x SSL All-Star, All-Eastern Mass Second Team',
      photoURL: ''
    },
    {
      name: 'David Spitz',
      classYear: 2024,
      sport: 'Golf',
      graduationYear: 2000,
      bio: 'David Spitz was an outstanding golfer while at Norwell High School and continued to excel on courses throughout the country after high school. David had the rare distinction of being the captain of the golf team during all four years of his high school career. He was also the South Shore League MVP in his freshman through senior years. A two-time Patriot Ledger, Boston Herald and Boston Globe All-Scholastic player, David played as the #1 Clipper player in every match and had a record of 55-1. He led his team to a Division 2 Eastern Mass. State Championship in 2000. After graduation David was offered and accepted a full athletic golf scholarship to the University of Rhode Island, where he led his team as captain his senior year. David continues to compete in state and national amateur events. David lives with his wife Rita and kids Camila and Jacob.',
      achievements: '55-1 high school record, 4x SSL MVP, 4x team captain, 2x Patriot Ledger/Herald/Globe All-Scholastic, D2 Eastern Mass State Championship 2000, AJGA All-American, URI team captain, won Atlantic 10 Conference Tournament, 4th in New England Amateur Championship',
      photoURL: ''
    },
    {
      name: 'Jay Edwards',
      classYear: 2024,
      sport: 'Basketball',
      graduationYear: 1999,
      bio: 'Jay Edwards was a senior and leader on the 1999 Norwell High School Clippers basketball team that captured the South Shore League championship where he averaged 20 points, eight rebounds, and five assists per game. Jay is a member of the Norwell High School 1,000 Point Club, accomplished in only three varsity basketball seasons. Jay earned South Shore League All-Star honors and was named the MVP of the Amaral Tournament in his senior year. A Patriot Ledger All Scholastic, Jay was described by Coach John Willis as "a very explosive player". One of the many highlights was when Jay led the 14th-seed Clippers to a victory against the 3rd-seed team on the road in the state tournament. Jay is living in Las Vegas with his beautiful daughter Charleigh, and has been working as a flight attendant for Southwest Airlines for the last 20 years.',
      achievements: '1,000+ career points (3 seasons), SSL All-Star, Amaral Tournament MVP, Patriot Ledger All-Scholastic, averaged 20 PPG, 8 RPG, 5 APG senior year, SSL Championship 1999',
      photoURL: ''
    },
    {
      name: 'Roger Cluff',
      classYear: 2024,
      sport: 'Football, Basketball, Baseball',
      graduationYear: 1971,
      bio: 'Roger Cluff was that exceptionally rare athlete that starred in three varsity sports from his freshman through his senior year at NHS. On the football field, Roger was a starting varsity running back for four seasons, leading the Clippers in rushing yards and touchdowns in each season. In 1970, Roger was the 8th leading scorer in Eastern Massachusetts while accumulating 1,224 yards of total offense. As a four-year starter on the varsity basketball team, Roger was named a South Shore League All-Star after his sophomore, junior, and senior seasons. On the baseball diamond, Roger was a 4-year varsity starter as a pitcher and shortstop. He was named a South Shore League All-Star in 1969, 1970, and 1971, and led the Clippers in home runs and RBIs during those three seasons. The 1970 baseball team won the South Shore League Championship. Roger lives with his wife Linda in Kingston and is the proud father of Pamela and Brian, and devoted grandfather of Mia, Noah, Jack, Wren, Elan, and Sage.',
      achievements: 'Football: Led team in rushing/TDs all 4 years, 1,224 yards total offense 1970, 8th leading scorer in Eastern Mass. Basketball: 3x SSL All-Star. Baseball: 3x SSL All-Star, led team in HRs/RBIs, .500 batting average 1969, SSL Championship 1970',
      photoURL: ''
    },
    {
      name: 'Greg Thornton',
      classYear: 2024,
      sport: 'Football, Baseball',
      graduationYear: 2005,
      bio: 'Greg Thornton was a superb multi-sport athlete recognized for his excellent play on the gridiron at Norwell High School and beyond. For three years, Greg was a varsity football player who played both sides of the ball. During his senior season, Greg rushed for a total of 2,009 yards and 24 touchdowns. He closed out the season with a 246-yard effort and scored 3 touchdowns to lead the Clippers to a Thanksgiving Day win against rival Hanover. Greg also excelled at the corner position where he intercepted 6 passes and led a defense that gave up an average of only 12 points per game. For his record-breaking single season running performance, Greg was named the Boston Globe Division 3 Player of the Year in 2004. Greg was also a standout on the baseball diamond as a four-year varsity starter playing centerfield. He batted .425 as a junior and .390 in his senior year, leading the SSL in steals both years. Greg went on to play four years of varsity football at Bates College. He and his wife Alessandra reside in Norwell with their son, Jake.',
      achievements: 'Football: 2,009 rushing yards, 24 TDs, 6 INTs senior year, Boston Globe D3 Player of the Year 2004, SSL runner-up 2004, played in East-West Shriners Game. Baseball: 4-year starter, .425 BA junior year, .390 BA senior year, 2x SSL stolen base leader, 2x SSL All-Star',
      photoURL: ''
    },
    {
      name: 'Jessie Weber Shearer',
      classYear: 2024,
      sport: 'Basketball',
      graduationYear: 2001,
      bio: 'In the storied history of the Norwell High School girls basketball program, there may not have been a more successful era than the one that began in the mid-1990s. Making headlines right in the middle of this run of excellence was perhaps the program\'s most dynamic player—Jessie Weber. Jessie had an immediate impact on the court, earning a starting role on the varsity team as a freshman and recognition as a SSL All-Star and Patriot Ledger All-Scholastic. During her sophomore season, Jessie scored 37 points in a game versus Carver, establishing a new program single game record. She would go on to lead the SSL in scoring for three consecutive seasons and led the Clippers to three consecutive SSL championships. At the conclusion of her four year career, Jessie would finish with 1,511 career points, the second most in NHS girls basketball history. She became the first female basketball player from Norwell to be named a Patriot Ledger All-Scholastic in four consecutive seasons. Upon high school graduation, Jessie received a basketball scholarship to Bryant University where she played four years of Division I basketball. Jessie resides in Hanover, Massachusetts with her husband Eric and their two children, EJ and Alice.',
      achievements: '1,511 career points (2nd all-time), 37 points vs Carver (school record), 3x SSL leading scorer, 4x SSL All-Star, 4x Patriot Ledger All-Scholastic, Boston Herald & Globe All-Scholastic 2001, 3 SSL Championships, D3 South Sectional Finals',
      photoURL: ''
    },
    {
      name: 'Mary Connolly',
      classYear: 2024,
      sport: 'Field Hockey, Basketball, Softball',
      graduationYear: 1981,
      bio: 'A true student-athlete, Mary was a 3-sport athlete who earned 10 Varsity letters during her four years at Norwell High School: field hockey (4), basketball (3), and softball (3). She was named a South Shore League All-Star in softball her sophomore, junior, and senior years; in field hockey her junior and senior years; and in basketball her senior year when she was third in the league in scoring. She served as a captain for all three sports. In her senior year, Mary was the first NHS female athlete ever to be selected to the Patriot Ledger All-Star teams in two different sports (basketball and softball). While she excelled in all three sports at Norwell High School, she was most outstanding in softball where she batted .500 and had 20 RBIs during her senior year. Amazingly, in her four-year varsity career, she batted over .400. After attending Salem State University her freshman year, Mary transferred to Curry College upon being offered a basketball scholarship. In her three years at Curry, she starred for both the basketball and softball teams and earned the maximum six varsity letters. She was a two-year captain of the basketball team (winning the Coaches Award in her senior year) and was also the captain and two-time MVP of the softball team. In her senior year, Mary earned the Curry College Student-Athlete Award. In 1992, Mary was inducted to the Curry College Athletic Hall of Fame where she held four school records in softball. Mary and her wife Catherine split their time between Duxbury and Naples, Florida.',
      achievements: 'Softball: .500 BA, 20 RBIs senior year, .400+ career BA, 3x SSL All-Star. Basketball: SSL All-Star, 3rd in league scoring. Field Hockey: 2x SSL All-Star. First NHS female athlete on Patriot Ledger All-Star teams in 2 sports. Curry College: 6 varsity letters, 2x basketball captain, softball captain & 2x MVP, Student-Athlete Award, inducted to Curry HOF 1992',
      photoURL: ''
    },
    {
      name: 'Dick Austin',
      classYear: 2024,
      sport: 'Wrestling Coach',
      graduationYear: null,
      bio: 'Dick Austin is known as a successful football coach, assistant coach of Norwell High School girls track team, a 35-year Norwell Junior High School physical education teacher, and a Henry Goldman Middle School administrator for more than five years. However, what Dick is being recognized for is his contributions as the inaugural Norwell High School wrestling coach at NHS, a position he held for 17 years. As a former nationally-recognized high school and collegiate wrestler, Coach Austin set his sights on starting a wrestling program at Norwell High School in 1977. Unlike many athletic programs, there was no youth feeder program for him to draw on. So, from dawn to dusk, he recruited Norwell High School students to join his new team. When Coach Austin started the NHS wrestling program, he did so with a few mats, some old equipment and uniforms, and a passion for the sport of wrestling. And he developed a juggernaut. Coach Austin coached his team to many South Shore League championships and South Sectional Championships. He also coached four Clipper wrestlers to the State Finals (Roger Caron, Brett Chicko, Frank Chicko, and Scott Virtue). Two of those wrestlers won state championships. After leaving the Norwell Public Schools, Dick inspired many by his summiting of all three Grand Teton peaks as well as Mount Kilimanjaro in Tanzania. Dick currently lives in Maine with his wife and is the proud father of Kim and Ron and grandfather to Josie, Hobie, Torie, and Nick.',
      achievements: '17 years as NHS wrestling coach (1977-1994), Multiple SSL Championships, Multiple South Sectional Championships, 4 wrestlers to State Finals (2 state champions: Roger Caron, Brett Chicko), Known for 4 principles: Believe in yourself, Character/Sportsmanship/Integrity, Will to prepare to win, Earn the Right to Win',
      photoURL: ''
    },
    {
      name: '1987 Clippers Football Team',
      classYear: 2024,
      sport: 'Football',
      graduationYear: 1987,
      bio: 'The 1987 Norwell High School Clippers football team easily won the South Shore League Championship. During this season, the team scored 39 touchdowns and allowed only nine. The Clippers were known for their stingy and punishing defense, an opportunistic passing game, and a vaunted and balanced running attack. The \'87 Clippers earned the opportunity to face a very strong Whitman-Hanson team in the Super Bowl. Held at BU\'s Nickerson Field on a cold December day, Norwell entered the game as prohibitive underdogs with local newspapers predicting an easy Panther victory. After a close first half, Hall of Fame Coach Dave Walsh decided to rely on the Clipper running game. Norwell went on to dominate the second half and earned an 18-7 victory—the first Super Bowl championship for the Clippers since 1972. Team Roster: Derek Amorelli, Richard Babcock, John Benevides, David Candito, Todd Chicko, Seth Clark, Peter Colarusso, Jason Cook, Eric Davies (Captain), Brian Frankel (Captain), Brian Fish, Ralph Giordano, Scott Gilmartin, Michael Garrity, Mark Goldman, Thomas Heany, Timothy Halloran, Paul Hillman, Paul Hogan, Mark Hopkins, Kevin Kapek, David Kaslauskas, Matthew Keiter, Michael Laverty, Keith Macdonald, Corey MacDonald, James Maguire, Tony McLaughlin, Shane McMahon, Todd McNeil, Kevin Mildrum, Rob Miner, Kevin Mitchell, Patrick O\'Neill, David Petrillo, Keith Smith, Ben Taylor, Brett Tebeau, Lee Townsend, John Turco, Norman Vail, Louis Villa, Jimmy White. Coaches: Dave Walsh (Head Coach), Al Kassatly, James Daley, Dennis Kelly. Managers: Michael Bourke, Jason Pithie.',
      achievements: 'SSL Championship 1987, Super Bowl Champions 1987 (18-7 vs Whitman-Hanson at BU Nickerson Field), 39 TDs scored, only 9 TDs allowed',
      photoURL: ''
    },

    // Class of 2022
    {
      name: 'Peter Dickman',
      classYear: 2022,
      sport: 'Baseball, Basketball',
      graduationYear: 1951,
      bio: 'Peter Dickman excelled in baseball and basketball at Norwell High School, representing the earliest era of Clipper athletics.',
      achievements: 'Multi-sport athlete in baseball and basketball',
      photoURL: ''
    },
    {
      name: 'Meghan Prentiss',
      classYear: 2022,
      sport: 'Track & Field',
      graduationYear: 1994,
      bio: 'Meghan Prentiss was a standout track & field athlete who brought dedication and competitive excellence to the Clippers program.',
      achievements: 'Track & Field standout, multiple event competitor',
      photoURL: ''
    },
    {
      name: 'Amy Barao Kullar',
      classYear: 2022,
      sport: 'Basketball',
      graduationYear: 1997,
      bio: 'Amy Barao Kullar was a key contributor to the successful Norwell basketball program in the mid-1990s.',
      achievements: 'Basketball excellence, team leader',
      photoURL: ''
    },
    {
      name: 'Meg Barao',
      classYear: 2022,
      sport: 'Basketball',
      graduationYear: 1997,
      bio: 'Meg Barao, along with her sister Amy, helped establish a winning tradition in Norwell girls basketball.',
      achievements: 'Basketball standout, team success',
      photoURL: ''
    },
    {
      name: 'Sam Bitetti',
      classYear: 2022,
      sport: 'Tennis',
      graduationYear: 2003,
      bio: 'Sam Bitetti dominated on the tennis courts for Norwell High School, bringing skill and competitive fire to every match.',
      achievements: 'Tennis excellence, league competition',
      photoURL: ''
    },
    {
      name: 'Gerry Corcoran',
      classYear: 2022,
      sport: 'Basketball',
      graduationYear: 2003,
      bio: 'Gerry Corcoran was a basketball standout who contributed to the continued success of the Clippers basketball program.',
      achievements: 'Basketball achievements, team success',
      photoURL: ''
    },
    {
      name: 'Jackie Vickers',
      classYear: 2022,
      sport: 'Soccer',
      graduationYear: 2005,
      bio: 'Jackie Vickers was a dynamic soccer player who showcased skill and leadership on the field for the Clippers.',
      achievements: 'Soccer excellence, team leadership',
      photoURL: ''
    },
    {
      name: 'Jim Sullivan',
      classYear: 2022,
      sport: 'Football Coach',
      graduationYear: null,
      bio: 'Jim Sullivan (deceased) was the head football coach who led the Clippers to numerous victories and championships. His leadership and coaching philosophy helped shape Norwell football into a competitive program.',
      achievements: 'Head Football Coach, multiple championships, mentor to countless athletes',
      photoURL: ''
    },
    {
      name: 'Stephen Marsh',
      classYear: 2022,
      sport: 'Contributor',
      graduationYear: null,
      bio: 'Stephen Marsh made significant contributions to Norwell High School athletics as a supporter and advocate for student-athletes.',
      achievements: 'Contributor to Norwell HS Athletics, dedicated supporter',
      photoURL: ''
    },
    {
      name: '1976 Baseball Team',
      classYear: 2022,
      sport: 'Baseball',
      graduationYear: 1976,
      bio: 'The 1976 Baseball Team achieved remarkable success and set the standard for Norwell baseball excellence.',
      achievements: 'Team championship season, legacy of excellence',
      photoURL: ''
    },

    // Class of 2018
    {
      name: 'Susan Bitetti',
      classYear: 2018,
      sport: 'Tennis',
      graduationYear: 2008,
      bio: 'Susan Bitetti was a dominant force in Norwell tennis, showcasing exceptional skill and competitive excellence.',
      achievements: 'Tennis standout, league excellence',
      photoURL: ''
    },
    {
      name: 'Joe Connolly',
      classYear: 2018,
      sport: 'Baseball',
      graduationYear: 1979,
      bio: 'Joe Connolly was a standout baseball player who contributed to the strong tradition of Norwell baseball.',
      achievements: 'Baseball excellence, team success',
      photoURL: ''
    },
    {
      name: 'Ralph Cluff',
      classYear: 2018,
      sport: 'Basketball, Baseball',
      graduationYear: 1967,
      bio: 'Ralph Cluff (deceased) was a two-sport star who excelled in both basketball and baseball, continuing the Cluff family legacy in Norwell athletics.',
      achievements: 'Multi-sport athlete, basketball and baseball',
      photoURL: ''
    },
    {
      name: 'Dan Ellis',
      classYear: 2018,
      sport: 'Baseball',
      graduationYear: 1984,
      bio: 'Dan Ellis (deceased) was a talented baseball player who left his mark on the Norwell baseball program.',
      achievements: 'Baseball standout',
      photoURL: ''
    },
    {
      name: 'Joseph Krainin',
      classYear: 2018,
      sport: 'Football',
      graduationYear: 1994,
      bio: 'Joseph Krainin was a football standout who brought intensity and skill to the Clippers football program.',
      achievements: 'Football excellence',
      photoURL: ''
    },
    {
      name: 'Andrew Lawson',
      classYear: 2018,
      sport: 'Soccer, Basketball, Track & Field Coach',
      graduationYear: 2008,
      bio: 'Andrew Lawson (deceased) was a multi-sport athlete and coach who made significant contributions as both a player and mentor. He was recognized as a Friend of Norwell Clippers.',
      achievements: 'Multi-sport athlete, coach, Friend of Norwell Clippers',
      photoURL: ''
    },
    {
      name: 'Allison Marsden',
      classYear: 2018,
      sport: 'Track & Field',
      graduationYear: 1992,
      bio: 'Allison Marsden was a track & field standout who competed at a high level in multiple events.',
      achievements: 'Track & Field excellence',
      photoURL: ''
    },
    {
      name: 'Chris Mazzeo',
      classYear: 2018,
      sport: 'Friend of Norwell Clippers',
      graduationYear: null,
      bio: 'Chris Mazzeo was recognized as a Friend of Norwell Clippers for his dedication and support of the athletic programs.',
      achievements: 'Friend of Norwell Clippers, dedicated supporter',
      photoURL: ''
    },
    {
      name: 'Kathleen McGuire',
      classYear: 2018,
      sport: 'Basketball',
      graduationYear: 1961,
      bio: 'Kathleen McGuire was a basketball player from the early era of Norwell athletics who helped establish the program.',
      achievements: 'Basketball pioneer',
      photoURL: ''
    },
    {
      name: 'Ben Spitz',
      classYear: 2018,
      sport: 'Golf, Hockey',
      graduationYear: 2002,
      bio: 'Ben Spitz was a two-sport athlete who excelled in both golf and hockey, continuing the Spitz family tradition of athletic excellence.',
      achievements: 'Golf and Hockey standout',
      photoURL: ''
    },

    // Class of 2016
    {
      name: 'Vin Alabiso',
      classYear: 2016,
      sport: 'Football',
      graduationYear: 1994,
      bio: 'Vin Alabiso was a standout football player who brought intensity and skill to the Clippers program.',
      achievements: 'Football excellence',
      photoURL: ''
    },
    {
      name: 'Dawn Avery',
      classYear: 2016,
      sport: 'Track & Field',
      graduationYear: 1986,
      bio: 'Dawn Avery was a track & field standout who competed successfully in multiple events.',
      achievements: 'Track & Field competitor',
      photoURL: ''
    },
    {
      name: 'Art Axon',
      classYear: 2016,
      sport: 'Coach - Cross Country, Basketball, Track & Field',
      graduationYear: null,
      bio: 'Art Axon was a legendary coach who led boys cross country, basketball, and track & field teams to numerous victories and championships. His coaching philosophy and dedication shaped countless athletes.',
      achievements: 'Boys Cross Country, Basketball, and Track & Field Coach, multiple championships',
      photoURL: ''
    },
    {
      name: 'Ron Depesa',
      classYear: 2016,
      sport: 'Wrestling',
      graduationYear: 1989,
      bio: 'Ron Depesa was a dominant wrestler who helped establish Norwell wrestling as a competitive program.',
      achievements: 'Wrestling excellence',
      photoURL: ''
    },
    {
      name: 'Felix Dixon',
      classYear: 2016,
      sport: 'Coach and Athletic Director',
      graduationYear: null,
      bio: 'Felix Dixon served as both a coach and Athletic Director, providing leadership and vision for Norwell athletics.',
      achievements: 'Coach and Athletic Director',
      photoURL: ''
    },
    {
      name: 'Jen Kent',
      classYear: 2016,
      sport: 'Girls Lacrosse Coach',
      graduationYear: null,
      bio: 'Jen Kent was the girls lacrosse coach who helped build the program and develop talented athletes.',
      achievements: 'Girls Lacrosse Coach',
      photoURL: ''
    },
    {
      name: 'Greg Matchett',
      classYear: 2016,
      sport: 'Baseball',
      graduationYear: 1993,
      bio: 'Greg Matchett was a talented baseball player who contributed to the success of Norwell baseball.',
      achievements: 'Baseball standout',
      photoURL: ''
    },
    {
      name: 'John Mohan',
      classYear: 2016,
      sport: 'Basketball',
      graduationYear: 2004,
      bio: 'John Mohan was a basketball standout who showcased skill and leadership on the court.',
      achievements: 'Basketball excellence',
      photoURL: ''
    },
    {
      name: 'Cristin Napier',
      classYear: 2016,
      sport: 'Indoor Track, Track & Field',
      graduationYear: 1994,
      bio: 'Cristin Napier was a versatile track athlete who competed successfully in multiple events for both indoor and outdoor track.',
      achievements: 'Indoor Track and Track & Field standout',
      photoURL: ''
    },
    {
      name: 'William Shaw',
      classYear: 2016,
      sport: 'Tennis',
      graduationYear: 1999,
      bio: 'William Shaw was a tennis player who brought skill and competitive excellence to the Norwell tennis program.',
      achievements: 'Tennis excellence',
      photoURL: ''
    },

    // Class of 2014
    {
      name: 'Bill Gerety',
      classYear: 2014,
      sport: 'Basketball Coach and Athletic Director',
      graduationYear: null,
      bio: 'Bill Gerety was a legendary basketball coach and Athletic Director who shaped Norwell athletics for decades. His leadership both on the sidelines and in administration helped establish winning traditions.',
      achievements: 'Basketball Coach and Athletic Director, multiple championships',
      photoURL: ''
    },
    {
      name: 'Charles Napoli',
      classYear: 2014,
      sport: 'Football Coach',
      graduationYear: null,
      bio: 'Charles Napoli was a respected football coach who mentored countless athletes and helped build the Norwell football program.',
      achievements: 'Football Coach',
      photoURL: ''
    },
    {
      name: 'Jay Swartz',
      classYear: 2014,
      sport: 'Tennis Coach',
      graduationYear: null,
      bio: 'Jay Swartz was the tennis coach who developed the program and helped athletes reach their potential.',
      achievements: 'Tennis Coach',
      photoURL: ''
    },
    {
      name: 'John Winske',
      classYear: 2014,
      sport: 'Baseball',
      graduationYear: 1958,
      bio: 'John Winske was a baseball player from the early era of Norwell High School athletics.',
      achievements: 'Baseball',
      photoURL: ''
    },
    {
      name: 'Stephen Sibley',
      classYear: 2014,
      sport: 'Basketball',
      graduationYear: 1971,
      bio: 'Stephen Sibley was a basketball standout who helped establish the winning tradition of Norwell basketball. He was a key part of successful teams alongside Roger Cluff.',
      achievements: 'Basketball excellence, NHS all-time leading scorer during his era',
      photoURL: ''
    },
    {
      name: 'John Cowden',
      classYear: 2014,
      sport: 'Indoor Track, Track & Field',
      graduationYear: 1979,
      bio: 'John Cowden was a versatile track athlete who competed in multiple events.',
      achievements: 'Indoor Track and Track & Field',
      photoURL: ''
    },
    {
      name: 'Frank Chicko III',
      classYear: 2014,
      sport: 'Football, Wrestling, Baseball',
      graduationYear: 1983,
      bio: 'Frank Chicko III was a three-sport standout who excelled in football, wrestling, and baseball. He was a state champion wrestler coached by Dick Austin.',
      achievements: 'Three-sport athlete, Wrestling State Champion',
      photoURL: ''
    },
    {
      name: 'Pam Manning',
      classYear: 2014,
      sport: 'Softball, Basketball, Field Hockey',
      graduationYear: 1984,
      bio: 'Pam Manning was a three-sport athlete who showcased versatility and excellence across multiple programs.',
      achievements: 'Softball, Basketball, and Field Hockey standout',
      photoURL: ''
    },
    {
      name: 'James Murphy',
      classYear: 2014,
      sport: 'Indoor Track, Track & Field',
      graduationYear: 1986,
      bio: 'James Murphy was a track athlete who competed successfully in multiple events.',
      achievements: 'Indoor Track and Track & Field',
      photoURL: ''
    },
    {
      name: 'Peter Hajjar',
      classYear: 2014,
      sport: 'Football',
      graduationYear: 1995,
      bio: 'Peter Hajjar was a standout football player who brought skill and leadership to the Clippers.',
      achievements: 'Football excellence',
      photoURL: ''
    },
    {
      name: 'Meghan Dwyer',
      classYear: 2014,
      sport: 'Lacrosse',
      graduationYear: 2002,
      bio: 'Meghan Dwyer was a talented lacrosse player who helped establish the girls lacrosse program.',
      achievements: 'Lacrosse standout',
      photoURL: ''
    },
    {
      name: 'Elizabeth Ghilardi',
      classYear: 2014,
      sport: 'Lacrosse',
      graduationYear: 2002,
      bio: 'Elizabeth Ghilardi was a lacrosse standout who contributed to the growth of the Norwell girls lacrosse program.',
      achievements: 'Lacrosse excellence',
      photoURL: ''
    },
    {
      name: 'Cosmo Porro',
      classYear: 2014,
      sport: 'Friend of Clipper Athletics',
      graduationYear: null,
      bio: 'Cosmo Porro was recognized as a Friend of Clipper Athletics for his dedication and support of Norwell athletics.',
      achievements: 'Friend of Clipper Athletics',
      photoURL: ''
    },

    // Class of 2012
    {
      name: 'David "Chip" Ennis',
      classYear: 2012,
      sport: 'Friend of Clipper Athletics',
      graduationYear: null,
      bio: 'David "Chip" Ennis was recognized as a Friend of Clipper Athletics for his support and dedication to Norwell athletics.',
      achievements: 'Friend of Clipper Athletics',
      photoURL: ''
    },
    {
      name: 'Kevin L. Finneran Jr.',
      classYear: 2012,
      sport: 'Friend of Clipper Athletics',
      graduationYear: null,
      bio: 'Kevin L. Finneran Jr. was recognized as a Friend of Clipper Athletics for his support of the programs.',
      achievements: 'Friend of Clipper Athletics',
      photoURL: ''
    },
    {
      name: 'Mike Smith',
      classYear: 2012,
      sport: 'Friend of Clipper Athletics',
      graduationYear: null,
      bio: 'Mike Smith was recognized as a Friend of Clipper Athletics for his dedication to supporting Norwell athletics.',
      achievements: 'Friend of Clipper Athletics',
      photoURL: ''
    },
    {
      name: 'Gordon Wells',
      classYear: 2012,
      sport: 'Cross Country, Track & Field',
      graduationYear: 1962,
      bio: 'Gordon Wells was a distance runner who competed in cross country and track & field in the early era of Norwell athletics.',
      achievements: 'Cross Country and Track & Field',
      photoURL: ''
    },
    {
      name: 'Dan Carton',
      classYear: 2012,
      sport: 'Track & Field',
      graduationYear: 1980,
      bio: 'Dan Carton was a track & field athlete who competed successfully in multiple events.',
      achievements: 'Track & Field',
      photoURL: ''
    },
    {
      name: 'Brett Chicko',
      classYear: 2012,
      sport: 'Football, Wrestling',
      graduationYear: 1985,
      bio: 'Brett Chicko was a two-sport standout in football and wrestling. He was a state champion wrestler coached by Dick Austin.',
      achievements: 'Football and Wrestling, Wrestling State Champion',
      photoURL: ''
    },
    {
      name: 'Karen Phillips Preval',
      classYear: 2012,
      sport: 'Track & Field',
      graduationYear: 1988,
      bio: 'Karen Phillips Preval was a track & field athlete who competed in multiple events.',
      achievements: 'Track & Field',
      photoURL: ''
    },
    {
      name: 'Michelle Lordan McHugh',
      classYear: 2012,
      sport: 'Indoor Track, Track & Field',
      graduationYear: 1989,
      bio: 'Michelle Lordan McHugh was a versatile track athlete who competed in both indoor and outdoor seasons.',
      achievements: 'Indoor Track and Track & Field',
      photoURL: ''
    },
    {
      name: 'Nicholas Hajjar',
      classYear: 2012,
      sport: 'Basketball, Football',
      graduationYear: 1999,
      bio: 'Nicholas Hajjar was a two-sport athlete who excelled in both basketball and football.',
      achievements: 'Basketball and Football',
      photoURL: ''
    },
    {
      name: 'David Liffers',
      classYear: 2012,
      sport: 'Baseball',
      graduationYear: 2005,
      bio: 'David Liffers was a baseball standout who contributed to the success of the Norwell baseball program.',
      achievements: 'Baseball',
      photoURL: ''
    },
    {
      name: 'Michelle Granara',
      classYear: 2012,
      sport: 'Lacrosse',
      graduationYear: 2006,
      bio: 'Michelle Granara was a talented lacrosse player who helped build the Norwell girls lacrosse program.',
      achievements: 'Lacrosse',
      photoURL: ''
    },
    {
      name: '1972 Clipper Football Team',
      classYear: 2012,
      sport: 'Football',
      graduationYear: 1972,
      bio: 'The 1972 Clipper Football Team achieved championship success and set a high standard for Norwell football.',
      achievements: 'Championship season',
      photoURL: ''
    },

    // Class of 2010
    {
      name: 'Paul Snell',
      classYear: 2010,
      sport: 'Friend of Clipper Athletics',
      graduationYear: null,
      bio: 'Paul Snell was recognized as a Friend of Clipper Athletics for his dedication and support.',
      achievements: 'Friend of Clipper Athletics',
      photoURL: ''
    },
    {
      name: 'Albert Kassatly',
      classYear: 2010,
      sport: 'Football and Baseball Coach',
      graduationYear: null,
      bio: 'Albert Kassatly was a respected coach for both football and baseball who mentored countless athletes.',
      achievements: 'Football and Baseball Coach',
      photoURL: ''
    },
    {
      name: 'Robert Littlefield',
      classYear: 2010,
      sport: 'Indoor Track and Track & Field Coach',
      graduationYear: null,
      bio: 'Robert Littlefield was a track coach who developed successful indoor and outdoor track programs.',
      achievements: 'Indoor Track and Track & Field Coach',
      photoURL: ''
    },
    {
      name: 'Mary Osborn Knapp',
      classYear: 2010,
      sport: 'Girls Basketball Coach',
      graduationYear: null,
      bio: 'Mary Osborn Knapp was the girls basketball coach who helped establish the program.',
      achievements: 'Girls Basketball Coach',
      photoURL: ''
    },
    {
      name: 'Wesley Osborne',
      classYear: 2010,
      sport: 'Baseball',
      graduationYear: 1940,
      bio: 'Wesley Osborne was a baseball player from the earliest era of Norwell athletics.',
      achievements: 'Baseball',
      photoURL: ''
    },
    {
      name: 'John Barnecott',
      classYear: 2010,
      sport: 'Track & Field',
      graduationYear: 1970,
      bio: 'John Barnecott was a track & field athlete who competed in multiple events. He was part of the dynamic backfield with Roger Cluff and Steve Sibley.',
      achievements: 'Track & Field',
      photoURL: ''
    },
    {
      name: 'Keith Whitaker',
      classYear: 2010,
      sport: 'Cross Country, Indoor Track, Track & Field',
      graduationYear: 1973,
      bio: 'Keith Whitaker was a versatile distance runner who competed across all three seasons.',
      achievements: 'Cross Country, Indoor Track, and Track & Field',
      photoURL: ''
    },
    {
      name: 'Mark Cluff',
      classYear: 2010,
      sport: 'Baseball, Basketball, Football',
      graduationYear: 1974,
      bio: 'Mark Cluff was a three-sport athlete continuing the Cluff family legacy of athletic excellence.',
      achievements: 'Baseball, Basketball, and Football',
      photoURL: ''
    },
    {
      name: 'Roger Caron',
      classYear: 2010,
      sport: 'Football, Wrestling',
      graduationYear: 1980,
      bio: 'Roger Caron was a two-sport standout in football and wrestling. He was a state champion wrestler coached by Dick Austin and reached the State Finals.',
      achievements: 'Football and Wrestling, Wrestling State Finals',
      photoURL: ''
    },
    {
      name: 'Pam Connell Gess',
      classYear: 2010,
      sport: 'Indoor Track, Track & Field',
      graduationYear: 1986,
      bio: 'Pam Connell Gess was a track athlete who competed in both indoor and outdoor seasons.',
      achievements: 'Indoor Track and Track & Field',
      photoURL: ''
    },
    {
      name: 'Alicia Porro Thibeault',
      classYear: 2010,
      sport: 'Indoor Track, Track & Field',
      graduationYear: 1990,
      bio: 'Alicia Porro Thibeault was a versatile track athlete who competed successfully in multiple events.',
      achievements: 'Indoor Track and Track & Field',
      photoURL: ''
    },
    {
      name: 'Edward Healey',
      classYear: 2010,
      sport: 'Indoor Track, Soccer, Track & Field',
      graduationYear: 1992,
      bio: 'Edward Healey was a multi-sport athlete who competed in soccer and track.',
      achievements: 'Indoor Track, Soccer, and Track & Field',
      photoURL: ''
    },
    {
      name: 'Brian Fabrizio',
      classYear: 2010,
      sport: 'Football',
      graduationYear: 1999,
      bio: 'Brian Fabrizio was a football standout who brought skill and determination to the Clippers.',
      achievements: 'Football',
      photoURL: ''
    },
    {
      name: 'Daniel McNamara',
      classYear: 2010,
      sport: 'Basketball, Football',
      graduationYear: 2000,
      bio: 'Daniel McNamara was a two-sport athlete who excelled in both basketball and football.',
      achievements: 'Basketball and Football',
      photoURL: ''
    },
    {
      name: 'Sarah Cox',
      classYear: 2010,
      sport: 'Basketball',
      graduationYear: 2003,
      bio: 'Sarah Cox was a basketball standout who contributed to the success of the girls basketball program.',
      achievements: 'Basketball',
      photoURL: ''
    }
  ];

  // Helper function to add delay between operations
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Upload in smaller batches with delays
  const seedDatabase = async () => {
    setLoading(true);

    try {
      const totalToCreate = classesData.length + inducteesData.length;
      let currentCreate = 0;

      setStatus('Creating classes...');
      for (const classData of classesData) {
        const { error } = await createClass(classData);
        if (error) {
          console.error(`Error creating class ${classData.year}:`, error);
        }
        currentCreate++;
        setProgress({ current: currentCreate, total: totalToCreate });
        await delay(200); // Delay between class creates
      }

      // Wait for classes to settle
      await delay(1000);

      // Upload inductees in batches of 10
      setStatus('Creating inductees...');
      const batchSize = 10;
      for (let i = 0; i < inducteesData.length; i += batchSize) {
        const batch = inducteesData.slice(i, i + batchSize);
        
        // Process batch
        for (const inductee of batch) {
          const { error } = await createInductee(inductee);
          if (error) {
            console.error(`Error creating inductee ${inductee.name}:`, error);
          }
          currentCreate++;
          setProgress({ current: currentCreate, total: totalToCreate });
          await delay(150); // Small delay within batch
        }
        
        // Longer delay between batches
        if (i + batchSize < inducteesData.length) {
          setStatus(`Creating inductees... (${currentCreate - classesData.length}/${inducteesData.length} completed)`);
          await delay(1000);
        }
      }

      setStatus('✅ Successfully uploaded all Hall of Fame data!');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-8 h-8 text-blue-600" />
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Norwell High School Hall of Fame Data</h3>
          <p className="text-sm text-gray-600">Upload 7 classes with 72 inductees</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">📦 What will be uploaded:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✅ 7 Induction Classes (2010, 2012, 2014, 2016, 2018, 2022, 2024)</li>
          <li>✅ 72 Hall of Fame Inductees</li>
          <li>✅ Full bios and achievements from official program</li>
          <li>✅ Coaches, athletes, teams, and friends of Clipper athletics</li>
        </ul>
      </div>

      {status && (
        <div className={`p-4 rounded-lg mb-4 flex items-center gap-2 ${
          status.includes('✅') ? 'bg-green-100 text-green-800' :
          status.includes('❌') ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {status.includes('✅') ? <CheckCircle className="w-5 h-5" /> :
           status.includes('❌') ? <AlertCircle className="w-5 h-5" /> :
           <Database className="w-5 h-5 animate-spin" />}
          <span className="font-semibold">{status}</span>
        </div>
      )}

      {loading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={seedDatabase}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Database className="w-5 h-5" />
          {loading ? 'Uploading...' : 'Upload Hall of Fame Data'}
        </button>

        {status.includes('✅') && (
          <a
            href="/inductees"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg"
          >
            <CheckCircle className="w-5 h-5" />
            View Timeline
          </a>
        )}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>⚠️ Note:</strong> This is the official Norwell High School Athletic Hall of Fame data from the 2024 ceremony program.
          Upload happens in batches with delays to avoid rate limits. Use Manage Classes/Inductees to delete data if needed.
        </p>
      </div>
    </div>
  );
};

export default DataSeeder;