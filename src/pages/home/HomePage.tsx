import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import styles from '../../styles/HomePage.module.css';


interface TrendingItem {
  _id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  user: {
    fullName: string;
    username: string;
  };
  views?: number;
  plays?: number;
  reads?: number;
  category?: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const Navbar = useNavbar();
  const { Footer } = useFooter();

  const [trendingVideos, setTrendingVideos] = useState<TrendingItem[]>([]);
  const [trendingAudios, setTrendingAudios] = useState<TrendingItem[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        // Fetch trending videos (sorted by views)
        const videosRes = await fetch(`${apiUrl}/videos?sort=-views&limit=3`);
        const videosData = await videosRes.json();
        setTrendingVideos(videosData.data || []);

        // Fetch trending audios (sorted by plays)
        const audiosRes = await fetch(`${apiUrl}/audios?sort=-plays&limit=3`);
        const audiosData = await audiosRes.json();
        setTrendingAudios(audiosData.data || []);

        // Fetch trending blogs (sorted by reads/views)
        const blogsRes = await fetch(`${apiUrl}/blogs?sort=-reads&limit=3`);
        const blogsData = await blogsRes.json();
        setTrendingBlogs(blogsData.data || []);
      } catch (error) {
        console.error('Error fetching trending content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingContent();
  }, []);

  const onVideoClick = useCallback((videoId: string) => {
    navigate(`/videos/${videoId}`);
  }, [navigate]);

  const onAudioClick = useCallback((audioId: string) => {
    navigate(`/audios/${audioId}`);
  }, [navigate]);

  const onBlogClick = useCallback((blogId: string) => {
    navigate(`/blogs/${blogId}`);
  }, [navigate]);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className={styles.home}>
      {Navbar}

      {/* Hero Section */}
      <div className={styles.header}>
        <div className={styles.svg}>
          <div style={{ opacity: 0.2 }}>
            {/* Decorative background elements */}
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.tWrapper}>
            <div className={styles.t}>T</div>
          </div>
          <h1 className={styles.heading1}>UIU TALENT HUNT SHOW</h1>
          <p className={styles.videoAudio}>
            Video • Audio • Blogs ~ All in One Platform
          </p>
          <div className={styles.linksContainer}>
            <Link to="/blogs" className={`${styles.link} ${styles.link1}`}>
              <span className={styles.iconBox}>📝</span>
              <span className={styles.linkText}>Blog Portal</span>
            </Link>
            <Link to="/audios" className={`${styles.link} ${styles.link2}`}>
              <span className={styles.iconBox}>🎵</span>
              <span className={styles.linkText}>Audio Portal</span>
            </Link>
            <Link to="/videos" className={`${styles.link} ${styles.link3}`}>
              <span className={styles.iconBox}>🎬</span>
              <span className={styles.linkText}>Video Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main}>
        <div className={styles.backgroundshadow}>
          {/* Trending Videos Section */}
          <div style={{ marginBottom: '60px' }}>
            <>
              <h2 className={styles.heading2}>
                <span className={styles.trendingVideos}>Trending Videos</span>
                <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280', marginLeft: '12px' }}>
                  (Most Viewed)
                </span>
              </h2>
              {loading ? (
                <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading...</p>
              ) : trendingVideos.length > 0 ? (
                <div className={styles.section}>
                  {trendingVideos.map((video) => (
                    <div
                      key={video._id}
                      className={styles.backgroundshadow2}
                      onClick={() => onVideoClick(video._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {video.thumbnailUrl ? (
                        <img
                          alt={video.title}
                          className={styles.abstractAiGlobeVisualizatio}
                          src={video.thumbnailUrl}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className={styles.abstractAiGlobeVisualizatio}
                          style={{
                            backgroundColor: '#e5edf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px'
                          }}
                        >
                          🎬
                        </div>
                      )}
                      <h3 className={styles.heading3}>{truncateText(video.title, 60)}</h3>
                      <p className={styles.basicsOfAi}>
                        {truncateText(video.description || '', 80)}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#6b7280',
                        padding: '0 20px 16px',
                        borderTop: '1px solid #f3f4f6',
                        paddingTop: '12px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                          <span style={{ fontSize: '16px' }}>👁</span> {video.views || 0} views
                        </span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>by {video.user?.fullName || 'Unknown'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No videos available yet.</p>
              )}
            </>
          </div>

          {/* Trending Audios Section */}
          <div style={{ marginBottom: '60px' }}>
            <>
              <h2 className={styles.heading22}>
                <span className={styles.trendingAudios}>Trending Audios</span>
                <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280', marginLeft: '12px' }}>
                  (Most Played)
                </span>
              </h2>
              {loading ? (
                <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading...</p>
              ) : trendingAudios.length > 0 ? (
                <div className={styles.section2}>
                  {trendingAudios.map((audio) => (
                    <div
                      key={audio._id}
                      className={styles.backgroundshadow2}
                      onClick={() => onAudioClick(audio._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {audio.thumbnailUrl ? (
                        <img
                          alt={audio.title}
                          className={styles.goldAudioWaveform}
                          src={audio.thumbnailUrl}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className={styles.goldAudioWaveform}
                          style={{
                            backgroundColor: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px'
                          }}
                        >
                          🎵
                        </div>
                      )}
                      <h3 className={styles.heading34}>{truncateText(audio.title, 60)}</h3>
                      <p className={styles.authorName1}>
                        {audio.user?.fullName || 'Unknown'}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#6b7280',
                        padding: '0 20px 16px',
                        borderTop: '1px solid #f3f4f6',
                        paddingTop: '12px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                          <span style={{ fontSize: '16px' }}>▶</span> {audio.plays || 0} plays
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#fff',
                          backgroundColor: '#3b82f6',
                          padding: '4px 8px',
                          borderRadius: '12px'
                        }}>{audio.category || 'Music'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No audios available yet.</p>
              )}
            </>
          </div>

          {/* Trending Blogs Section */}
          <div>
            <>
              <h2 className={styles.heading23}>
                <span className={styles.trendingBlogs}>Trending Blogs</span>
                <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280', marginLeft: '12px' }}>
                  (Most Read)
                </span>
              </h2>
              {loading ? (
                <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading...</p>
              ) : trendingBlogs.length > 0 ? (
                <div className={styles.section3}>
                  {trendingBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className={styles.backgroundshadow8}
                      onClick={() => onBlogClick(blog._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {blog.coverImageUrl ? (
                        <img
                          alt={blog.title}
                          className={styles.aiTextOnACircuitBoardBac}
                          src={blog.coverImageUrl}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className={styles.aiTextOnACircuitBoardBac}
                          style={{
                            backgroundColor: '#dbeafe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px'
                          }}
                        >
                          📝
                        </div>
                      )}
                      <h3 className={styles.heading37}>{truncateText(blog.title, 60)}</h3>
                      <p className={styles.loremIpsumDolor}>
                        {truncateText(blog.description || '', 100)}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#6b7280',
                        padding: '0 20px 12px',
                        borderTop: '1px solid #f3f4f6',
                        paddingTop: '12px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                          <span style={{ fontSize: '16px' }}>📖</span> {blog.reads || 0} reads
                        </span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>by {blog.user?.fullName || 'Unknown'}</span>
                      </div>
                      <a href="#" className={styles.link4} onClick={(e) => { e.preventDefault(); onBlogClick(blog._id); }}>
                        <span className={styles.readMore}>Read More</span>
                        <span className="material-icons" style={{ fontSize: '16px' }}>
                          arrow_forward
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No blogs available yet.</p>
              )}
            </>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
