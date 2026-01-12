import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import useTabNavigation from '../../hooks/useTabNavigation';
import styles from '../../styles/AudioPlayer.module.css';

const AudioPlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const { TabNavigation } = useTabNavigation();
  
  const [audioData, setAudioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/audios/${id}`);
        
        if (!response.ok) throw new Error('Audio not found');
        
        const data = await response.json();
        if (data.data) {
          setAudioData(data.data);
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.aPlayer}>
        <Navbar />
        <TabNavigation />
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading audio...</div>
        <Footer />
      </div>
    );
  }

  if (!audioData) {
    return (
      <div className={styles.aPlayer}>
        <Navbar />
        <TabNavigation />
        <div style={{ padding: '40px', textAlign: 'center' }}>Audio not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.aPlayer}>
      <Navbar />
      <TabNavigation />
      <div className={styles.main}>
        <h1 className={styles.heading1}>{audioData.title}</h1>
        <p>By: {audioData.user?.fullName || audioData.user?.username}</p>
        
        {/* Audio Player */}
        <div style={{ margin: '30px 0', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
          <audio
            ref={audioRef}
            src={audioData.audioUrl}
            controls
            style={{ width: '100%' }}
          />
        </div>

        {/* Audio Info */}
        <div style={{ marginBottom: '20px' }}>
          {audioData.coverImage && (
            <img src={audioData.coverImage} alt={audioData.title} style={{ maxWidth: '200px', borderRadius: '8px' }} />
          )}
          <p><strong>Plays:</strong> {audioData.plays || 0}</p>
          <p><strong>Duration:</strong> {audioData.duration ? Math.floor(audioData.duration / 60) + ':' + (audioData.duration % 60).toString().padStart(2, '0') : 'N/A'}</p>
          {audioData.tags && audioData.tags.length > 0 && (
            <p><strong>Tags:</strong> {audioData.tags.map((tag: string) => `#${tag}`).join(', ')}</p>
          )}
          {audioData.description && (
            <p><strong>Description:</strong> {audioData.description}</p>
          )}
        </div>

        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff8a3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
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
