import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FunctionComponent } from 'react';
import styles from '../../styles/AudioSubmit.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import { submissionAPI, CONTENT_CATEGORIES, type ContentCategory } from '../../services/api';

const AudioSubmit: FunctionComponent = () => {
  const navigate = useNavigate();
  const Navbar = useNavbar();
  const { Footer } = useFooter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ContentCategory>('music');
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      setError('Please provide a title for your audio track.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }
    if (!file) {
      setError('Please upload an audio file.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submissionAPI.submitAudio({
        audio: file,
        cover: coverImage || undefined,
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.join(','),
      });

      alert(result.message || 'Audio submitted for approval!');
      navigate('/my-submissions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit audio');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, category, file, coverImage, tags, navigate]);

  const onSaveDraftClick = useCallback(() => {
    if (!title.trim()) {
      alert('Please provide a title before saving as draft.');
      return;
    }

    const draftData = {
      title,
      description,
      category,
      file: file?.name || null,
      tags,
      savedAt: new Date().toLocaleString(),
    };

    localStorage.setItem('audioDraft', JSON.stringify(draftData));
    alert('Saved as draft!');
  }, [title, description, category, file, tags]);

  return (
    <>
      {Navbar}
      <div className={styles.aSubmit}>
        <div className={styles.main}>
          <div className={styles.paragraph}>
            <div className={styles.audioUpload}>Audio Upload</div>
            <div className={styles.streamlineYourAudio}>Submit your audio for review and approval.</div>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <div className={styles.label}>
            <div className={styles.audioTrackTitle}>Audio Track Title *</div>
            <div className={styles.input}>
              <div className={styles.container}>
                <input
                  type="text"
                  placeholder="Provide a descriptive title for your audio track."
                  className={styles.inputField}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.label}>
            <div className={styles.audioTrackTitle}>Category *</div>
            <div className={styles.input}>
              <div className={styles.container}>
                <select
                  className={styles.inputField}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ContentCategory)}
                  style={{ cursor: 'pointer' }}
                >
                  {CONTENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.audioFileUploader}>Audio File Uploader *</div>
          <div className={styles.backgroundborder}>
            <input
              type="file"
              accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/x-m4a"
              style={{ display: 'none' }}
              id="audioFile"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="audioFile" style={{ width: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div className={styles.button}>
                <div className={styles.container3}>
                  <b className={styles.browseFiles}>Browse Files</b>
                </div>
              </div>
              <div className={styles.paragraph2}>
                <div className={styles.audiotrack}>🎵</div>
                <b className={styles.dragDrop}>{`Drag & drop your audio file here, or click to upload`}</b>
                <div className={styles.mp3WavOgg}>MP3, WAV, OGG, M4A (Max 20MB)</div>
              </div>
            </label>
            {file && <div style={{ marginTop: '10px', fontSize: '14px', color: '#5d9bcc' }}>✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>}
          </div>

          <div className={styles.audioFileUploader}>Cover Image (Optional)</div>
          <div className={styles.backgroundborder}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              id="coverImage"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
            <label htmlFor="coverImage" style={{ width: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div className={styles.button}>
                <div className={styles.container3}>
                  <b className={styles.browseFiles}>Browse Images</b>
                </div>
              </div>
              <div className={styles.paragraph2}>
                <div className={styles.audiotrack}>🖼️</div>
                <b className={styles.dragDrop}>Upload a cover image for your audio</b>
                <div className={styles.mp3WavOgg}>JPG, PNG, WebP (Max 5MB)</div>
              </div>
            </label>
            {coverImage && <div style={{ marginTop: '10px', fontSize: '14px', color: '#5d9bcc' }}>✓ {coverImage.name}</div>}
          </div>

          <div className={styles.label2}>
            <div className={styles.categoriesTags}>Tags (Optional)</div>
            <div className={styles.backgroundborder2}>
              {tags.map((tag, index) => (
                <div key={index} className={styles.overlay}>
                  <div className={styles.music}>{tag}</div>
                  <button
                    className={styles.button2}
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveTag(index);
                    }}
                  >
                    <div className={styles.close}>✕</div>
                  </button>
                </div>
              ))}
              <div className={styles.input2}>
                <div className={styles.container4}>
                  <input
                    type="text"
                    placeholder="e.g., Original, Cover. Press Enter to add."
                    className={styles.tagInput}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleAddTag}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.container5}>
            <div className={styles.audioTranscriptOr}>Description *</div>
            <div className={styles.border}>
              <div className={styles.textarea}>
                <textarea
                  placeholder="Describe your audio submission. What is it about? What inspired you?"
                  className={styles.textareaField}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className={styles.backgroundhorizontalborder}>
                <div className={styles.button4}>
                  <div className={styles.formatBold}>B</div>
                </div>
                <div className={styles.button5}>
                  <div className={styles.formatItalic}>I</div>
                </div>
                <div className={styles.button6}>
                  <div className={styles.formatListBulleted}>≡</div>
                </div>
                <div className={styles.button7}>
                  <div className={styles.link}>🔗</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.button8} onClick={onSaveDraftClick}>
            <div className={styles.container6}>
              <b className={styles.saveAsDraft}>Save as Draft</b>
            </div>
          </div>

          <div
            className={styles.button9}
            onClick={onSubmitClick}
            style={{ opacity: isSubmitting ? 0.7 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}
          >
            <div className={styles.container7}>
              <b className={styles.submitAudio}>{isSubmitting ? 'Submitting...' : 'Submit Audio'}</b>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AudioSubmit;
