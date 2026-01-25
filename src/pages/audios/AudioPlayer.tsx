import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import styles from '../../styles/AudioPlayer.module.css';

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

interface AudioData {
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
    avatar?: string;
    bio?: string;
  };
  category?: string;
  tags?: string[];
  plays?: number;
  averageRating?: number;
  totalRatings?: number;
  ratings?: Array<{
    user: string;
    rating: number;
    createdAt: string;
  }>;
  comments?: Comment[];
  createdAt: string;
}

const AudioPlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [playCounted, setPlayCounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Track when audio starts playing and increment play count once
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || playCounted || !id) return;

    const handlePlay = async () => {
      if (!playCounted) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          await fetch(`${apiUrl}/audios/${id}/play`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          setPlayCounted(true);
          console.log('\u2705 Play counted for audio:', id);
        } catch (error) {
          console.error('\u274c Error incrementing play:', error);
        }
      }
    };

    audio.addEventListener('play', handlePlay);
    return () => audio.removeEventListener('play', handlePlay);
  }, [id, playCounted]);

  useEffect(() => {
    const fetchAudio = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/audios/${id}`);

        if (!response.ok) throw new Error('Audio not found');

        const data = await response.json();
        if (data.data) {
          setAudioData(data.data);
          setUpvoteCount(data.data.upvotes || 0);
          setDownvoteCount(data.data.downvotes || 0);

          // Check if user has already voted
          const sessionUserId = localStorage.getItem('sessionUserId');
          if (sessionUserId && data.data.upvotedBy) {
            if (data.data.upvotedBy.includes(sessionUserId)) {
              setUserVote('upvote');
            } else if (data.data.downvotedBy && data.data.downvotedBy.includes(sessionUserId)) {
              setUserVote('downvote');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [id]);

  // Reset play counted when audio changes
  useEffect(() => {
    setPlayCounted(false);
  }, [id]);

  const handleUpvote = async () => {
    if (!id) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      let voteType = userVote === 'upvote' ? 'remove' : 'upvote';
      let sessionUserId = localStorage.getItem('sessionUserId');
      if (!sessionUserId) {
        sessionUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionUserId', sessionUserId);
      }
      const response = await fetch(`${apiUrl}/audios/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': sessionUserId },
        body: JSON.stringify({ voteType })
      });
      if (!response.ok) throw new Error('Failed to vote');
      const data = await response.json();
      setUserVote(data.userVote);
      setUpvoteCount(data.upvotes || 0);
      setDownvoteCount(data.downvotes || 0);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDownvote = async () => {
    if (!id) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      let voteType = userVote === 'downvote' ? 'remove' : 'downvote';
      let sessionUserId = localStorage.getItem('sessionUserId');
      if (!sessionUserId) {
        sessionUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionUserId', sessionUserId);
      }
      const response = await fetch(`${apiUrl}/audios/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': sessionUserId },
        body: JSON.stringify({ voteType })
      });
      if (!response.ok) throw new Error('Failed to vote');
      const data = await response.json();
      setUserVote(data.userVote);
      setUpvoteCount(data.upvotes || 0);
      setDownvoteCount(data.downvotes || 0);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to comment');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/audios/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });

      const data = await response.json();

      if (response.ok) {
        setAudioData(data.data);
        setNewComment('');
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className={styles.aPlayer}>
        <Navbar />
        <TabNavigation />
        <div className={styles.loadingState}>Loading audio...</div>
        <Footer />
      </div>
    );
  }

  if (!audioData) {
    return (
      <div className={styles.aPlayer}>
        <Navbar />
        <TabNavigation />
        <div className={styles.errorState}>Audio not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.aPlayer}>
      <Navbar />
      <TabNavigation />
      <div className={styles.main}>
        {/* Header Section */}
        <div style={{ marginBottom: '30px', animation: 'fadeInUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span className={styles.modernBadge}>
              {audioData.category || 'Music'}
            </span>
          </div>
          <h1 className={styles.heading1}>{audioData.title}</h1>
          <p className={styles.headerText}>
            By <strong style={{ color: '#1e293b' }}>{audioData.user?.fullName || audioData.user?.username}</strong> •
            Published on {formatDate(audioData.createdAt)} •
            <strong style={{ color: '#667eea' }}>{audioData.plays || 0}</strong> plays
          </p>
        </div>

        {/* Audio Player Section */}
        <div className={styles.modernPlayerCard}>
          <audio
            ref={audioRef}
            src={audioData.audioUrl}
            controls
          />
        </div>

        {/* Upvote/Downvote Section */}
        <div className={styles.glassmorphicCard}>
          <h3 className={styles.sectionTitle}>Your Feedback</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={handleUpvote}
              className={userVote === 'upvote' ? styles.gradientButton : styles.gradientButton}
              style={{
                opacity: userVote === 'upvote' ? 1 : 0.7,
                background: userVote === 'upvote' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <span style={{ fontSize: '1.3em' }}>👍</span>
              <span>Upvote</span>
              {upvoteCount > 0 && <span>({upvoteCount})</span>}
            </button>
            <button
              onClick={handleDownvote}
              className={userVote === 'downvote' ? styles.gradientButtonDanger : styles.gradientButtonDanger}
              style={{
                opacity: userVote === 'downvote' ? 1 : 0.7,
                background: userVote === 'downvote' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <span style={{ fontSize: '1.3em' }}>👎</span>
              <span>Downvote</span>
              {downvoteCount > 0 && <span>({downvoteCount})</span>}
            </button>
          </div>
        </div>

        {/* Description Section */}
        {audioData.description && (
          <div className={styles.glassmorphicCard}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.descriptionText}>{audioData.description}</p>
          </div>
        )}

        {/* Tags */}
        {audioData.tags && audioData.tags.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {audioData.tags.map((tag: string, idx: number) => (
                <span key={idx} className={styles.modernTag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Box */}
        <div className={styles.authorCard}>
          <img
            src={audioData.user.avatar || 'https://via.placeholder.com/80x80'}
            alt={audioData.user.fullName}
            className={styles.authorAvatar}
          />
          <div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', letterSpacing: '1px', fontWeight: '600' }}>CREATED BY</p>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', color: '#f1f5f9' }}>{audioData.user.fullName}</h3>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>{audioData.user.bio || 'UIU Talent Hunt contributor'}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className={styles.glassmorphicCard}>
          <h2 className={styles.sectionTitle}>
            Comments ({audioData.comments?.length || 0})
          </h2>

          {/* Comment Form */}
          <div style={{ marginBottom: '30px', display: 'flex', gap: '16px' }}>
            <img
              src="https://via.placeholder.com/48x48"
              alt="Your avatar"
              className={styles.commentAvatar}
            />
            <div style={{ flex: 1 }}>
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={styles.modernTextarea}
              />
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim()}
                className={styles.gradientButton}
                style={{
                  marginTop: '12px',
                  opacity: newComment.trim() ? 1 : 0.5,
                  cursor: newComment.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Post Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          {audioData.comments && audioData.comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {audioData.comments.map((comment) => (
                <div key={comment._id} className={styles.modernCommentCard} style={{ display: 'flex', gap: '16px' }}>
                  <img
                    src={comment.user?.avatar || 'https://via.placeholder.com/48x48'}
                    alt={comment.user?.fullName || 'User'}
                    className={styles.commentAvatar}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <strong className={styles.commentAuthor}>
                        {comment.user?.fullName || comment.user?.username || 'Anonymous'}
                      </strong>
                      <span className={styles.commentTime}>{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px', fontSize: '15px' }}>
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          ← Go Back
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default AudioPlayer;
