import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FunctionComponent } from 'react';
import styles from '../../styles/VideoSubmit.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import { submissionAPI, CONTENT_CATEGORIES, type ContentCategory } from '../../services/api';

const VideoSubmit: FunctionComponent = () => {
  const navigate = useNavigate();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ContentCategory>('film');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmitClick = useCallback(async () => {
    setError('');
    
    // Validate form
    if (!title.trim()) {
      setError('Please provide a title for your video.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }
    if (!file) {
      setError('Please upload a video file.');
      return;
    }

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file size must be less than 100MB.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      // Simulate progress (actual progress would need XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await submissionAPI.submitVideo({
        video: file,
        thumbnail: thumbnail || undefined,
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.join(','),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      alert(result.message || 'Video submitted for approval!');
      navigate('/my-submissions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit video');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, category, file, thumbnail, tags, navigate]);

  return (
    <>
      <Navbar />
      <div className={styles.submitPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>🎬 Video Upload</h1>
            <p className={styles.subtitle}>Submit your video for review and approval.</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Video Title *</label>
            <input
              type="text"
              placeholder="Give your video an engaging title"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Category *</label>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value as ContentCategory)}
            >
              {CONTENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Video File *</label>
            <div className={styles.uploadBox}>
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                id="videoFile"
                className={styles.fileInput}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="videoFile" className={styles.uploadLabel}>
                <span className={styles.uploadIcon}>🎥</span>
                <span className={styles.uploadText}>
                  {file ? file.name : 'Click to upload or drag & drop'}
                </span>
                <span className={styles.uploadHint}>MP4, MOV, AVI, WebM (Max 100MB)</span>
              </label>
              {file && (
                <div className={styles.fileInfo}>
                  ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Thumbnail (Optional)</label>
            <div className={styles.uploadBox}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                id="thumbnailFile"
                className={styles.fileInput}
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              />
              <label htmlFor="thumbnailFile" className={styles.uploadLabel}>
                <span className={styles.uploadIcon}>🖼️</span>
                <span className={styles.uploadText}>
                  {thumbnail ? thumbnail.name : 'Upload a thumbnail'}
                </span>
                <span className={styles.uploadHint}>JPG, PNG, WebP (Max 5MB)</span>
              </label>
              {thumbnail && (
                <div className={styles.fileInfo}>✓ {thumbnail.name}</div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tags (Optional)</label>
            <div className={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                  <button
                    className={styles.tagRemove}
                    onClick={() => handleRemoveTag(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Type and press Enter to add tags"
                className={styles.tagInput}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleAddTag}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <textarea
              placeholder="Describe your video. What is it about? What inspired you?"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          {isSubmitting && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className={styles.progressText}>Uploading... {uploadProgress}%</span>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button 
              className={styles.submitButton}
              onClick={onSubmitClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Uploading...' : 'Submit Video'}
            </button>
            <button 
              className={styles.cancelButton}
              onClick={() => navigate('/submit')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VideoSubmit;
