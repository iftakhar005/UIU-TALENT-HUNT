import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FunctionComponent } from 'react';
import styles from '../../styles/AudioPortal.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';

interface Audio {
  _id: string;
  title: string;
  description?: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  user: {
    _id: string;
    username: string;
    fullName: string;
    department?: string;
    currentTrimester?: string;
  };
  category?: string;
  plays?: number;
  comments?: any[];
  averageRating?: number;
  totalRatings?: number;
  createdAt: string;
}

const AudioPortal: FunctionComponent = () => {
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();
  const navigate = useNavigate();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/audios?limit=20&page=1`);

        if (!response.ok) throw new Error('Failed to fetch audios');
        
        const data = await response.json();
        setAudios(data.data || []);
      } catch (err) {
        console.error('Error fetching audios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, []);

  const onAudioClick = useCallback((audioId: string) => {
    navigate(`/audios/${audioId}`);
  }, [navigate]);

  const formatPlays = (plays?: number) => {
    if (!plays) return '0 plays';
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K plays`;
    return `${plays} plays`;
  };

  const renderStars = (rating?: number) => {
    if (!rating) return '☆☆☆☆☆';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
    return stars;
  };

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
            {loading ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading audios...</p>
            ) : audios.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No audios available yet.</p>
            ) : (
              audios.map((audio, index) => (
                <div 
                  key={audio._id} 
                  className={index === 0 ? styles.article : index === 1 ? styles.article2 : styles.article3}
                  onClick={() => onAudioClick(audio._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <b className={index === 0 ? styles.heading2 : index === 1 ? styles.heading22 : styles.heading23}>
                    {audio.title}
                  </b>
                  <div className={index === 0 ? styles.aSoulfulRendition : index === 1 ? styles.aPodcastStyleDiscussion : styles.ambientSoundscapeMixed}>
                    {audio.description || 'Listen to this amazing audio track'}
                  </div>
                  <div className={index === 0 ? styles.byArmanHossainContainer : index === 1 ? styles.byMahiraAkterContainer : styles.byTanvirRahmanContainer}>
                    <span className={styles.byArmanHossainContainer2}>
                      <span>{`by `}</span>
                      <b>{audio.user.fullName}</b>
                      {audio.user?.department && <span> • {audio.user.department} • {audio.user.currentTrimester} Trimester</span>}
                      <span> • {audio.category || 'Music'}</span>
                    </span>
                  </div>
                  <div className={index === 0 ? styles.paragraphbackground : styles.paragraphbackground4}>
                    <div className={styles.div}>▶</div>
                    <div className={index === 0 ? styles.kPlays : styles.kPlays2}>{formatPlays(audio.plays)}</div>
                  </div>
                  <div className={index === 0 ? styles.paragraphbackground2 : styles.paragraphbackground5}>
                    <div className={styles.div2}>💬</div>
                    <div className={index === 0 ? styles.comments : index === 1 ? styles.comments2 : styles.comments3}>
                      {audio.comments?.length || 0} comments
                    </div>
                  </div>
                  <div className={index === 0 ? styles.paragraphbackgroundUpvotes : styles.paragraphbackgroundUpvotes2}>
                    <div className={styles.div3Upvotes}>👍</div>
                    <div className={index === 0 ? styles.upvotes : styles.upvotes2}>
                      {audio.upvotes || 0}
                    </div>
                  </div>
                  <div className={index === 0 ? styles.paragraphbackgroundDownvotes : styles.paragraphbackgroundDownvotes2}>
                    <div className={styles.div3Downvotes}>👎</div>
                    <div className={index === 0 ? styles.downvotes : styles.downvotes2}>
                      {audio.downvotes || 0}
                    </div>
                  </div>
                  <div className={index === 0 ? styles.background2 : styles.background4}>
                    <div className={index === 0 ? styles.overlay : index === 1 ? styles.overlay2 : styles.overlay3}>
                      <div className={styles.background3}>
                        <div className={styles.div4}>▶</div>
                      </div>
                      <div className={index === 0 ? styles.playTrack : index === 1 ? styles.playEpisode : styles.listenNow}>
                        {index === 0 ? 'Play track' : index === 1 ? 'Play episode' : 'Listen now'}
                      </div>
                    </div>
                    <div className={styles.gradient} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AudioPortal;
