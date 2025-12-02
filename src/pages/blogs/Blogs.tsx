import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import styles from '../../styles/Blogs.module.css';

const Blogs = () => {
  const navigate = useNavigate();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();

  const articles = [
    {
      id: 1,
      title: 'How Open Mic Night Changed My Semester',
      description: 'A reflection on overcoming stage fright, sharing poetry with friends, and discovering the UIU Talent Hunt community.',
      author: 'Nafisa Rahman',
      readTime: '6 min read',
      views: '3.9K',
      comments: '145',
      rating: '4.8',
      tags: ['#spoken-word', '#confidence', '#campus-life'],
      category: 'Student Life',
    },
    {
      id: 2,
      title: 'Designing My First Talent Hunt Submission Page',
      description: 'A step-by-step breakdown of how we prototyped the video, audio, and blog portals using Figma and front-end code.',
      author: 'Md Nayeem Hoque',
      readTime: '8 min read',
      views: '2.7K',
      comments: '98',
      rating: '4.6',
      tags: ['#ui-design', '#web-dev', '#how-to'],
      category: 'Tech & Creativity',
    },
    {
      id: 3,
      title: 'From Bedroom Recordings to UIU Studio Sessions',
      description: 'Tips for upgrading your audio setup on a student budget and preparing your first high-quality Talent Hunt track.',
      author: 'Arman Hossain',
      readTime: '7 min read',
      views: '3.1K',
      comments: '120',
      rating: '4.9',
      tags: ['#audio-setup', '#recording', '#tips'],
      category: 'Music',
    },
    {
      id: 4,
      title: 'Balancing Classes, Research, and Creativity',
      description: 'Time-management strategies that help keep assignments, lab work, and Talent Hunt projects moving together.',
      author: 'Sarah Rahman',
      readTime: '5 min read',
      views: '4.2K',
      comments: '160',
      rating: '4.7',
      tags: ['#productivity', '#student-life'],
      category: 'Productivity',
    },
    {
      id: 5,
      title: 'Writing "Last Bus from UIU"',
      description: 'Behind-the-scenes notes on scriptwriting, casting, and recording the audio drama that became a campus favorite.',
      author: 'Drama & Media Society',
      readTime: '9 min read',
      views: '3.6K',
      comments: '210',
      rating: '4.9',
      tags: ['#scriptwriting', '#audio-drama', '#behind-the-scenes'],
      category: 'Storytelling',
    },
    {
      id: 6,
      title: 'How to Prepare a Strong Talent Hunt Submission',
      description: 'A checklist covering thumbnails, descriptions, tags, and smart-text elements so judges and viewers notice your work.',
      author: 'UIU Talent Hunt Team',
      readTime: '10 min read',
      views: '5.0K',
      comments: '260',
      rating: '4.6',
      tags: ['#guide', '#submission', '#tips'],
      category: 'Guides',
    },
  ];

  const onArticleClick = useCallback((articleId: number) => {
    navigate(`/blogs/${articleId}`);
  }, [navigate]);

  const renderArticleCard = (article: typeof articles[0]) => (
    <div key={article.id} className={styles.articleCard} onClick={() => onArticleClick(article.id)}>
      <div className={styles.articleImage} style={{ backgroundColor: '#e5edf8' }} />
      <div className={styles.articleContent}>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <p className={styles.articleDescription}>{article.description}</p>
        <div className={styles.articleMeta}>
          <span>by <b>{article.author}</b> • {article.readTime}</span>
        </div>
        <div className={styles.articleStats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>👁</span>
            <span className={styles.statText}>{article.views} views</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>💬</span>
            <span className={styles.statText}>{article.comments} comments</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>★</span>
            <span className={styles.statText}>{article.rating} rating</span>
          </div>
        </div>
        <div className={styles.articleTags}>
          {article.tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <div className={styles.articleCategory}>{article.category}</div>
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
          {articles.map((article) => renderArticleCard(article))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blogs;
