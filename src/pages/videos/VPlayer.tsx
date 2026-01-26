import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import styles from '../../styles/VPlayer.module.css';

// Mock video data - fallback
const defaultVideoData = {
  id: '1',
  title: 'Quantum Superposition Explained in 5 Minutes',
  author: 'Manab',
  authorHandle: '@manabPhysics',
  views: '12.4K',
  uploadedAt: '3 hours ago',
  likes: '2.3K',
  rating: 4.8,
  description: `In this video, I break down the concept of quantum superposition in a way that's easy to understand.`,
  tags: ['#physics', '#quantum', '#science', '#education'],
  duration: '5:23',
  videoUrl: '',
  thumbnailUrl: '',
};

const defaultComments = [
  {
    id: 1,
    author: 'Kalam',
    avatar: 'linear-gradient(135deg, #ff8a3c, #ffd56a)',
    time: '2 hours ago',
    text: 'This was incredibly insightful. The explanation of quantum superposition was the clearest I\'ve ever seen.',
    likes: 15,
  },
  {
    id: 2,
    author: 'Niaz',
    avatar: 'linear-gradient(135deg, #4c8dff, #7fe2ff)',
    time: '4 hours ago',
    text: 'Fantastic presentation. I\'d love to see a follow-up on quantum entanglement next!',
    likes: 8,
  },
  {
    id: 3,
    author: 'Maliha',
    avatar: 'linear-gradient(135deg, #ff5f9a, #ffd1e3)',
    time: '1 day ago',
    text: 'Mind-blowing stuff. This has inspired my final year project. Thank you!',
    likes: 21,
  },
  {
    id: 4,
    author: 'Onkon',
    avatar: 'linear-gradient(135deg, #4c8dff, #7fe2ff)',
    time: '2 days ago',
    text: 'Could you also cover how this ties into quantum computing gates in a future video?',
    likes: 5,
  },
];

const defaultRelatedVideos = [
  {
    id: '2',
    title: 'Quantum Entanglement: The Spooky Connection',
    author: '@manabPhysics',
    views: '8.2K',
    duration: '7:15',
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Introduction to Machine Learning',
    author: '@sajidTechTalks',
    views: '15.1K',
    duration: '12:30',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'UIU Cultural Night Highlights 2024',
    author: '@zarinStories',
    views: '25.3K',
    duration: '18:45',
    rating: 4.8,
  },
  {
    id: '5',
    title: 'Stand-up Comedy: Student Life Edition',
    author: '@mehedyVlogs',
    views: '9.7K',
    duration: '8:20',
    rating: 4.6,
  },
];

const VPlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { Navbar } = useNavbar(true);
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  const [videoData, setVideoData] = useState<typeof defaultVideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [showDescription, setShowDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedVideos, setRelatedVideos] = useState(defaultRelatedVideos);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null); // Track user's vote
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const viewCountedRef = useRef(false);
  const viewCountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const checkAuth = useCallback(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  }, []);

  const handleVideoClick = (videoId: string) => {
    navigate(`/videos/${videoId}`);
  };

  const handleUpvote = useCallback(async () => {
    if (!checkAuth()) return;
    if (!id) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://uiu-talent-hunt-backend.onrender.com/api';
      let voteType = 'upvote';

      // If already upvoted, toggle it off
      if (userVote === 'upvote') {
        voteType = 'remove';
      }

      // Get or create a session user ID
      let sessionUserId = localStorage.getItem('sessionUserId');
      if (!sessionUserId) {
        sessionUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionUserId', sessionUserId);
      }

      const response = await fetch(`${apiUrl}/videos/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': sessionUserId
        },
        body: JSON.stringify({ voteType })
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      setUserVote(data.userVote);
      setUpvoteCount(data.upvotes || 0);
      setDownvoteCount(data.downvotes || 0);
      console.log('✅ Vote updated:', data.userVote);
    } catch (error) {
      console.error('❌ Error voting:', error);
    }
  }, [id, userVote]);

  const handleDownvote = useCallback(async () => {
    if (!checkAuth()) return;
    if (!id) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://uiu-talent-hunt-backend.onrender.com/api';
      let voteType = 'downvote';

      // If already downvoted, toggle it off
      if (userVote === 'downvote') {
        voteType = 'remove';
      }

      // Get or create a session user ID
      let sessionUserId = localStorage.getItem('sessionUserId');
      if (!sessionUserId) {
        sessionUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionUserId', sessionUserId);
      }

      const response = await fetch(`${apiUrl}/videos/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': sessionUserId
        },
        body: JSON.stringify({ voteType })
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      setUserVote(data.userVote);
      setUpvoteCount(data.upvotes || 0);
      setDownvoteCount(data.downvotes || 0);
      console.log('✅ Vote updated:', data.userVote);
    } catch (error) {
      console.error('❌ Error voting:', error);
    }
  }, [id, userVote]);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.round(rating));
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) {
        setError('No video ID provided');
        setLoading(false);
        return;
      }

      // Clear previous data
      setVideoData(null);
      setError(null);

      try {
        setLoading(true);
        console.log('📹 Fetching video with ID:', id);
        const apiUrl = import.meta.env.VITE_API_URL || 'https://uiu-talent-hunt-backend.onrender.com/api';

        // Try portal route first, fallback to content route
        let response = await fetch(`${apiUrl}/videos/${id}`);
        console.log('📹 Portal route response status:', response.status);

        // If portal route fails, try content route
        if (!response.ok) {
          console.log('📹 Trying content route instead...');
          response = await fetch(`${apiUrl}/content/${id}`);
          console.log('📹 Content route response status:', response.status);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Video fetch failed:', errorData);
          const errorMessage = errorData.error || errorData.message || 'Video not found';
          setError(errorMessage);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('📹 Video data received:', data);

        if (data.success && data.data) {
          const video = data.data;
          console.log('✅ Setting video data:', {
            title: video.title,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            views: video.views,
            likes: Array.isArray(video.likes) ? video.likes.length : video.likes
          });

          const videoDuration = video.duration || 0;
          setDuration(videoDuration);

          // Set vote counts
          setUpvoteCount(video.upvotes || 0);
          setDownvoteCount(video.downvotes || 0);

          // Set comments
          setComments(video.comments || []);

          setVideoData({
            id: video._id,
            title: video.title || 'Untitled Video',
            author: video.user?.fullName || video.user?.username || 'Unknown',
            authorHandle: `@${video.user?.username || 'unknown'}`,
            views: `${(video.views || 0).toLocaleString()}`,
            uploadedAt: video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Unknown date',
            likes: `${(Array.isArray(video.likes) ? video.likes.length : video.likes || 0).toLocaleString()}`,
            rating: video.rating || 4.8,
            description: video.description || 'No description available',
            tags: Array.isArray(video.tags) ? video.tags : [],
            duration: formatDuration(videoDuration),
            videoUrl: video.videoUrl || '',
            thumbnailUrl: video.thumbnailUrl || '',
          });
          setError(null);
        } else {
          console.error('❌ Invalid response format:', data);
          setError('Invalid response from server');
        }
      } catch (error) {
        console.error('❌ Error fetching video:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load video';
        setError(errorMessage);
        setVideoData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  // Reset view counted when video changes
  useEffect(() => {
    viewCountedRef.current = false;
    // Clear any pending view count timeout
    if (viewCountTimeoutRef.current) {
      clearTimeout(viewCountTimeoutRef.current);
      viewCountTimeoutRef.current = null;
    }
  }, [id]);

  // Set initial volume when video loads
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCommentTime = (dateString: string) => {
    const commentDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return commentDate.toLocaleDateString();
  };

  const handlePlayPause = useCallback(async () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);

    // Increment view count only once when video starts playing for the first time
    if (newPlayingState && !viewCountedRef.current && id && videoData) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://uiu-talent-hunt-backend.onrender.com/api';
        const endpoint = `${apiUrl}/videos/${id}/view`;
        console.log('📤 Incrementing view at endpoint:', endpoint);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ View increment failed with status', response.status, ':', errorData);
          throw new Error(`Failed to increment view: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ View counted for video:', id, 'New view count:', data.views);
        viewCountedRef.current = true;

        // Update local state to reflect new view count immediately in UI
        setVideoData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            views: `${data.views?.toLocaleString() || (parseInt(prev.views.replace(/,/g, '')) + 1).toLocaleString()}`
          };
        });
      } catch (error) {
        console.error('❌ Error incrementing view:', error);
      }
    }
  }, [isPlaying, id, videoData]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(Math.floor(percentage * duration));
  }, [duration]);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleCommentSubmit = useCallback(async () => {
    if (!checkAuth()) return;
    if (!commentText.trim()) return;
    if (!id) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/videos/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const data = await response.json();
      if (data.success && data.data.comments) {
        setComments(data.data.comments);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  }, [commentText, id, checkAuth]);

  return (
    <div className={styles.vPlayer}>
      <Navbar />
      <TabNavigation />

      <div className={styles.mainContent}>
        {/* Video Section */}
        <div className={styles.videoSection}>
          {/* Loading State */}
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Loading video...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
              <p>❌ {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {/* Video Content - Only show when data is loaded */}
          {!loading && !error && videoData && (
            <>
              {/* Video Player */}
              <div className={styles.videoContainer} ref={videoContainerRef}>
                <div className={styles.videoBackground}>
                  {/* Video Player */}
                  {videoData && videoData.videoUrl ? (
                    <video
                      ref={videoRef}
                      src={videoData.videoUrl}
                      poster={videoData.thumbnailUrl}
                      controls
                      className={styles.videoElement}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget;
                        setDuration(video.duration);
                        video.volume = 0.8; // Set initial volume to 80%
                      }}
                      onVolumeChange={(e) => {
                        const video = e.currentTarget;
                        setVolume(Math.round(video.volume * 100));
                      }}
                      onTimeUpdate={(e) => {
                        const video = e.currentTarget;
                        setCurrentTime(video.currentTime);
                      }}
                      onPlay={() => {
                        setIsPlaying(true);
                        // Increment view count after 3 seconds of continuous playback
                        if (!viewCountedRef.current && !viewCountTimeoutRef.current && id && videoData) {
                          console.log('⏱️ Starting 3-second timer for view count...');
                          viewCountTimeoutRef.current = setTimeout(async () => {
                            try {
                              const apiUrl = import.meta.env.VITE_API_URL || 'https://uiu-talent-hunt-backend.onrender.com/api';
                              const endpoint = `${apiUrl}/videos/${id}/view`;
                              console.log('📤 Incrementing view at endpoint:', endpoint);

                              const response = await fetch(endpoint, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' }
                              });

                              if (!response.ok) {
                                const errorData = await response.json().catch(() => ({}));
                                console.error('❌ View increment failed with status', response.status, ':', errorData);
                                throw new Error(`Failed to increment view: ${response.status}`);
                              }

                              const data = await response.json();
                              console.log('✅ View counted for video:', id, 'New view count:', data.views);
                              viewCountedRef.current = true;
                              viewCountTimeoutRef.current = null;

                              // Update local state to reflect new view count immediately in UI
                              setVideoData(prev => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  views: `${data.views?.toLocaleString() || (parseInt(prev.views.replace(/,/g, '')) + 1).toLocaleString()}`
                                };
                              });
                            } catch (error) {
                              console.error('❌ Error incrementing view:', error);
                              viewCountTimeoutRef.current = null;
                            }
                          }, 3000); // 3 seconds delay
                        }
                      }}
                      onPause={() => {
                        setIsPlaying(false);
                        // Cancel view count if user pauses before 3 seconds
                        if (viewCountTimeoutRef.current && !viewCountedRef.current) {
                          console.log('⏸️ Paused before 3 seconds - view not counted');
                          clearTimeout(viewCountTimeoutRef.current);
                          viewCountTimeoutRef.current = null;
                        }
                      }}
                    />
                  ) : (
                    <div className={styles.videoOverlay} />
                  )}

                  {/* Play/Pause Button */}
                  {(!videoData || !videoData.videoUrl) && (
                    <button className={styles.playButton} onClick={handlePlayPause}>
                      <span className="material-icons">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                  )}


                </div>
              </div>

              {/* Video Info */}
              {videoData && (
                <div className={styles.videoInfo}>
                  <h1 className={styles.videoTitle}>{videoData.title}</h1>

                  <div className={styles.videoMeta}>
                    <span className={styles.authorInfo}>
                      <div className={styles.authorAvatar} />
                      <span>{videoData.author}</span>
                    </span>
                    <span className={styles.separator}>•</span>
                    <span>{videoData.views} views</span>
                    <span className={styles.separator}>•</span>
                    <span>{videoData.uploadedAt}</span>
                  </div>

                  {/* Action Buttons - Upvote/Downvote Only */}
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.actionBtn} ${userVote === 'upvote' ? styles.voted : ''}`}
                      onClick={handleUpvote}
                      title={userVote === 'upvote' ? 'Remove upvote' : 'Upvote this video'}
                    >
                      <span style={{ fontSize: '1.3em' }}>👍</span>
                      <span>Upvote</span>
                      {upvoteCount > 0 && <span className={styles.voteCount}>({upvoteCount})</span>}
                    </button>
                    <button
                      className={`${styles.actionBtn} ${userVote === 'downvote' ? styles.voted : ''}`}
                      onClick={handleDownvote}
                      title={userVote === 'downvote' ? 'Remove downvote' : 'Downvote this video'}
                    >
                      <span style={{ fontSize: '1.3em' }}>👎</span>
                      <span>Downvote</span>
                      {downvoteCount > 0 && <span className={styles.voteCount}>({downvoteCount})</span>}
                    </button>
                  </div>

                  {/* Description */}
                  <div className={styles.descriptionSection}>
                    <button
                      className={styles.descriptionToggle}
                      onClick={() => setShowDescription(!showDescription)}
                    >
                      {showDescription ? 'Hide description' : 'Show description'}
                      <span className="material-icons">
                        {showDescription ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {showDescription && (
                      <div className={styles.description}>
                        <p>{videoData.description}</p>
                        <div className={styles.tags}>
                          {videoData.tags.map((tag, i) => (
                            <span key={i} className={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related Videos - Mobile */}
              <div className={styles.relatedVideosMobile}>
                <h3 className={styles.sectionTitle}>Related Videos</h3>
                <div className={styles.relatedGrid}>
                  {defaultRelatedVideos.map((video) => (
                    <div
                      key={video.id}
                      className={styles.relatedCard}
                      onClick={() => handleVideoClick(video.id)}
                    >
                      <div className={styles.relatedThumbnail}>
                        <span className={styles.videoDuration}>{video.duration}</span>
                      </div>
                      <div className={styles.relatedInfo}>
                        <h4>{video.title}</h4>
                        <span>{video.author}</span>
                        <span>{video.views} views • {renderStars(video.rating)} {video.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Comments Sidebar */}
        <aside className={styles.commentsSidebar}>
          <div className={styles.commentsHeader}>
            <h2>Comments</h2>
            <span className={styles.commentCount}>({comments.length})</span>
            <button className={styles.sortButton}>
              Top comments ▼
            </button>
          </div>

          <div className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={comment._id || index} className={styles.comment}>
                  <div
                    className={styles.commentAvatar}
                    style={{ background: comment.user?.avatar || 'linear-gradient(135deg, #4c8dff, #7fe2ff)' }}
                  >
                    {!comment.user?.avatar && (comment.user?.fullName?.[0] || '?')}
                  </div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <b>{comment.user?.fullName || comment.user?.username || 'Anonymous'}</b>
                      <span>{formatCommentTime(comment.createdAt)}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Comment Input */}
          <div className={styles.commentInput}>
            <div
              className={styles.commentAvatar}
              style={{ background: 'linear-gradient(135deg, #ff8a3c, #ffd56a)' }}
            />
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder={`Write a comment${localStorage.getItem('fullName') ? ' as ' + localStorage.getItem('fullName') : ''}...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
              />
              <button
                className={styles.sendButton}
                onClick={handleCommentSubmit}
              >
                ➤
              </button>
            </div>
          </div>

          {/* Related Videos - Desktop */}
          <div className={styles.relatedVideosDesktop}>
            <h3 className={styles.sectionTitle}>Up Next</h3>
            {relatedVideos && relatedVideos.length > 0 && relatedVideos.slice(0, 3).map((video) => (
              <div
                key={video.id}
                className={styles.relatedCardSmall}
                onClick={() => handleVideoClick(video.id)}
              >
                <div className={styles.relatedThumbnailSmall}>
                  <span className={styles.videoDuration}>{video.duration}</span>
                </div>
                <div className={styles.relatedInfoSmall}>
                  <h4>{video.title}</h4>
                  <span>{video.author}</span>
                  <span>{video.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <Footer />

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className={styles.loginModalOverlay} onClick={() => setShowLoginPrompt(false)}>
          <div className={styles.loginModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.loginModalTitle}>Like this video?</h3>
            <p className={styles.loginModalText}>Sign in to make your opinion count.</p>
            <button
              className={styles.loginModalButton}
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VPlayer;
