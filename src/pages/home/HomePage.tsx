import { Link, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import styles from '../../styles/HomePage.module.css';

const imgAbstractAi = "https://www.figma.com/api/mcp/asset/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6";
const imgAudioWave = "https://www.figma.com/api/mcp/asset/b2c3d4e5-f6g7-48h9-i0j1-k2l3m4n5o6p7";
const imgBlogCircuit = "https://www.figma.com/api/mcp/asset/c3d4e5f6-g7h8-49i0-j1k2-l3m4n5o6p7q8";

export default function HomePage() {
  const navigate = useNavigate();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();

  const onVideoClick = useCallback((videoId: number) => {
    navigate(`/videos/${videoId}`);
  }, [navigate]);

  const onAudioClick = useCallback((audioId: number) => {
    navigate(`/audios/${audioId}`);
  }, [navigate]);

  const onBlogClick = useCallback((blogId: number) => {
    navigate(`/blogs/${blogId}`);
  }, [navigate]);

  return (
    <div className={styles.home}>
      <Navbar />

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
          <h2 className={styles.heading2}>
            <span className={styles.trendingVideos}>Trending Videos</span>
          </h2>
          <div className={styles.section}>
            {[
              { id: 1, title: "Introduction to AI", desc: "Basics of AI" },
              { id: 2, title: "Introduction to A2", desc: "Basics of AI" },
              { id: 3, title: "Introduction to AI", desc: "Basics of AI" },
            ].map((item) => (
              <div 
                key={item.id} 
                className={styles.backgroundshadow2}
                onClick={() => onVideoClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  alt={item.title}
                  className={styles.abstractAiGlobeVisualizatio}
                  src={imgAbstractAi}
                />
                <h3 className={styles.heading3}>{item.title}</h3>
                <p className={styles.basicsOfAi}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Trending Audios Section */}
          <h2 className={styles.heading22}>
            <span className={styles.trendingAudios}>Trending Audios</span>
          </h2>
          <div className={styles.section2}>
            {[
              { id: 1, title: "Introduction to AI", author: "Author Name1" },
              { id: 2, title: "Introduction to A2", author: "Author Name1" },
              { id: 3, title: "Introduction to AI", author: "Author Name2" },
            ].map((item) => (
              <div 
                key={item.id} 
                className={styles.backgroundshadow2}
                onClick={() => onAudioClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  alt={item.title}
                  className={styles.goldAudioWaveform}
                  src={imgAudioWave}
                />
                <h3 className={styles.heading34}>{item.title}</h3>
                <p className={styles.authorName1}>{item.author}</p>
              </div>
            ))}
          </div>

          {/* Trending Blogs Section */}
          <h2 className={styles.heading23}>
            <span className={styles.trendingBlogs}>Trending Blogs</span>
          </h2>
          <div className={styles.section3}>
            {[
              {
                id: 1,
                title: "What is the Circuit Chars for AI",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
              },
              {
                id: 2,
                title: "Shield Team Digitasi Ciavinimints?",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
              },
              {
                id: 3,
                title: "AI Knowledges for AI Innovative Networks",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
              },
            ].map((item) => (
              <div 
                key={item.id} 
                className={styles.backgroundshadow8}
                onClick={() => onBlogClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  alt={item.title}
                  className={styles.aiTextOnACircuitBoardBac}
                  src={imgBlogCircuit}
                />
                <h3 className={styles.heading37}>{item.title}</h3>
                <p className={styles.loremIpsumDolor}>{item.desc}</p>
                <a href="#" className={styles.link4} onClick={(e) => e.preventDefault()}>
                  <span className={styles.readMore}>Read More</span>
                  <span className="material-icons" style={{ fontSize: '16px' }}>
                    arrow_forward
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
