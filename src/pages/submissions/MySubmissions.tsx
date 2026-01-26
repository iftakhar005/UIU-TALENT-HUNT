import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { FunctionComponent } from 'react';
import styles from '../../styles/MySubmissions.module.css';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import { submissionAPI, authAPI, type ContentSubmission } from '../../services/api';

const MySubmissions: FunctionComponent = () => {
  const navigate = useNavigate();
  const Navbar = useNavbar();
  const { Footer } = useFooter();

  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<{
    status: string;
    contentType: string;
  }>({
    status: '',
    contentType: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Check if user is logged in
  useEffect(() => {
    if (!authAPI.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await submissionAPI.getMySubmissions({
        status: filter.status || undefined,
        contentType: filter.contentType || undefined,
        page: pagination.currentPage,
        limit: 10,
      });
      
      setSubmissions(result.submissions);
      setPagination({
        currentPage: result.pagination.page,
        totalPages: result.pagination.pages,
        totalItems: result.pagination.total
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.currentPage]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await submissionAPI.deleteSubmission(id);
      setSubmissions(submissions.filter(s => s._id !== id));
      alert('Submission deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete submission');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className={`${styles.badge} ${styles.pending}`}>⏳ Pending</span>;
      case 'approved':
        return <span className={`${styles.badge} ${styles.approved}`}>✅ Approved</span>;
      case 'rejected':
        return <span className={`${styles.badge} ${styles.rejected}`}>❌ Rejected</span>;
      default:
        return <span className={styles.badge}>{status}</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎬';
      case 'audio':
        return '🎵';
      case 'blog':
        return '📝';
      default:
        return '📄';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {Navbar}
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Submissions</h1>
            <Link to="/submit" className={styles.newButton}>
              + New Submission
            </Link>
          </div>

          <div className={styles.filters}>
            <select
              className={styles.filterSelect}
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className={styles.filterSelect}
              value={filter.contentType}
              onChange={(e) => setFilter({ ...filter, contentType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="blog">Blogs</option>
            </select>
          </div>

          {error && (
            <div className={styles.errorBox}>{error}</div>
          )}

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📭</span>
              <h3>No submissions yet</h3>
              <p>Start by submitting your first content!</p>
              <Link to="/submit" className={styles.emptyButton}>
                Submit Content
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.list}>
                {submissions.map((submission) => (
                  <div key={submission._id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.typeIcon}>
                        {getTypeIcon(submission.contentType)}
                      </span>
                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardTitle}>{submission.title}</h3>
                        <p className={styles.cardMeta}>
                          {submission.category} • Submitted {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>

                    <p className={styles.cardDescription}>
                      {submission.description?.substring(0, 150)}
                      {submission.description && submission.description.length > 150 ? '...' : ''}
                    </p>

                    {submission.tags && submission.tags.length > 0 && (
                      <div className={styles.cardTags}>
                        {submission.tags.map((tag, idx) => (
                          <span key={idx} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    )}

                    {submission.status === 'rejected' && submission.rejectionReason && (
                      <div className={styles.rejectionBox}>
                        <strong>Rejection Reason:</strong> {submission.rejectionReason}
                      </div>
                    )}

                    <div className={styles.cardActions}>
                      {submission.mediaUrl && (
                        <a 
                          href={submission.mediaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.viewButton}
                        >
                          View Media
                        </a>
                      )}
                      {submission.status === 'pending' && (
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(submission._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageButton}
                    disabled={pagination.currentPage === 1}
                    onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                  >
                    ← Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    className={styles.pageButton}
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MySubmissions;
