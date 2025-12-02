import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavbar from '../hooks/useNavbar';
import useFooter from '../hooks/useFooter';
import styles from '../styles/SubmitEntry.module.css';

const SubmitEntry = () => {
  const navigate = useNavigate();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { id: 'video', label: 'Video', icon: '🎬' },
    { id: 'audio', label: 'Audio', icon: '🎵' },
    { id: 'blog', label: 'Blog', icon: '📝' },
  ];

  const handleSelect = useCallback((optionId: string) => {
    setSelectedOption(optionId);
    setIsOpen(false);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedOption) {
      alert('Please select an option');
      return;
    }
    // Navigate to the appropriate submission page
    navigate(`/submit/${selectedOption}`);
  }, [selectedOption, navigate]);

  const selectedLabel = options.find(opt => opt.id === selectedOption)?.label;

  return (
    <div className={styles.submitEntry}>
      <Navbar />
      
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Submit Your Talent</h1>
          <p className={styles.subheading}>Choose the type of content you want to submit</p>

          <div className={styles.selectionBox}>
            <div 
              className={styles.selectButton}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={styles.selectText}>
                {selectedLabel || '--------Select--------'}
              </span>
              <span className={styles.selectArrow}>▲</span>
            </div>

            {isOpen && (
              <div className={styles.dropdownMenu}>
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={`${styles.option} ${selectedOption === option.id ? styles.selected : ''}`}
                    onClick={() => handleSelect(option.id)}
                  >
                    <span className={styles.optionIcon}>{option.icon}</span>
                    <span className={styles.optionLabel}>{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            className={styles.nextButton}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubmitEntry;
