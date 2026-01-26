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
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const Navbar = useNavbar({ 
    showSearch: true, 
    onSearch: setSearchQuery,
    searchPlaceholder: "Search videos...",
    searchValue: searchQuery
  });
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();
  const [videos, setVideos] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<any>(null);
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
            // Get the best video based on rating and views
            const sortedByQuality = [...videosList].sort((a, b) => {
              const scoreA = (a.averageRating || 0) * 10 + (a.views || 0) * 0.01;
              const scoreB = (b.averageRating || 0) * 10 + (b.views || 0) * 0.01;
              return scoreB - scoreA;
            });
            setFeaturedVideo(sortedByQuality[0]);
            // Get top 6 videos by views/likes for trending (excluding featured)
            const sorted = sortedByQuality.slice(1, 7);
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

  // Initialize filtered videos when videos load
  useEffect(() => {
    setFilteredVideos(videos);
  }, [videos]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter videos based on debounced search query
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setFilteredVideos(videos);
    } else {
      const query = debouncedSearchQuery.toLowerCase();
      const filtered = videos.filter(video => 
        video.title?.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        video.user?.fullName?.toLowerCase().includes(query) ||
        video.user?.username?.toLowerCase().includes(query) ||
        video.category?.toLowerCase().includes(query) ||
        video.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
      setFilteredVideos(filtered);
    }
  }, [debouncedSearchQuery, videos]);

  const onVideoClick = useCallback((videoId: string) => {
    navigate(`/videos/${videoId}`);
  }, [navigate]);

  const renderStars = (rating?: number) => {
    if (!rating) return '☆☆☆☆☆';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
    return stars;
  };

  const renderFeaturedCard = (video: any) => (
    <div
      key={video._id}
      className={styles.featuredCard}
      onClick={() => onVideoClick(video._id)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '32px',
        marginBottom: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
        <div>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🏆 Featured Video
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            {video.title}
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            {video.description || 'An amazing video performance from UIU talent'}
          </p>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <span style={{ fontSize: '18px' }}>👍</span>
              <span style={{ fontWeight: '600' }}>{video.upvotes || 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <span style={{ fontSize: '18px' }}>👎</span>
              <span style={{ fontWeight: '600' }}>{video.downvotes || 0}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <span style={{ fontSize: '20px' }}>👁</span>
              <span style={{ fontWeight: '600' }}>{video.views || 0}</span>
              <span style={{ opacity: 0.8 }}>views</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <span style={{ fontSize: '18px' }}>💬</span>
              <span style={{ fontWeight: '600' }}>{video.comments?.length || 0}</span>
              <span style={{ opacity: 0.8 }}>comments</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
              fontWeight: '600'
            }}>
              <span>🎬 by</span>
              <span style={{ color: '#fbbf24' }}>@{video.user?.username || 'Unknown'}</span>
            </div>
            {video.user?.department && (
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '8px 16px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px'
              }}>
                📚 {video.user.department} • {video.user.currentTrimester} Trimester
              </div>
            )}
            {video.category && (
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '8px 16px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px'
              }}>
                {video.category}
              </div>
            )}
          </div>
        </div>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              style={{ width: '100%', height: '350px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '350px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '80px' }}>🎬</span>
            </div>
          )}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#667eea',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            cursor: 'pointer'
          }}>
            ▶
          </div>
        </div>
      </div>
    </div>
  );

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
        {/* {video.duration && (
          <div className={styles.durationBadge}>{video.duration}</div>
        )} */}
      </div>
      <div className={styles.videoInfo}>
        <h3 className={styles.videoTitle}>{video.title}</h3>
        <p className={styles.videoDescription}>{video.description || ''}</p>
        <div className={styles.videoMeta}>
          <span>by <b>@{video.user?.username || 'Unknown'}</b></span>
          {video.user?.department && <span> • {video.user.department} • {video.user.currentTrimester} Trimester</span>}
          {video.category && <span> • {video.category}</span>}
        </div>
        <div className={styles.videoStats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>👍</span>
            <span>{video.upvotes || 0}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>👎</span>
            <span>{video.downvotes || 0}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>👁</span>
            <span>{video.views || 0} views</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>💬</span>
            <span>{video.comments?.length || 0} comments</span>
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
      {Navbar}
      <TabNavigation />
      <div className={styles.vPortal}>
        <div className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Video Portal</h1>
            <p className={styles.pageDescription}>
              Watch, rate, and discover the best video performances from UIU students. Ratings and views contribute directly to the leaderboard.
            </p>
          </div>

          {/* Featured Video Section */}
          {featuredVideo && renderFeaturedCard(featuredVideo)}

          {/* All Videos Section */}
          <div className={styles.allVideosSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.allVideosBadge}>
                {searchQuery ? `Search Results (${filteredVideos.length})` : 'All Videos'}
              </span>
            </h2>
            {loading ? (
              <div className={styles.loading}>Loading videos...</div>
            ) : searchQuery && filteredVideos.length === 0 ? (
              <div className={styles.emptyState}>No videos found matching "{searchQuery}"</div>
            ) : filteredVideos.length === 0 ? (
              <div className={styles.emptyState}>No videos available yet. Be the first to submit one!</div>
            ) : (
              <div className={styles.videoGrid}>
                {filteredVideos.map((video) => renderVideoCard(video, false))}
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
