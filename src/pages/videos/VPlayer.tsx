import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import styles from '../../styles/VPlayer.module.css';

// Mock video data
const videoData = {
  id: '1',
  title: 'Quantum Superposition Explained in 5 Minutes',
  author: 'Manab',
  authorHandle: '@manabPhysics',
  views: '12.4K',
  uploadedAt: '3 hours ago',
  likes: '2.3K',
  rating: 4.8,
  description: `In this video, I break down the concept of quantum superposition in a way that's easy to understand. 
  
We'll explore how particles can exist in multiple states simultaneously and what this means for the future of computing and our understanding of reality.

Topics covered:
• What is superposition?
• Schrödinger's cat explained
• Real-world applications
• Quantum computing implications

Don't forget to like and subscribe for more physics content!`,
  tags: ['#physics', '#quantum', '#science', '#education'],
  duration: '5:23',
};

const comments = [
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

const relatedVideos = [
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
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(37);
  const [duration] = useState(323);
  const [volume, setVolume] = useState(80);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

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

  const handleCommentSubmit = useCallback(() => {
    if (commentText.trim()) {
      // Add comment logic here
      setCommentText('');
    }
  }, [commentText]);

  const handleVideoClick = useCallback((videoId: string) => {
    navigate(`/videos/${videoId}`);
  }, [navigate]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar && fullStars < 5) stars += '☆';
    stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
    return stars;
  };

  return (
    <div className={styles.vPlayer}>
      <Navbar />
      <TabNavigation />

      <div className={styles.mainContent}>
        {/* Video Section */}
        <div className={styles.videoSection}>
          {/* Video Player */}
          <div className={styles.videoContainer} ref={videoContainerRef}>
            <div className={styles.videoBackground}>
              {/* Video thumbnail/placeholder */}
              <div className={styles.videoOverlay} />
              
              {/* Play/Pause Button */}
              <button className={styles.playButton} onClick={handlePlayPause}>
                <span className="material-icons">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              {/* Cast Button */}
              <button className={styles.castButton}>
                <span className="material-icons">cast</span>
                <span>Cast</span>
              </button>

              {/* Video Controls */}
              <div className={styles.videoControls}>
                <span className={styles.timeDisplay}>{formatTime(currentTime)}</span>
                
                <div className={styles.progressBar} onClick={handleProgressClick}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <div 
                    className={styles.progressHandle}
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                
                <span className={styles.timeDisplay}>{formatTime(duration)}</span>

                {/* Volume Control */}
                <div 
                  className={styles.volumeControl}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button className={styles.controlButton}>
                    <span className="material-icons">
                      {volume === 0 ? 'volume_off' : volume < 50 ? 'volume_down' : 'volume_up'}
                    </span>
                  </button>
                  {showVolumeSlider && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className={styles.volumeSlider}
                    />
                  )}
                </div>

                {/* Fullscreen */}
                <button className={styles.controlButton} onClick={handleFullscreen}>
                  <span className="material-icons">
                    {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Video Info */}
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

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.actionBtn}>
                <span>👍</span>
                <span>{videoData.likes}</span>
              </button>
              <button className={styles.actionBtn}>
                <span>👎</span>
                <span>Dislike</span>
              </button>
              <button className={styles.actionBtn}>
                <span>💬</span>
                <span>Comments</span>
              </button>
              <button className={styles.actionBtn}>
                <span>🔗</span>
                <span>Share</span>
              </button>
              <button className={styles.actionBtn}>
                <span className={styles.ratingStars}>{renderStars(videoData.rating)}</span>
                <span>{videoData.rating}</span>
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

          {/* Related Videos - Mobile */}
          <div className={styles.relatedVideosMobile}>
            <h3 className={styles.sectionTitle}>Related Videos</h3>
            <div className={styles.relatedGrid}>
              {relatedVideos.map((video) => (
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
            {comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div 
                  className={styles.commentAvatar}
                  style={{ background: comment.avatar }}
                />
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <b>{comment.author}</b>
                    <span>{comment.time}</span>
                  </div>
                  <p>{comment.text}</p>
                  <div className={styles.commentActions}>
                    <button>👍 {comment.likes}</button>
                    <button>💬 Reply</button>
                  </div>
                </div>
              </div>
            ))}
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
                placeholder="Write a comment as Raihan..."
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
            {relatedVideos.slice(0, 3).map((video) => (
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
    </div>
  );
};

export default VPlayer;
