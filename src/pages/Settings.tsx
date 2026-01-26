import { FunctionComponent, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavbar from '../hooks/useNavbar';
import useFooter from '../hooks/useFooter';
import styles from './Settings.module.css';

interface UserSettings {
  email: string;
  username: string;
  fullName: string;
  department: string;
  currentTrimester: string;
  bio: string;
  profileVisibility: 'public' | 'private';
  emailNotifications: boolean;
  submissionNotifications: boolean;
  commentNotifications: boolean;
  followingNotifications: boolean;
}

const Settings: FunctionComponent = () => {
  const navigate = useNavigate();
  const Navbar = useNavbar();
  const { Footer } = useFooter();

  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    username: '',
    fullName: '',
    department: 'CSE',
    currentTrimester: '1st',
    bio: '',
    profileVisibility: 'public',
    emailNotifications: true,
    submissionNotifications: true,
    commentNotifications: true,
    followingNotifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const departments = ['CSE', 'EE', 'Pharmacy', 'Civil', 'BBA', 'Nursing', 'Architecture'];
  const trimesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    // Load user settings from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setSettings(prev => ({
        ...prev,
        email: user.email || '',
        username: user.username || '',
        fullName: user.fullName || '',
        department: user.department || 'CSE',
        currentTrimester: user.currentTrimester || '1st',
        bio: user.bio || '',
      }));
    }
    setLoading(false);
  }, [navigate]);

  const handleInputChange = useCallback((field: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSaveSettings = useCallback(async () => {
    setSaving(true);
    setMessage('');

    try {
      // Here you would call the backend API to save settings
      // For now, we'll save to localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          bio: settings.bio,
          department: settings.department,
          currentTrimester: settings.currentTrimester,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setMessageType('success');
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const handleChangePassword = useCallback(() => {
    navigate('/change-password');
  }, [navigate]);

  if (loading) {
    return (
      <>
        <div className={styles.settingsPage}>
          {Navbar}
          <div className={styles.container}>Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {Navbar}
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Account Settings</h1>
            <p className={styles.subtitle}>Manage your account preferences and privacy settings</p>
          </div>

          {message && (
            <div className={`${styles.message} ${styles[messageType]}`}>
              {messageType === 'success' ? '✅' : '❌'} {message}
            </div>
          )}

          <div className={styles.settingsGrid}>
            {/* Profile Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>👤 Profile Information</h2>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.fullName}
                  disabled
                  placeholder="Your full name"
                />
                <p className={styles.hint}>Contact support to change your name</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={settings.email}
                  disabled
                  placeholder="your.email@example.com"
                />
                <p className={styles.hint}>Contact support to change your email</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Username</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.username}
                  disabled
                  placeholder="@username"
                />
                <p className={styles.hint}>Username cannot be changed</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Bio</label>
                <textarea
                  className={styles.textarea}
                  value={settings.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  maxLength={200}
                />
                <p className={styles.hint}>{settings.bio.length}/200 characters</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Department</label>
                <select
                  className={styles.select}
                  value={settings.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Current Trimester</label>
                <select
                  className={styles.select}
                  value={settings.currentTrimester}
                  onChange={(e) => handleInputChange('currentTrimester', e.target.value)}
                >
                  {trimesters.map(trim => (
                    <option key={trim} value={trim}>{trim} Trimester</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Privacy Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>🔒 Privacy & Security</h2>

              <div className={styles.formGroup}>
                <label className={styles.label}>Profile Visibility</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      checked={settings.profileVisibility === 'public'}
                      onChange={() => handleInputChange('profileVisibility', 'public')}
                    />
                    <span>Public - Everyone can see your profile</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      checked={settings.profileVisibility === 'private'}
                      onChange={() => handleInputChange('profileVisibility', 'private')}
                    />
                    <span>Private - Only approved followers can see your profile</span>
                  </label>
                </div>
              </div>

              <button
                className={styles.dangerButton}
                onClick={handleChangePassword}
              >
                🔑 Change Password
              </button>
            </section>

            {/* Notifications Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>🔔 Notification Settings</h2>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  />
                  <span>Email Notifications</span>
                </label>
                <p className={styles.hint}>Receive updates via email</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.submissionNotifications}
                    onChange={(e) => handleInputChange('submissionNotifications', e.target.checked)}
                  />
                  <span>Submission Updates</span>
                </label>
                <p className={styles.hint}>Get notified about your submission status</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.commentNotifications}
                    onChange={(e) => handleInputChange('commentNotifications', e.target.checked)}
                  />
                  <span>Comment Notifications</span>
                </label>
                <p className={styles.hint}>Get notified when someone comments on your content</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.followingNotifications}
                    onChange={(e) => handleInputChange('followingNotifications', e.target.checked)}
                  />
                  <span>Following Notifications</span>
                </label>
                <p className={styles.hint}>Get notified when someone follows you</p>
              </div>
            </section>

            {/* Danger Zone */}
            <section className={styles.sectionDanger}>
              <h2 className={styles.sectionTitle}>⚠️ Danger Zone</h2>

              <div className={styles.dangerContent}>
                <div>
                  <h3 className={styles.dangerTitle}>Delete Account</h3>
                  <p className={styles.dangerDescription}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <button className={styles.deleteButton}>
                  Delete Account
                </button>
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              onClick={() => navigate('/profile')}
            >
              Cancel
            </button>
            <button
              className={styles.saveButton}
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
