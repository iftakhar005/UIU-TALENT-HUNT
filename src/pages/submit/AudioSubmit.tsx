import { useCallback, useState } from 'react';
import type { FunctionComponent } from 'react';
import styles from '../../styles/AudioSubmit.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';

const AudioSubmit: FunctionComponent = () => {
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();

  // Form state
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(['Music', 'Podcast']);
  const [tagInput, setTagInput] = useState('');
  const [transcript, setTranscript] = useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmitClick = useCallback(() => {
    // Validate form
    if (!title.trim()) {
      alert('Please provide a title for your audio track.');
      return;
    }
    if (!file) {
      alert('Please upload an audio file.');
      return;
    }
    if (tags.length === 0) {
      alert('Please add at least one tag.');
      return;
    }

    // Handle audio submission
    const formData = {
      title,
      file: file.name,
      fileSize: file.size,
      tags,
      transcript,
      submittedAt: new Date().toLocaleString(),
    };

    console.log('Submitting audio:', formData);
    alert('Audio submitted successfully!');

    // Reset form
    setTitle('');
    setFile(null);
    setTags(['Music', 'Podcast']);
    setTagInput('');
    setTranscript('');
  }, [title, file, tags, transcript]);

  const onSaveDraftClick = useCallback(() => {
    if (!title.trim()) {
      alert('Please provide a title before saving as draft.');
      return;
    }

    const draftData = {
      title,
      file: file?.name || null,
      tags,
      transcript,
      savedAt: new Date().toLocaleString(),
    };

    console.log('Saving draft:', draftData);
    localStorage.setItem('audioDraft', JSON.stringify(draftData));
    alert('Saved as draft!');
  }, [title, file, tags, transcript]);

  return (
    <>
      <Navbar />
      <div className={styles.aSubmit}>
        <div className={styles.main}>
          <div className={styles.paragraph}>
            <div className={styles.audioUpload}>Audio Upload</div>
            <div className={styles.streamlineYourAudio}>Streamline your audio submissions.</div>
          </div>

          <div className={styles.label}>
            <div className={styles.audioTrackTitle}>Audio Track Title</div>
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

          <div className={styles.audioFileUploader}>Audio File Uploader</div>
          <div className={styles.backgroundborder}>
            <input
              type="file"
              accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg"
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
                <div className={styles.mp3WavOgg}>MP3, WAV, OGG (Max 20MB)</div>
              </div>
            </label>
            {file && <div style={{ marginTop: '10px', fontSize: '14px', color: '#5d9bcc' }}>✓ {file.name}</div>}
          </div>

          <div className={styles.label2}>
            <div className={styles.categoriesTags}>Categories / Tags</div>
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
                    placeholder="e.g., Interview, Performance. Press Enter to add a tag."
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
            <div className={styles.audioTranscriptOr}>Audio Transcript or Summary</div>
            <div className={styles.border}>
              <div className={styles.textarea}>
                <textarea
                  placeholder="Provide a concise transcript or summary of your audio here..."
                  className={styles.textareaField}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
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

          <div className={styles.button9} onClick={onSubmitClick}>
            <div className={styles.container7}>
              <b className={styles.submitAudio}>Submit Audio</b>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AudioSubmit;
