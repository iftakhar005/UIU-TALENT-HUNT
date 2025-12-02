import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/TabNavigation.module.css';

export default function useTabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const TabNavigation = () => (
    <div className={styles.tabContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${isActive('/blogs') ? styles.active : ''}`}
          onClick={() => navigate('/blogs')}
        >
          Blogs
        </button>
        <button
          className={`${styles.tab} ${isActive('/audios') ? styles.active : ''}`}
          onClick={() => navigate('/audios')}
        >
          Audio
        </button>
        <button
          className={`${styles.tab} ${isActive('/videos') ? styles.active : ''}`}
          onClick={() => navigate('/videos')}
        >
          Video
        </button>
      </div>
      <div className={styles.underline} />
    </div>
  );

  return { TabNavigation };
}
