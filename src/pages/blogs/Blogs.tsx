import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import styles from '../../styles/Blogs.module.css';

interface Blog {
  _id: string;
  title: string;
  content: string;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  coverImage?: string;
  tags?: string[];
  reads?: number;
  createdAt: string;
}

const Blogs = () => {
  const navigate = useNavigate();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Fallback articles
  const fallbackArticles: Blog[] = [
    {
      _id: '1',
      title: 'How Open Mic Night Changed My Semester',
      content: 'A reflection on overcoming stage fright, sharing poetry with friends, and discovering the UIU Talent Hunt community.',
      user: { _id: '1', username: 'nafisa', fullName: 'Nafisa Rahman' },
      coverImage: '',
      tags: ['spoken-word', 'confidence', 'campus-life'],
      reads: 3900,
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Designing My First Talent Hunt Submission Page',
      content: 'A step-by-step breakdown of how we prototyped the video, audio, and blog portals using Figma and front-end code.',
      user: { _id: '2', username: 'nayeem', fullName: 'Md Nayeem Hoque' },
      coverImage: '',
      tags: ['ui-design', 'web-dev', 'how-to'],
      reads: 2700,
      createdAt: new Date().toISOString(),
    },
    {
      _id: '3',
      title: 'From Bedroom Recordings to UIU Studio Sessions',
      content: 'Tips for upgrading your audio setup on a student budget and preparing your first high-quality Talent Hunt track.',
      user: { _id: '3', username: 'arman', fullName: 'Arman Hossain' },
      coverImage: '',
      tags: ['audio-setup', 'recording', 'tips'],
      reads: 3100,
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/blogs?limit=20&page=1`);

        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setBlogs(data.data && data.data.length > 0 ? data.data : fallbackArticles);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setBlogs(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const onArticleClick = useCallback((articleId: string | number) => {
    navigate(`/blogs/${articleId}`);
  }, [navigate]);

  const truncateContent = (content: string, length: number = 150) => {
    if (!content) return '';
    return content.length > length ? content.substring(0, length) + '...' : content;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderArticleCard = (article: any) => (
    <div key={article._id || article.id} className={styles.articleCard} onClick={() => onArticleClick(article._id || article.id)}>
      <div className={styles.articleImage} style={{ backgroundColor: '#e5edf8' }} />
      <div className={styles.articleContent}>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <p className={styles.articleDescription}>{truncateContent(article.content || article.description || '')}</p>
        <div className={styles.articleMeta}>
          <span>by <b>{article.user?.fullName || article.author}</b> • {article.readTime || formatDate(article.createdAt)}</span>
        </div>
        <div className={styles.articleStats}>
          {article.views && <div className={styles.stat}><span className={styles.statIcon}>👁</span><span className={styles.statText}>{article.views} views</span></div>}
          {article.comments && <div className={styles.stat}><span className={styles.statIcon}>💬</span><span className={styles.statText}>{article.comments} comments</span></div>}
          {article.rating && <div className={styles.stat}><span className={styles.statIcon}>★</span><span className={styles.statText}>{article.rating} rating</span></div>}
        </div>
        <div className={styles.articleTags}>
          {(article.tags || []).map((tag: string, idx: number) => (
            <span key={idx} className={styles.tag}>{typeof tag === 'string' && tag.startsWith('#') ? tag : '#' + tag}</span>
          ))}
        </div>
        {article.category && <div className={styles.articleCategory}>{article.category}</div>}
      </div>
    </div>
  );

  return (
    <div className={styles.blogs}>
      <Navbar />
      <TabNavigation />
      
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Blog Portal</h1>
        <p className={styles.pageDescription}>
          Read stories, tutorials, reflections, and project write-ups from UIU talents. Blogs may include smart text, images, forms, and interactive content. Ratings and comments also contribute to the leaderboard.
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.articleGrid}>
          {blogs.map((article) => renderArticleCard(article))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blogs;
