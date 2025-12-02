import { useCallback } from 'react';
import type { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/VPortal.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';

const VPortal: FunctionComponent = () => {
  const navigate = useNavigate();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();

  const onOverlayBorderShadowContainerClick = useCallback(() => {
    // Play featured video - could navigate to video detail or trigger player
    navigate('/videos/featured');
  }, [navigate]);

  const handleVideoClick = (videoId: string) => {
    navigate(`/videos/${videoId}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.vPortal}>
        <div className={styles.main}>
          <div className={styles.watchRateAnd}>Watch, rate, and discover the best performances from UIU students.</div>
          <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
            <section className={styles.section}>
              <div className={styles.featuredVideoHandPickedContainer}>
                <span className={styles.featuredVideoHandPickedContainer2}>
                  <b>Featured Video<br/></b>
                  <span className={styles.handPickedPerformanceBased}>{`Hand-picked performance based on ratings & engagement.`}</span>
                </span>
              </div>
              <div className={styles.background}>
                <div className={styles.editorsPick}>Editor's Pick</div>
              </div>
              <div className={styles.button}>
                <b className={styles.all}>All</b>
              </div>
              <div className={styles.button2}>
                <div className={styles.singingMusic}>Singing / Music</div>
              </div>
              <div className={styles.button3}>
                <div className={styles.comedy}>Comedy</div>
              </div>
              <div className={styles.button4}>
                <div className={styles.techTalk}>Tech Talk</div>
              </div>
              <div className={styles.button5}>
                <div className={styles.shortFilm}>Short Film</div>
              </div>
              <div className={styles.options}>
                <div className={styles.container}>
                  <div className={styles.sortTopRated}>Sort: Top Rated</div>
                </div>
              </div>
              <div className={styles.background2}>
                <div className={styles.background3}>
                  <b className={styles.classicalMashup}>Classical Mashup – UIU Cultural Night 2025</b>
                  <div className={styles.byEashaelehi44Container}>
                    <span className={styles.featuredVideoHandPickedContainer2}>
                      <span>{`by `}</span>
                      <b>@eashaelehi44</b>
                      <span> • Music / Live Performance</span>
                    </span>
                  </div>
                  <div className={styles.div}>★★★★★</div>
                  <div className={styles.kRatings}>4.9 • 1.8K ratings</div>
                  <div className={styles.kViews}>7.3K views • 5:42 • 3 days ago</div>
                  <div className={styles.background4}>
                    <div className={styles.singingLiveTalentShow}>#singing #live #talent-show</div>
                  </div>
                </div>
                <div className={styles.background5}>
                  <div className={styles.overlaybordershadow} onClick={onOverlayBorderShadowContainerClick}>
                    <div className={styles.border} />
                  </div>
                </div>
              </div>
              <div className={styles.article} onClick={() => handleVideoClick('acoustic-cover')}>
                <b className={styles.acousticCover}>Acoustic Cover – "City Lights"</b>
                <div className={styles.kViews2}>3.2K views • Music</div>
                <div className={styles.div2}>★★★★★</div>
                <div className={styles.div3}>4.8</div>
                <div className={styles.armanbeats2}>@armanbeats • 2 days ago</div>
                <div className={styles.acousticCover2}>#acoustic #cover</div>
                <div className={styles.background6}>
                  <div className={styles.overlay}>
                    <div className={styles.div4}>4:12</div>
                  </div>
                </div>
              </div>
              <div className={styles.article2} onClick={() => handleVideoClick('recording-studio')}>
                <b className={styles.recordingStudioSetup}>Recording Studio Setup on a<br/>Student Budget</b>
                <div className={styles.kViews3}>2.8K views • Tutorial</div>
                <div className={styles.div5}>★★★★☆</div>
                <div className={styles.div6}>4.6</div>
                <div className={styles.rafishortfilms1}>@rafiShortFilms • 1 week ago</div>
                <div className={styles.tutorialAudioStudio}>#tutorial #audio #studio</div>
                <div className={styles.background7}>
                  <div className={styles.overlay2}>
                    <div className={styles.div4}>9:10</div>
                  </div>
                </div>
              </div>
              <div className={styles.article3} onClick={() => handleVideoClick('standup-comedy')}>
                <b className={styles.standUpComedy}>Stand-up Comedy – Midterm<br/>Edition</b>
                <div className={styles.kViews4}>1.5K views • Comedy</div>
                <div className={styles.div5}>★★★★☆</div>
                <div className={styles.div9}>4.4</div>
                <div className={styles.mehedivlogs5}>@mehediVlogs • 5 days ago</div>
                <div className={styles.comedyStudentLife}>#comedy #student-life</div>
                <div className={styles.background8}>
                  <div className={styles.overlay2}>
                    <div className={styles.div4}>6:03</div>
                  </div>
                </div>
              </div>
              <div className={styles.article4} onClick={() => handleVideoClick('cultural-dance')}>
                <b className={styles.uiuCulturalNight}>UIU Cultural Night – Group<br/>Dance</b>
                <div className={styles.kViews5}>4.1K views •<br/>Performance</div>
                <div className={styles.div11}>★★★★★</div>
                <div className={styles.div12}>4.9</div>
                <div className={styles.zarinstories2}>@zarinStories • 2 weeks ago</div>
                <div className={styles.danceCulturalNight}>#dance #cultural-night</div>
                <div className={styles.background8}>
                  <div className={styles.overlay}>
                    <div className={styles.div4}>3:45</div>
                  </div>
                </div>
              </div>
              <div className={styles.article5} onClick={() => handleVideoClick('competitive-programming')}>
                <b className={styles.introToCompetitive}>Intro to Competitive<br/>Programming (Bangla)</b>
                <div className={styles.kViews6}>2.2K views • Tech Talk</div>
                <div className={styles.div5}>★★★★☆</div>
                <div className={styles.div6}>4.5</div>
                <div className={styles.sajidtechtalks3}>@sajidTechTalks • 3 weeks ago</div>
                <div className={styles.programmingTutorial}>#programming #tutorial</div>
                <div className={styles.background10}>
                  <div className={styles.overlay2}>
                    <div className={styles.div4}>8:22</div>
                  </div>
                </div>
              </div>
              <div className={styles.article6} onClick={() => handleVideoClick('last-bus')}>
                <b className={styles.shortFilm2}>Short Film – "Last Bus from<br/>UIU"</b>
                <div className={styles.kViews7}>5.6K views • Short Film</div>
                <div className={styles.div5}>★★★★☆</div>
                <div className={styles.div18}>4.7</div>
                <div className={styles.tanvirbeats1}>@tanvirBeats • 1 month ago</div>
                <div className={styles.shortfilmDrama}>#shortfilm #drama</div>
                <div className={styles.background11}>
                  <div className={styles.overlay6}>
                    <div className={styles.div19}>12:01</div>
                  </div>
                </div>
              </div>
            </section>
            <aside className={styles.aside}>
              <div className={styles.backgroundshadow}>
                <div className={styles.quickFiltersNarrowContainer}>
                  <span className={styles.featuredVideoHandPickedContainer2}>
                    <b>Quick Filters<br/></b>
                    <span className={styles.narrowDownVideos}>Narrow down videos by portal-specific attributes.</span>
                  </span>
                </div>
                <div className={styles.button6}>
                  <b className={styles.allRatings}>All ratings</b>
                </div>
                <div className={styles.button7}>
                  <div className={styles.andAbove}>4★ and above</div>
                </div>
                <div className={styles.button8}>
                  <div className={styles.unrated}>Unrated</div>
                </div>
                <div className={styles.button9}>
                  <div className={styles.short5}>{`Short (< 5 min)`}</div>
                </div>
                <div className={styles.button10}>
                  <div className={styles.medium515Min}>Medium (5–15 min)</div>
                </div>
                <div className={styles.button11}>
                  <div className={styles.long15}>{`Long (> 15 min)`}</div>
                </div>
                <div className={styles.ratingsComeFrom}>Ratings come from viewers' stars and comments. These same ratings are<br/>used in the talent leaderboard.</div>
              </div>
              <div className={styles.backgroundshadow2}>
                <div className={styles.topVideoTalentsContainer}>
                  <span className={styles.featuredVideoHandPickedContainer2}>
                    <b>Top Video Talents<br/></b>
                    <span className={styles.rankedByVideo}>{`Ranked by video ratings & engagement only.`}</span>
                  </span>
                </div>
                <div className={styles.background12}>
                  <div className={styles.videoLeaderboard}>Video leaderboard</div>
                </div>
                <div className={styles.horizontalborder}>
                  <img className={styles.imageIcon} alt="Easha Elehi" />
                  <b className={styles.eashaElehi}>Easha Elehi</b>
                  <div className={styles.videos}>#1 • 12 videos</div>
                  <div className={styles.div20}>★★★★★</div>
                  <div className={styles.div21}>4.9</div>
                </div>
                <div className={styles.horizontalborder2}>
                  <img className={styles.imageIcon} alt="Sajid Karim" />
                  <b className={styles.sajidKarim}>Sajid Karim</b>
                  <div className={styles.techTalks}>#2 • Tech Talks</div>
                  <div className={styles.div20}>★★★★☆</div>
                  <div className={styles.div23}>4.7</div>
                </div>
                <div className={styles.horizontalborder3}>
                  <img className={styles.imageIcon} alt="Nafisa Rahman" />
                  <b className={styles.nafisaRahman}>Nafisa Rahman</b>
                  <div className={styles.storyPerformances}>#3 • Story Performances</div>
                  <div className={styles.div20}>★★★★☆</div>
                  <div className={styles.div25}>4.6</div>
                </div>
                <div className={styles.clickATalent}>Click a talent on the real site to open their profile page and view all their<br/>videos, audio tracks, and blogs.</div>
              </div>
              <div className={styles.showingVideosFromContainer}>
                <span className={styles.featuredVideoHandPickedContainer2}>
                  <span>{`Showing videos from `}</span>
                  <b>this semester<br/></b>
                  <span>{`Sorted by `}</span>
                  <b>Top Rated</b>
                </span>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VPortal;
