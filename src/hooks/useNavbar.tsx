import { useCallback, useState, useEffect, useRef } from 'react';
import styles from '../styles/HomePage.module.css';
import { useNavigate } from 'react-router-dom';

export default function useNavbar(showSearch: boolean = false) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
    
    if (loggedInStatus) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('🔐 User data from localStorage:', parsedUser);
        setUser(parsedUser);
      }
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfileMenu]);

  const onLoginTextClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const onSignUpClick = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  const onSubmitEntryClick = useCallback(() => {
    navigate('/submit');
  }, [navigate]);

  const onLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const onLogout = useCallback(() => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileMenu(false);
    navigate('/');
  }, [navigate]);

  const onProfileClick = useCallback(() => {
    navigate('/profile');
    setShowProfileMenu(false);
  }, [navigate]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      '#667eea', // blue-purple
      '#764ba2', // purple
      '#f093fb', // pink
      '#4facfe', // bright blue
      '#43e97b', // green
      '#fa709a', // red-pink
      '#fee140', // yellow
      '#30cfd0', // cyan
      '#a8edea', // light cyan
      '#fed6e3'  // light pink
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const Navbar = () => (
    <div className={styles.header2}>
      <div className={styles.nav}>
        <div className={styles.uiuTalentHunt} onClick={onLogoClick} style={{ cursor: 'pointer' }}>
          <img src="/school.svg" alt="UIU Logo" className={styles.logo} />
          <b>UIU Talent Hunt</b>
        </div>
        {showSearch && (
          <div className={styles.input}>
            <input
              type="text"
              placeholder="Search entries..."
              className={styles.searchEntries}
            />
            <span className={`material-icons ${styles.search}`}>search</span>
          </div>
        )}
        
        {/* Spacer to push items to the right when search is hidden */}
        {!showSearch && <div style={{ flex: 1 }} />}
        
        <button className={styles.leaderboardBtn} onClick={() => navigate('/leaderboard')}>
          <span className="material-icons">leaderboard</span>
          Leaderboard
        </button>
        {isLoggedIn && (
          <button className={styles.button3} onClick={onSubmitEntryClick}>
            <div className={styles.submitEntry}>Submit Entry</div>
          </button>
        )}
        
        {!isLoggedIn ? (
          <>
            <button className={styles.button2}>
              <div className={styles.login} onClick={onLoginTextClick}>
                Login
              </div>
            </button>
            <button className={styles.button4}>
              <div className={styles.signUp} onClick={onSignUpClick}>
                Sign Up
              </div>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notification Button */}
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
              title="Notifications"
            >
              🔔
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  background: user?.avatar 
                    ? `url(${user.avatar}) center/cover` 
                    : `linear-gradient(135deg, ${getAvatarColor(user?.username || 'user')} 0%, ${getAvatarColor(user?.username || 'user')}99 100%)`,
                  border: '2px solid white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                }}
                title={user?.fullName}
              >
                {!user?.avatar && getInitials(user?.fullName || 'U')}
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    minWidth: '220px',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}
                >
                  {/* User Info */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 'bold', color: '#1e293b' }}>
                      {user?.fullName || user?.email || 'User'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      @{user?.username || 'unknown'}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={onProfileClick}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#1e293b',
                      fontSize: '14px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    👤 My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate('/my-submissions');
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#1e293b',
                      fontSize: '14px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    📤 My Submissions
                  </button>

                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#1e293b',
                      fontSize: '14px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    ⚙️ Settings
                  </button>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 0' }} />

                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#ef4444',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return { Navbar };
}
