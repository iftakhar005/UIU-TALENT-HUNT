import { useCallback, useState, useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/VPortal.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import { contentAPI } from '../../services/api';

const VPortal: FunctionComponent = () => {
  const navigate = useNavigate();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();
  const [videos, setVideos] = useState<any[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        console.log('📹 Fetching videos from API...');
        const response = await contentAPI.getAll({ type: 'video', limit: 50 });
        console.log('📹 Videos API Response:', response);
        
        // Handle both 'content' and 'data' fields for backward compatibility
        const videosList = response.content || response.data || [];
        
        if (response.success) {
          if (videosList.length > 0) {
            console.log(`✅ Loaded ${videosList.length} videos`);
            setVideos(videosList);
            // Get top 6 videos by views/likes for trending
            const sorted = [...videosList]
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 6);
            setTrendingVideos(sorted);
          } else {
            console.log('⚠️ API returned success but no videos found');
            console.log('Response:', response);
            setVideos([]);
            setTrendingVideos([]);
          }
        } else {
          console.error('❌ API returned success: false', response);
          setVideos([]);
          setTrendingVideos([]);
        }
      } catch (error) {
        console.error('❌ Error fetching videos:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        // Show user-friendly error message
        if (error instanceof Error) {
          if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.error('💡 Network error - check if backend is running or check API URL');
          }
        }
        setVideos([]);
        setTrendingVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const onVideoClick = useCallback((videoId: string) => {
    navigate(`/videos/${videoId}`);
  }, [navigate]);

  const renderVideoCard = (video: any, isTrending = false) => (
    <div
      key={video._id}
      className={isTrending ? styles.trendingCard : styles.videoCard}
      onClick={() => onVideoClick(video._id)}
    >
      <div className={styles.videoThumbnail}>
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} />
        ) : (
          <div className={styles.placeholderThumbnail}>
            <span className={styles.playIcon}>▶</span>
          </div>
        )}
        {video.duration && (
          <div className={styles.durationBadge}>{video.duration}</div>
        )}
      </div>
      <div className={styles.videoInfo}>
        <h3 className={styles.videoTitle}>{video.title}</h3>
        <p className={styles.videoDescription}>{video.description || ''}</p>
        <div className={styles.videoMeta}>
          <span>by <b>@{video.user?.username || 'Unknown'}</b></span>
          {video.category && <span> • {video.category}</span>}
        </div>
        <div className={styles.videoStats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>👁</span>
            <span>{video.views || 0} views</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>💬</span>
            <span>{video.comments?.length || 0} comments</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>❤️</span>
            <span>{video.likes?.length || 0} likes</span>
          </div>
        </div>
        {video.tags && video.tags.length > 0 && (
          <div className={styles.videoTags}>
            {video.tags.slice(0, 3).map((tag: string, idx: number) => (
              <span key={idx} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className={styles.vPortal}>
        <TabNavigation />
        <div className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Video Portal</h1>
            <p className={styles.pageDescription}>
              Watch, rate, and discover the best video performances from UIU students. Ratings and views contribute directly to the leaderboard.
            </p>
              </div>

          {/* Trending Videos Section */}
          {trendingVideos.length > 0 && (
            <div className={styles.trendingSection}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.trendingBadge}>🔥 Trending Videos</span>
              </h2>
              <div className={styles.trendingGrid}>
                {trendingVideos.map((video) => renderVideoCard(video, true))}
              </div>
              </div>
          )}

          {/* All Videos Section */}
          <div className={styles.allVideosSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.allVideosBadge}>All Videos</span>
            </h2>
            {loading ? (
              <div className={styles.loading}>Loading videos...</div>
            ) : videos.length === 0 ? (
              <div className={styles.emptyState}>No videos available yet. Be the first to submit one!</div>
            ) : (
              <div className={styles.videoGrid}>
                {videos.map((video) => renderVideoCard(video, false))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VPortal;
