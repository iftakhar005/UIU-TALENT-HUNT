import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FunctionComponent } from 'react';
import styles from '../../styles/AudioPortal.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';

const AudioPortal: FunctionComponent = () => {
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();
  const navigate = useNavigate();

  const onAudioClick = useCallback((audioId: number) => {
    navigate(`/audios/${audioId}`);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className={styles.aPortal}>
        <TabNavigation />
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.discoverSongsPodcasts}>Discover songs, podcasts, and spoken word performances from UIU talents. Ratings and plays contribute directly to the leaderboard.</div>
          </div>
          <div className={styles.section}>
            <div className={styles.article} onClick={() => onAudioClick(1)}>
              <b className={styles.heading2}>Acoustic Cover of "Wonderwall"</b>
              <div className={styles.aSoulfulRendition}>A soulful rendition recorded live in the UIU studio – perfect for<br/>a late-night playlist.</div>
              <div className={styles.byArmanHossainContainer}>
                <span className={styles.byArmanHossainContainer2}>
                  <span>{`by `}</span>
                  <b>Arman Hossain</b>
                  <span> • Singing / Music</span>
                </span>
              </div>
              <div className={styles.paragraphbackground}>
                <div className={styles.div}>▶</div>
                <div className={styles.kPlays}>11.3K plays</div>
              </div>
              <div className={styles.paragraphbackground2}>
                <div className={styles.div2}>💬</div>
                <div className={styles.comments}>328 comments</div>
              </div>
              <div className={styles.paragraphbackground3}>
                <div className={styles.div3}>★★★★★</div>
                <div className={styles.rating}>4.8 rating</div>
              </div>
              <div className={styles.background2}>
                <div className={styles.overlay}>
                  <div className={styles.background3}>
                    <div className={styles.div4}>▶</div>
                  </div>
                  <div className={styles.playTrack}>Play track</div>
                </div>
                <div className={styles.gradient} />
              </div>
            </div>
            <div className={styles.article2} onClick={() => onAudioClick(2)}>
              <b className={styles.heading22}>{`AI & Creativity – Campus Talk`}</b>
              <div className={styles.aPodcastStyleDiscussion}>A podcast-style discussion on how AI tools are reshaping<br/>design, music, and student projects.</div>
              <div className={styles.byMahiraAkterContainer}>
                <span className={styles.byArmanHossainContainer2}>
                  <span>{`by `}</span>
                  <b>Mahira Akter</b>
                  <span> • Podcast</span>
                </span>
              </div>
              <div className={styles.paragraphbackground4}>
                <div className={styles.div}>▶</div>
                <div className={styles.kPlays2}>9.7K plays</div>
              </div>
              <div className={styles.paragraphbackground5}>
                <div className={styles.div2}>💬</div>
                <div className={styles.comments2}>190 comments</div>
              </div>
              <div className={styles.paragraphbackground6}>
                <div className={styles.div3}>★★★★☆</div>
                <div className={styles.rating2}>4.6 rating</div>
              </div>
              <div className={styles.background4}>
                <div className={styles.overlay2}>
                  <div className={styles.background3}>
                    <div className={styles.div4}>▶</div>
                  </div>
                  <div className={styles.playEpisode}>Play episode</div>
                </div>
                <div className={styles.gradient} />
              </div>
            </div>
            <div className={styles.article3} onClick={() => onAudioClick(3)}>
              <b className={styles.heading23}>Guided Focus – 25 Minute Study Session</b>
              <div className={styles.ambientSoundscapeMixed}>Ambient soundscape mixed with gentle prompts to help you<br/>stay focused during Pomodoro cycles.</div>
              <div className={styles.byTanvirRahmanContainer}>
                <span className={styles.byArmanHossainContainer2}>
                  <span>{`by `}</span>
                  <b>Tanvir Rahman</b>
                  <span> • Instrumental / Ambient</span>
                </span>
              </div>
              <div className={styles.paragraphbackground4}>
                <div className={styles.div9}>▶</div>
                <div className={styles.kPlays2}>5.8K plays</div>
              </div>
              <div className={styles.paragraphbackground5}>
                <div className={styles.div2}>💬</div>
                <div className={styles.comments3}>142 comments</div>
              </div>
              <div className={styles.paragraphbackground6}>
                <div className={styles.div3}>★★★★★</div>
                <div className={styles.rating2}>4.9 rating</div>
              </div>
              <div className={styles.background2}>
                <div className={styles.overlay3}>
                  <div className={styles.background3}>
                    <div className={styles.div12}>▶</div>
                  </div>
                  <div className={styles.listenNow}>Listen now</div>
                </div>
                <div className={styles.gradient} />
              </div>
            </div>
            <div className={styles.article4} onClick={() => onAudioClick(4)}>
              <b className={styles.heading24}>My Journey Through Spoken Word</b>
              <div className={styles.aPowerfulPerformance}>A powerful performance about growing up, finding voice, and<br/>standing on the UIU stage for the first time.</div>
              <div className={styles.byNafisaRahmanContainer}>
                <span className={styles.byArmanHossainContainer2}>
                  <span>{`by `}</span>
                  <b>Nafisa Rahman</b>
                  <span> • Spoken Word</span>
                </span>
              </div>
              <div className={styles.paragraphbackground4}>
                <div className={styles.div9}>▶</div>
                <div className={styles.kPlays4}>7.6K plays</div>
              </div>
              <div className={styles.paragraphbackground5}>
                <div className={styles.div2}>💬</div>
                <div className={styles.comments4}>211 comments</div>
              </div>
              <div className={styles.paragraphbackground12}>
                <div className={styles.div3}>★★★★☆</div>
                <div className={styles.rating}>4.7 rating</div>
              </div>
              <div className={styles.background2}>
                <div className={styles.overlay4}>
                  <div className={styles.background3}>
                    <div className={styles.div4}>▶</div>
                  </div>
                  <div className={styles.spokenWord}>Spoken word</div>
                </div>
                <div className={styles.gradient} />
              </div>
            </div>
            <div className={styles.article5} onClick={() => onAudioClick(5)}>
              <b className={styles.heading25}>"Creative Minds" – Episode 03</b>
              <div className={styles.aRoundTableConversation}>A round-table conversation with student filmmakers on how<br/>they plan, shoot, and edit UIU short films.</div>
              <div className={styles.byCampusMediaContainer}>
                <span className={styles.byArmanHossainContainer2}>
                  <span>{`by `}</span>
                  <b>Campus Media Club</b>
                  <span> • Podcast Panel</span>
                </span>
              </div>
              <div className={styles.paragraphbackground4}>
                <div className={styles.div9}>▶</div>
                <div className={styles.kPlays5}>6.1K plays</div>
              </div>
              <div className={styles.paragraphbackground5}>
                <div className={styles.div2}>💬</div>
                <div className={styles.comments5}>175 comments</div>
              </div>
              <div className={styles.paragraphbackground6}>
                <div className={styles.div3}>★★★★☆</div>
                <div className={styles.rating2}>4.5 rating</div>
              </div>
              <div className={styles.background2}>
                <div className={styles.overlay2}>
                  <div className={styles.background3}>
                    <div className={styles.div4}>▶</div>
                  </div>
                  <div className={styles.playEpisode}>Play episode</div>
                </div>
                <div className={styles.gradient} />
              </div>
            </div>
            <div className={styles.article6} onClick={() => onAudioClick(6)}>
              <b className={styles.heading26}>Last Bus from UIU – Audio Story</b>
              <div className={styles.aCinematicAudio}>A cinematic audio drama following four friends trying to catch<br/>the last bus home after a long exam day.</div>
              <div className={styles.byDramaContainer}>
                <span className={styles.byArmanHossainContainer2}>
                  <span>{`by `}</span>
                  <b>{`Drama & Media Society`}</b>
                  <span> • Audio Drama</span>
                </span>
              </div>
              <div className={styles.paragraphbackground4}>
                <div className={styles.div9}>▶</div>
                <div className={styles.kPlays6}>8.3K plays</div>
              </div>
              <div className={styles.paragraphbackground5}>
                <div className={styles.div2}>💬</div>
                <div className={styles.comments6}>260 comments</div>
              </div>
              <div className={styles.paragraphbackground6}>
                <div className={styles.div3}>★★★★★</div>
                <div className={styles.rating2}>4.9 rating</div>
              </div>
              <div className={styles.background2}>
                <div className={styles.overlay6}>
                  <div className={styles.background3}>
                    <div className={styles.div12}>▶</div>
                  </div>
                  <div className={styles.storyMode}>Story mode</div>
                </div>
                <div className={styles.gradient} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AudioPortal;
