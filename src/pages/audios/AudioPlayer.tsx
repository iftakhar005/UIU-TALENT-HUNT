import type { FunctionComponent } from 'react';
import styles from '../../styles/AudioPlayer.module.css';

const AudioPlayer: FunctionComponent = () => {

  return (
    <div className={styles.aPlayer}>
      <div className={styles.main}>
        <b className={styles.heading1}>Audio Portal</b>
        <div className={styles.streamSongsCovers}>Stream songs, covers, podcasts, and storytelling sessions from UIU talents.</div>
        <div className={styles.basedOnListener}>Based on listener ratings and plays<br/>Audio-only leaderboard for this semester</div>
        <div className={styles.section}>
          <div className={styles.featuredPlaylistCuratedContainer}>
            <span className={styles.featuredPlaylistCuratedContainer2}>
              <b>Featured Playlist<br/></b>
              <span className={styles.curatedMixBased}>Curated mix based on highest-rated audio submissions.</span>
            </span>
          </div>
          <div className={styles.overlayborder}>
            <div className={styles.madeForUiu}>Made for UIU</div>
          </div>
          <div className={styles.playlistSinging}>Playlist • Singing / Chill / Study</div>
          <b className={styles.nightStudyLofi}>{`Night Study Lofi & Acoustic Covers`}</b>
          <div className={styles.relaxingInstrumentalsAnd}>Relaxing instrumentals and soft vocal covers selected from UIU<br/>Talent Hunt entries. Perfect for late-night coding or assignment<br/>marathons.</div>
          <div className={styles.div}>★★★★★</div>
          <div className={styles.avg640}>4.8 avg • 640 ratings</div>
          <div className={styles.tracksApprox}>24 tracks • Approx. 1 hr 45 min • Updated weekly</div>
          <div className={styles.overlayborder2}>
            <div className={styles.lofi}>#lofi</div>
          </div>
          <div className={styles.overlayborder3}>
            <div className={styles.acoustic}>#acoustic</div>
          </div>
          <div className={styles.overlayborder4}>
            <div className={styles.covers}>#covers</div>
          </div>
          <div className={styles.backgroundshadow}>
            <div className={styles.overlay}>
              <div className={styles.uiuMix}>UIU Mix</div>
            </div>
            <div className={styles.backgroundshadow2}>
              <div className={styles.border} />
            </div>
          </div>
          <div className={styles.table}>
            <div className={styles.headerRow}>
              <div className={styles.cell}>
                <div className={styles.div2}>#</div>
              </div>
              <div className={styles.cell2}>
                <div className={styles.title}>Title</div>
              </div>
              <div className={styles.cell3}>
                <div className={styles.talent}>Talent</div>
              </div>
              <div className={styles.cell4}>
                <div className={styles.type}>Type</div>
              </div>
              <div className={styles.cell5}>
                <div className={styles.rating}>Rating</div>
              </div>
              <div className={styles.cell6}>
                <div className={styles.plays}>Plays</div>
              </div>
              <div className={styles.cell7}>
                <div className={styles.duration}>Duration</div>
              </div>
            </div>
            <div className={styles.body}>
              <div className={styles.row}>
                <div className={styles.data1}>1</div>
                <div className={styles.data}>
                  <div className={styles.acousticChill}>Acoustic Chill – City Lights</div>
                  <div className={styles.recordedLiveAt}>Recorded live at UIU Studio</div>
                </div>
                <div className={styles.dataArmanbeats}>@armanbeats</div>
                <div className={styles.dataCover}>Cover</div>
                <div className={styles.data2}>
                  <div className={styles.div3}>★★★★★</div>
                  <div className={styles.div4}>4.9</div>
                </div>
                <div className={styles.data3200}>3,200</div>
                <div className={styles.data412}>4:12</div>
              </div>
              <div className={styles.row2}>
                <div className={styles.data3}>
                  <div className={styles.div5}>2</div>
                </div>
                <div className={styles.data4}>
                  <div className={styles.midnightCampusWalk}>Midnight Campus Walk</div>
                  <div className={styles.originalInstrumental}>Original instrumental</div>
                </div>
                <div className={styles.data5}>
                  <div className={styles.tanvirbeats}>@tanvirBeats</div>
                </div>
                <div className={styles.data6}>
                  <div className={styles.instrumental}>Instrumental</div>
                </div>
                <div className={styles.data7}>
                  <div className={styles.div6}>★★★★☆</div>
                  <div className={styles.div7}>4.7</div>
                </div>
                <div className={styles.data8}>
                  <div className={styles.div8}>2,450</div>
                </div>
                <div className={styles.data9}>
                  <div className={styles.div9}>3:58</div>
                </div>
              </div>
              <div className={styles.row3}>
                <div className={styles.data1}>3</div>
                <div className={styles.data10}>
                  <div className={styles.studyWithMe}>Study With Me – UIU Podcast</div>
                  <div className={styles.productivityTipsIn}>Productivity tips in Bangla</div>
                </div>
                <div className={styles.dataMahirapodcast}>@mahiraPodcast</div>
                <div className={styles.dataPodcast}>Podcast</div>
                <div className={styles.data11}>
                  <div className={styles.div3}>★★★★☆</div>
                  <div className={styles.div11}>4.6</div>
                </div>
                <div className={styles.data1900}>1,900</div>
                <div className={styles.data1820}>18:20</div>
              </div>
              <div className={styles.row4}>
                <div className={styles.data12}>
                  <div className={styles.div5}>4</div>
                </div>
                <div className={styles.data13}>
                  <div className={styles.rainyEveningAt}>Rainy Evening at UIU</div>
                  <div className={styles.fieldRecording}>Field recording + piano</div>
                </div>
                <div className={styles.data14}>
                  <div className={styles.zarinstories}>@zarinStories</div>
                </div>
                <div className={styles.data6}>
                  <div className={styles.ambient}>Ambient</div>
                </div>
                <div className={styles.data16}>
                  <div className={styles.div6}>★★★★★</div>
                  <div className={styles.div14}>4.8</div>
                </div>
                <div className={styles.data17}>
                  <div className={styles.div8}>2,120</div>
                </div>
                <div className={styles.data9}>
                  <div className={styles.div9}>5:03</div>
                </div>
              </div>
              <div className={styles.row5}>
                <div className={styles.data52}>5</div>
                <div className={styles.data10}>
                  <div className={styles.motivationMonday}>Motivation Monday – Exam Season</div>
                  <div className={styles.shortInspirationalTalk}>Short inspirational talk</div>
                </div>
                <div className={styles.dataNafisawrites}>@nafisaWrites</div>
                <div className={styles.dataStory}>Story / Talk</div>
                <div className={styles.data2}>
                  <div className={styles.div3}>★★★★☆</div>
                  <div className={styles.div11}>4.5</div>
                </div>
                <div className={styles.data1900}>1,540</div>
                <div className={styles.data715}>7:15</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.aside}>
          <div className={styles.backgroundshadow3}>
            <div className={styles.browseByMoodContainer}>
              <span className={styles.featuredPlaylistCuratedContainer2}>
                <b>{`Browse by Mood & Genre`}<br/>{``}</b>
                <span className={styles.filterAudioOnlyContent}>Filter audio-only content, similar to Spotify home.</span>
              </span>
            </div>
            <div className={styles.button}>
              <b className={styles.all}>All</b>
            </div>
            <div className={styles.button2}>
              <div className={styles.chillStudy}>Chill / Study</div>
            </div>
            <div className={styles.button3}>
              <div className={styles.workout}>Workout</div>
            </div>
            <div className={styles.button4}>
              <div className={styles.focus}>Focus</div>
            </div>
            <div className={styles.button5}>
              <div className={styles.party}>Party</div>
            </div>
            <div className={styles.button6}>
              <div className={styles.singingMusic}>Singing / Music</div>
            </div>
            <div className={styles.button7}>
              <div className={styles.instrumental2}>Instrumental</div>
            </div>
            <div className={styles.button8}>
              <div className={styles.podcast}>Podcast</div>
            </div>
            <div className={styles.button9}>
              <div className={styles.storytelling}>Storytelling</div>
            </div>
            <div className={styles.options}>
              <div className={styles.container}>
                <div className={styles.sortTopRated}>Sort: Top Rated</div>
              </div>
            </div>
            <div className={styles.ratingsFromListeners}>Ratings from listeners (1–5 stars) are used both here and in the global<br/>talent leaderboard.</div>
          </div>
          <div className={styles.backgroundshadow4}>
            <div className={styles.topAudioTalentsContainer}>
              <span className={styles.featuredPlaylistCuratedContainer2}>
                <b>Top Audio Talents<br/></b>
                <span className={styles.rankingUsesOnly}>Ranking uses only audio ratings, plays, and unique<br/>raters.</span>
              </span>
            </div>
            <div className={styles.overlayborder5}>
              <div className={styles.audioLeaderboard}>Audio<br/>leaderboard</div>
            </div>
            <div className={styles.horizontalborder}>
              <img className={styles.imageIcon} alt="" />
              <b className={styles.armanHossain}>Arman Hossain</b>
              <div className={styles.tracksChill}>{`9 tracks • Chill & lofi`}</div>
              <div className={styles.div19}>★★★★★</div>
              <div className={styles.div20}>4.9</div>
            </div>
            <div className={styles.horizontalborder2}>
              <img className={styles.imageIcon} alt="" />
              <b className={styles.mahiraAkter}>Mahira Akter</b>
              <div className={styles.episodesPodcast}>6 episodes • Podcast</div>
              <div className={styles.div19}>★★★★☆</div>
              <div className={styles.div22}>4.7</div>
            </div>
            <div className={styles.horizontalborder3}>
              <img className={styles.imageIcon} alt="" />
              <b className={styles.nafisaRahman}>Nafisa Rahman</b>
              <div className={styles.storytellingSpoken}>{`Storytelling & spoken word`}</div>
              <div className={styles.div19}>★★★★☆</div>
              <div className={styles.div24}>4.6</div>
            </div>
            <div className={styles.onTheLive}>On the live site, clicking a talent opens their profile with all videos, audios,<br/>and blogs plus their leaderboard position.</div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <img className={styles.imageIcon4} alt="" />
        <b className={styles.acousticChill2}>Acoustic Chill – City Lights</b>
        <div className={styles.armanbeatsSinging}>{`@armanbeats • Singing / Music • From "Night Study Lofi & Acoustic"`}</div>
        <div className={styles.backgroundborder}>
          <div className={styles.div25}>⏮</div>
        </div>
        <div className={styles.backgroundborder2}>
          <div className={styles.border2} />
        </div>
        <div className={styles.backgroundborder3}>
          <div className={styles.div25}>⏭</div>
        </div>
        <div className={styles.div27}>1:24</div>
        <div className={styles.background}>
          <div className={styles.gradient} />
        </div>
        <div className={styles.div28}>4:12</div>
        <div className={styles.div29}>💬</div>
        <div className={styles.div30}>⭐</div>
        <div className={styles.background2}>
          <div className={styles.background3} />
        </div>
        <div className={styles.backgroundborder4}>
          <div className={styles.audioOnlyMode}>Audio-only mode</div>
        </div>
        <div className={styles.footerChild} />
      </div>
      <div className={styles.nav}>
        <div className={styles.blogs}>Blogs</div>
        <div className={styles.audio}>Audio</div>
        <div className={styles.background4} />
        <div className={styles.video}>Video</div>
      </div>
    </div>
  );
};

export default AudioPlayer;
