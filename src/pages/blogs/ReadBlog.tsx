import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import styles from '../../styles/ReadBlog.module.css';

interface BlogContent {
  _id: string;
  title: string;
  category: string;
  content: string;
  coverImageUrl?: string;
  tags?: string[];
  reads?: number;
  views?: number;
  readingTime?: number;
  averageRating?: number;
  totalRatings?: number;
  ratings?: Array<{
    user: string;
    rating: number;
    createdAt: string;
  }>;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
    bio?: string;
  };
  comments?: Array<{
    _id?: string;
    user: {
      _id: string;
      username: string;
      fullName: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

const ReadBlog = () => {
  const { id } = useParams<{ id: string }>();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  const [blog, setBlog] = useState<BlogContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/blogs/${id}`);

        if (!response.ok) throw new Error('Failed to fetch blog');

        const data = await response.json();
        setBlog(data.data);
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
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.readBlog}>
        <Navbar />
        <TabNavigation />
        <div className={styles.mainContent}>
          <div className={styles.container}>
            <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={styles.readBlog}>
        <Navbar />
        <TabNavigation />
        <div className={styles.mainContent}>
          <div className={styles.container}>
            <p style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
              {error || 'Blog not found'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to comment');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/blogs/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });

      const data = await response.json();

      if (response.ok) {
        setBlog(data.data);
        setNewComment('');
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    }
  };

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
      const response = await fetch(`${apiUrl}/blogs/${id}/vote`, {
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
      const response = await fetch(`${apiUrl}/blogs/${id}/vote`, {
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

  return (
    <div className={styles.readBlog}>
      <Navbar />
      <TabNavigation />

      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <span className={styles.category}>{blog.category}</span>
            <h1 className={styles.title}>{blog.title}</h1>
            <p className={styles.meta}>
              By {blog.user.fullName} • Published on {formatDate(blog.createdAt)} • {blog.readingTime || 5} min read
            </p>

            {/* Upvote/Downvote */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <button
                onClick={handleUpvote}
                style={{
                  padding: '10px 20px',
                  backgroundColor: userVote === 'upvote' ? '#3b82f6' : '#f3f4f6',
                  color: userVote === 'upvote' ? 'white' : '#4b5563',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '1.2em' }}>👍</span>
                <span>Upvote</span>
                {upvoteCount > 0 && <span>({upvoteCount})</span>}
              </button>
              <button
                onClick={handleDownvote}
                style={{
                  padding: '10px 20px',
                  backgroundColor: userVote === 'downvote' ? '#ef4444' : '#f3f4f6',
                  color: userVote === 'downvote' ? 'white' : '#4b5563',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '1.2em' }}>👎</span>
                <span>Downvote</span>
                {downvoteCount > 0 && <span>({downvoteCount})</span>}
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {blog.coverImageUrl && (
            <img src={blog.coverImageUrl} alt={blog.title} className={styles.featuredImage} />
          )}

          {/* Article Content */}
          <div className={styles.article}>
            {blog.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Author Box */}
          <div className={styles.authorBox}>
            <img
              src={blog.user.avatar || 'https://via.placeholder.com/56x56'}
              alt={blog.user.fullName}
              className={styles.authorAvatar}
            />
            <div className={styles.authorInfo}>
              <p className={styles.authorLabel}>WRITTEN BY</p>
              <h3 className={styles.authorName}>{blog.user.fullName}</h3>
              <p className={styles.authorBio}>{blog.user.bio || 'UIU Talent Hunt contributor'}</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Comments Section */}
          <div className={styles.commentsSection}>
            <h2 className={styles.commentsTitle}>Comments ({blog.comments?.length || 0})</h2>

            {/* Comment Form */}
            <div className={styles.commentForm}>
              <img
                src="https://via.placeholder.com/40x40"
                alt="Your avatar"
                className={styles.userAvatar}
              />
              <div className={styles.formContent}>
                <textarea
                  className={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className={styles.submitButton}
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment, idx) => (
                <div key={comment._id || idx} className={styles.comment}>
                  <img
                    src={comment.user?.avatar || 'https://via.placeholder.com/40x40'}
                    alt={comment.user?.fullName || 'User'}
                    className={styles.commentAvatar}
                  />
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
      </div>

      <Footer />
    </div>
  );
};

export default ReadBlog;
