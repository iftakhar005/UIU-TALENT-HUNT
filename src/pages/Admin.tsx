import type { FunctionComponent } from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Admin.module.css';
import { adminAPI, type User } from '../services/api';

interface ContentRequest {
  _id: string;
  contentType: 'video' | 'audio' | 'blog';
  title: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  } | null;
  duration?: number;
  blogContent?: string;
  description: string;
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

/**
 * ADMIN DASHBOARD WORKFLOW:
 * 
 * 1. User submits content (Video/Audio/Blog) → Stored in ContentRequest collection with status='pending'
 * 2. Admin approves content:
 *    - Creates entry in Video/Audio/Blog collection (published content)
 *    - Updates ContentRequest status to 'approved'
 *    - Content becomes visible on public portals (VideosPage, AudiosPage, BlogsPage)
 * 3. Admin rejects content:
 *    - Updates ContentRequest status to 'rejected'
 *    - Content remains hidden from public
 * 
 * Database Flow:
 * ContentRequest (pending) → [Admin Approves] → Video/Audio/Blog collection (published) → Public Pages
 */

const Admin: FunctionComponent = () => {
  const navigate = useNavigate();
  const [contentRequests, setContentRequests] = useState<ContentRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('videos');

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      console.warn('⚠️ No authentication found. Redirecting to login...');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== 'admin') {
        alert('Admin access required!');
        navigate('/');
        return;
      }
    } catch (e) {
      console.error('Error parsing user:', e);
      navigate('/login');
      return;
    }

    if (activeSection === 'users') {
      fetchUsers();
    } else {
      fetchPendingContent();
    }
  }, [navigate, activeSection]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching users...');
      const data = await adminAPI.getUsers();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin' | 'judge') => {
    try {
      const data = await adminAPI.updateUserRole(userId, newRole);
      if (data.success) {
        setUsers(users.map(u => (u as any)._id === userId ? { ...u, role: newRole } : u));
        alert(`✅ Role updated to ${newRole}`);
      }
    } catch (error) {
      console.error('❌ Error updating role:', error);
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user and all their pending requests? This cannot be undone.')) {
      return;
    }

    try {
      const data = await adminAPI.deleteUser(userId);
      if (data.success) {
        setUsers(users.filter(u => (u as any)._id !== userId));
        alert('✅ User deleted successfully');
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('❌ No token found. Please log in.');
        alert('Please log in first');
        navigate('/login');
        return;
      }

      console.log('📋 Fetching pending content...');
      const data = await adminAPI.getPending();

      if (data.success) {
        console.log('✅ Loaded', data.requests?.length || 0, 'pending content requests');
        setContentRequests(data.requests || []);
      } else {
        console.error('❌ API returned success: false', data);
        const errorMsg = typeof data === 'object' && data !== null && 'message' in data
          ? (data as any).message
          : 'Failed to fetch content';
        alert('Error: ' + errorMsg);
      }
    } catch (error) {
      console.error('❌ Error fetching content requests:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch content';
      console.error('Error details:', error);
      alert('Failed to fetch content: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contentId: string) => {
    try {
      console.log('✅ Approving content:', contentId);
      const data = await adminAPI.approve(contentId);
      console.log('📋 Approve response:', data);

      if (data.success) {
        setContentRequests(contentRequests.filter(c => c._id !== contentId));
        alert('✅ Content approved successfully');
      } else {
        console.error('❌ Approve failed:', data);
        const errorMsg = typeof data === 'object' && data !== null && 'message' in data
          ? (data as any).message
          : 'Failed to approve content';
        alert('❌ Error: ' + errorMsg);
      }
    } catch (error) {
      console.error('❌ Error approving content:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });

      let errorMessage = 'Failed to approve content';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          errorMessage = 'Network error - check if backend is running and accessible';
        }
      }

      alert('Error approving content: ' + errorMessage);
    }
  };

  const handleReject = async (contentId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      console.log('❌ Rejecting content:', contentId);
      const data = await adminAPI.reject(contentId, reason);

      if (data.success) {
        setContentRequests(contentRequests.filter(c => c._id !== contentId));
        alert('✅ Content rejected successfully');
      } else {
        alert('❌ Error: ' + (data.message || 'Failed to reject content'));
      }
    } catch (error) {
      console.error('❌ Error rejecting content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject content';
      alert('Error rejecting content: ' + errorMessage);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const videoRequests = contentRequests.filter(c => c.contentType === 'video');
  const audioRequests = contentRequests.filter(c => c.contentType === 'audio');
  const blogRequests = contentRequests.filter(c => c.contentType === 'blog');


  return (
    <div className={styles.admin}>
      {/* Navbar Header - Like HomePage */}
      <div className={styles.header2}>
        <div className={styles.nav}>
          <div className={styles.uiuTalentHunt}>
            <img src="/school.svg" alt="UIU Logo" className={styles.logo} />
            <b>UIU Talent Hunt</b>
          </div>
          <div className={styles.input}>
            <input
              type="text"
              placeholder="Search entries..."
              className={styles.searchEntries}
            />
            <span className={`material-icons ${styles.search}`}>search</span>
          </div>
          <button className={styles.button2} onClick={handleLogout}>
            <div className={styles.login}>Logout</div>
          </button>
        </div>
      </div>

      {/* Main Content - Header + Sidebar */}
      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Admin Panel</h3>
            <p>Manage content & users</p>
          </div>

          <div className={styles.sidebarSection}>
            <h4>Content Management</h4>
            <div className={styles.menuItems}>
              <button
                className={`${styles.menuItem} ${activeSection === 'videos' ? styles.active : ''}`}
                onClick={() => setActiveSection('videos')}
              >
                <span>🎬</span> Video Portal
              </button>
              <button
                className={`${styles.menuItem} ${activeSection === 'audios' ? styles.active : ''}`}
                onClick={() => setActiveSection('audios')}
              >
                <span>🎧</span> Audio Portal
              </button>
              <button
                className={`${styles.menuItem} ${activeSection === 'blogs' ? styles.active : ''}`}
                onClick={() => setActiveSection('blogs')}
              >
                <span>📝</span> Blog Portal
              </button>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h4>Management</h4>
            <div className={styles.menuItems}>
              <button
                className={`${styles.menuItem} ${activeSection === 'users' ? styles.active : ''}`}
                onClick={() => setActiveSection('users')}
              >
                <span>👥</span> Users
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* Videos Section */}
          {activeSection === 'videos' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>🎬 Video Portal Management</h2>
                <p>Approve, reject, or remove video submissions</p>
              </div>

              {loading ? (
                <div className={styles.emptyState}>Loading video submissions...</div>
              ) : videoRequests.length === 0 ? (
                <div className={styles.emptyState}>No video submissions to review</div>
              ) : (
                <div className={styles.contentTable}>
                  {videoRequests.map((content) => (
                    <div key={content._id} className={styles.contentItem}>
                      <div className={styles.contentHeader}>
                        <h3>{content.title}</h3>
                        <span className={styles.badge}>VIDEO</span>
                      </div>
                      <div className={styles.contentMeta}>
                        <p><strong>By:</strong> @{content.user?.username || 'Unknown User'}</p>
                        <p><strong>Submitted:</strong> {new Date(content.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className={styles.contentActions}>
                        <button className={styles.approveBtn} onClick={() => handleApprove(content._id)}>
                          ✓ Approve
                        </button>
                        <button className={styles.rejectBtn} onClick={() => handleReject(content._id)}>
                          ✕ Reject
                        </button>
                        <button className={styles.deleteBtn}>
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Audios Section */}
          {activeSection === 'audios' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>🎧 Audio Portal Management</h2>
                <p>Approve, reject, or remove audio submissions</p>
              </div>

              {loading ? (
                <div className={styles.emptyState}>Loading audio submissions...</div>
              ) : audioRequests.length === 0 ? (
                <div className={styles.emptyState}>No audio submissions to review</div>
              ) : (
                <div className={styles.contentTable}>
                  {audioRequests.map((content) => (
                    <div key={content._id} className={styles.contentItem}>
                      <div className={styles.contentHeader}>
                        <h3>{content.title}</h3>
                        <span className={styles.badge}>AUDIO</span>
                      </div>
                      <div className={styles.contentMeta}>
                        <p><strong>By:</strong> @{content.user?.username || 'Unknown User'}</p>
                        <p><strong>Submitted:</strong> {new Date(content.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className={styles.contentActions}>
                        <button className={styles.approveBtn} onClick={() => handleApprove(content._id)}>
                          ✓ Approve
                        </button>
                        <button className={styles.rejectBtn} onClick={() => handleReject(content._id)}>
                          ✕ Reject
                        </button>
                        <button className={styles.deleteBtn}>
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Blogs Section */}
          {activeSection === 'blogs' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>📝 Blog Portal Management</h2>
                <p>Approve, reject, or remove blog submissions</p>
              </div>

              {loading ? (
                <div className={styles.emptyState}>Loading blog submissions...</div>
              ) : blogRequests.length === 0 ? (
                <div className={styles.emptyState}>No blog submissions to review</div>
              ) : (
                <div className={styles.contentTable}>
                  {blogRequests.map((content) => (
                    <div key={content._id} className={styles.contentItem}>
                      <div className={styles.contentHeader}>
                        <h3>{content.title}</h3>
                        <span className={styles.badge}>BLOG</span>
                      </div>
                      <div className={styles.contentMeta}>
                        <p><strong>By:</strong> @{content.user?.username || 'Unknown User'}</p>
                        <p><strong>Submitted:</strong> {new Date(content.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className={styles.contentActions}>
                        <button className={styles.approveBtn} onClick={() => handleApprove(content._id)}>
                          ✓ Approve
                        </button>
                        <button className={styles.rejectBtn} onClick={() => handleReject(content._id)}>
                          ✕ Reject
                        </button>
                        <button className={styles.deleteBtn}>
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'users' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>👥 User Management</h2>
                <p>Manage users, permissions, and accounts</p>
              </div>

              {loading ? (
                <div className={styles.emptyState}>Loading users...</div>
              ) : users.length === 0 ? (
                <div className={styles.emptyState}>No users found</div>
              ) : (
                <div className={styles.userList}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: any) => (
                        <tr key={user._id}>
                          <td>
                            <div className={styles.userInfo}>
                              <div
                                className={styles.userAvatarSmall}
                                style={{
                                  backgroundColor: user.role === 'admin' ? '#ef4444' : user.role === 'judge' ? '#3b82f6' : '#10b981'
                                }}
                              >
                                {user.fullName ? user.fullName[0].toUpperCase() : user.username[0].toUpperCase()}
                              </div>
                              <div>
                                <div className={styles.userName}>{user.fullName}</div>
                                <div className={styles.userLogin}>@{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <select
                              className={styles.roleSelect}
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value as any)}
                            >
                              <option value="user">User</option>
                              <option value="judge">Judge</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className={styles.deleteActionBtn}
                              onClick={() => handleDeleteUser(user._id)}
                              title="Delete User"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.developedByVoid}>Developed by VOID</div>
        <div className={styles.copyright2025By}>© Copyright 2025 by VOID. All rights reserved.</div>
      </div>
    </div>
  );
};

export default Admin;
