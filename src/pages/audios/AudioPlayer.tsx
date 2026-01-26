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
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading audio...</div>
        <Footer />
      </div>
    );
  }

  if (!audioData) {
    return (
      <div className={styles.aPlayer}>
        <Navbar />
        <TabNavigation />
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>Audio not found</div>
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
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {audioData.category || 'Music'}
            </span>
          </div>
          <h1 className={styles.heading1}>{audioData.title}</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            By <strong>{audioData.user?.fullName || audioData.user?.username}</strong> •
            Published on {formatDate(audioData.createdAt)} •
            {audioData.plays || 0} plays
          </p>
        </div>

        {/* Cover Image & Audio Player Section */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {audioData.thumbnailUrl && (
            <div style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img
                src={audioData.thumbnailUrl}
                alt={audioData.title}
                style={{
                  maxWidth: '300px',
                  width: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}
          <audio
            ref={audioRef}
            src={audioData.audioUrl}
            controls
            style={{
              width: '100%',
              outline: 'none'
            }}
          />
        </div>

        {/* Upvote/Downvote Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Your Feedback</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleUpvote}
              style={{
                padding: '12px 24px',
                backgroundColor: userVote === 'upvote' ? '#3b82f6' : '#f3f4f6',
                color: userVote === 'upvote' ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.3em' }}>👍</span>
              <span>Upvote</span>
              {upvoteCount > 0 && <span>({upvoteCount})</span>}
            </button>
            <button
              onClick={handleDownvote}
              style={{
                padding: '12px 24px',
                backgroundColor: userVote === 'downvote' ? '#ef4444' : '#f3f4f6',
                color: userVote === 'downvote' ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
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
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>Description</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{audioData.description}</p>
          </div>
        )}

        {/* Tags */}
        {audioData.tags && audioData.tags.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {audioData.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#e0e7ff',
                    color: '#4f46e5',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Box */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <img
            src={audioData.user.avatar || 'https://via.placeholder.com/64x64'}
            alt={audioData.user.fullName}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>CREATED BY</p>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{audioData.user.fullName}</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>{audioData.user.bio || 'UIU Talent Hunt contributor'}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>
            Comments ({audioData.comments?.length || 0})
          </h2>

          {/* Comment Form */}
          <div className={styles.commentForm}>
            <div
              className={styles.userAvatar}
              style={{
                background: 'linear-gradient(135deg, #ff8a3c, #ffd56a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              {localStorage.getItem('fullName')?.[0] || '?'}
            </div>
            <div className={styles.formContent}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button
                  className={styles.sendButton}
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className={styles.commentsList}>
            {audioData.comments && Array.isArray(audioData.comments) && audioData.comments.length > 0 ? (
              audioData.comments.map((comment) => (
                <div key={comment._id} className={styles.comment}>
                  <div
                    className={styles.commentAvatar}
                    style={{
                      background: comment.user?.avatar || 'linear-gradient(135deg, #4c8dff, #7fe2ff)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    {!comment.user?.avatar && (comment.user?.fullName?.[0] || '?')}
                  </div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <strong className={styles.commentAuthor}>
                        {comment.user?.fullName || comment.user?.username || 'Anonymous'}
                      </strong>
                      <span className={styles.commentTime}>{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ff8a3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '30px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          Go Back
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default AudioPlayer;
