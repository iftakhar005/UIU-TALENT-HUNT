import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FunctionComponent } from 'react';
import styles from '../../styles/BlogSubmit.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import { submissionAPI, CONTENT_CATEGORIES, type ContentCategory } from '../../services/api';

const BlogSubmit: FunctionComponent = () => {
  const navigate = useNavigate();
  const { Navbar } = useNavbar();
  const { Footer } = useFooter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [category, setCategory] = useState<ContentCategory>('writing');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      setError('You must be logged in to submit a blog. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

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

  const wordCount = blogContent.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  const onSubmitClick = useCallback(async () => {
    setError('');
    
    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit a blog. Please login first.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    // Validate form
    if (!title.trim()) {
      setError('Please provide a title for your blog.');
      return;
    }
    if (blogContent.trim().length < 100) {
      setError('Blog content must be at least 100 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📝 Submitting blog...');
      const result = await submissionAPI.submitBlog({
        cover: coverImage || undefined,
        title: title.trim(),
        description: description.trim() || blogContent.substring(0, 200),
        category,
        tags: tags.join(','),
        blogContent: blogContent.trim(),
      });

      console.log('✅ Blog submitted successfully:', result);
      alert(result.message || 'Blog submitted for approval!');
      navigate('/my-submissions');
    } catch (err) {
      console.error('❌ Blog submission error:', err);
      let errorMessage = 'Failed to submit blog';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Check for authentication errors
        if (errorMessage.includes('Invalid token') || errorMessage.includes('Not authorized') || errorMessage.includes('401')) {
          errorMessage = 'Your session has expired. Please login again.';
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => navigate('/login'), 2000);
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, blogContent, category, coverImage, tags, navigate]);

  const onSaveDraftClick = useCallback(() => {
    if (!title.trim()) {
      alert('Please provide a title before saving as draft.');
      return;
    }

    const draftData = {
      title,
      description,
      blogContent,
      category,
      coverImage: coverImage?.name || null,
      tags,
      savedAt: new Date().toLocaleString(),
    };

    localStorage.setItem('blogDraft', JSON.stringify(draftData));
    alert('Saved as draft!');
  }, [title, description, blogContent, category, coverImage, tags]);

  return (
    <>
      <Navbar />
      <div className={styles.submitPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>📝 Write a Blog</h1>
            <p className={styles.subtitle}>Share your thoughts, stories, and creative writing.</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Blog Title *</label>
            <input
              type="text"
              placeholder="Give your blog an engaging title"
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
            <label className={styles.label}>Cover Image (Optional)</label>
            <div className={styles.uploadBox}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                id="coverImage"
                className={styles.fileInput}
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              />
              <label htmlFor="coverImage" className={styles.uploadLabel}>
                <span className={styles.uploadIcon}>🖼️</span>
                <span className={styles.uploadText}>
                  {coverImage ? coverImage.name : 'Upload a cover image'}
                </span>
                <span className={styles.uploadHint}>JPG, PNG, WebP (Max 5MB)</span>
              </label>
              {coverImage && (
                <div className={styles.fileInfo}>✓ {coverImage.name}</div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Short Description (Optional)</label>
            <input
              type="text"
              placeholder="A brief summary that will appear in previews"
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
            />
            <span className={styles.charCount}>{description.length}/300</span>
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
            <div className={styles.labelRow}>
              <label className={styles.label}>Blog Content *</label>
              <span className={styles.wordCount}>
                {wordCount} words • ~{readingTime} min read
              </span>
            </div>
            <textarea
              placeholder="Write your blog content here... (Minimum 100 characters)"
              className={styles.blogTextarea}
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              rows={15}
            />
            <div className={styles.editorToolbar}>
              <button type="button" className={styles.toolbarBtn} title="Bold">
                <strong>B</strong>
              </button>
              <button type="button" className={styles.toolbarBtn} title="Italic">
                <em>I</em>
              </button>
              <button type="button" className={styles.toolbarBtn} title="List">
                ≡
              </button>
              <button type="button" className={styles.toolbarBtn} title="Link">
                🔗
              </button>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              className={styles.draftButton}
              onClick={onSaveDraftClick}
              disabled={isSubmitting}
            >
              Save as Draft
            </button>
            <button 
              className={styles.submitButton}
              onClick={onSubmitClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Blog'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogSubmit;
