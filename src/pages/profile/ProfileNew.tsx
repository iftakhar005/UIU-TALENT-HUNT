import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavbar from '../../hooks/useNavbar';
import useFooter from '../../hooks/useFooter';
import { authAPI } from '../../services/api';

interface UserData {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  studentId?: string;
  department?: string;
  currentTrimester?: string;
  role: string;
}

export default function ProfileNewPage() {
  const navigate = useNavigate();
  const Navbar = useNavbar();
  const { Footer } = useFooter();

  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    studentId: '',
    department: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Fetch fresh user data from backend
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              const freshUser = data.user;
              console.log('👤 Fresh user data from backend:', freshUser);
              console.log('📚 Department:', freshUser.department);
              console.log('📆 Trimester:', freshUser.currentTrimester);

              // Update localStorage with fresh data
              localStorage.setItem('user', JSON.stringify(freshUser));

              setUser(freshUser);
              setFormData({
                fullName: freshUser.fullName || '',
                bio: freshUser.bio || '',
                studentId: freshUser.studentId || '',
                department: freshUser.department || '',
              });
              if (freshUser.avatar) {
                setAvatarPreview(freshUser.avatar);
              }
            } else {
              // Fallback to localStorage if API fails
              const userData = localStorage.getItem('user');
              if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setFormData({
                  fullName: parsedUser.fullName || '',
                  bio: parsedUser.bio || '',
                  studentId: parsedUser.studentId || '',
                  department: parsedUser.department || '',
                });
                if (parsedUser.avatar) {
                  setAvatarPreview(parsedUser.avatar);
                }
              } else {
                navigate('/login');
              }
            }
          } catch (apiError) {
            console.error('Failed to fetch user data from API:', apiError);
            // Fallback to localStorage
            const userData = localStorage.getItem('user');
            if (userData) {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              setFormData({
                fullName: parsedUser.fullName || '',
                bio: parsedUser.bio || '',
                studentId: parsedUser.studentId || '',
                department: parsedUser.department || '',
              });
              if (parsedUser.avatar) {
                setAvatarPreview(parsedUser.avatar);
              }
            } else {
              navigate('/login');
            }
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }

      // Compress image before converting to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize to max 400x400 for better compression
          if (width > 400 || height > 400) {
            const maxSize = 400;
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Use lower quality (60%) for smaller file size
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

            // Check compressed size
            const sizeInKB = (compressedBase64.length * 0.75) / 1024;
            console.log('🖼️ Compressed avatar size:', sizeInKB.toFixed(2), 'KB');

            if (sizeInKB > 500) {
              setError('Compressed image still too large. Please use a smaller image.');
              return;
            }

            setAvatarFile(file);
            setAvatarPreview(compressedBase64);
          }
        };
        img.onerror = () => {
          setError('Failed to load image. Please try another file.');
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please log in again.');
        setSaving(false);
        navigate('/login');
        return;
      }

      // Prepare update data - WITHOUT avatar first to test
      const updateData: any = {
        fullName: formData.fullName,
        bio: formData.bio,
        studentId: formData.studentId,
      };

      // Only add department if it has a value
      if (formData.department && formData.department !== '') {
        updateData.department = formData.department;
      }

      // Call API to update profile
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Backend error response:', data);
        throw new Error(data.error || 'Failed to update profile');
      }

      // If no avatar file, we're done
      if (!avatarFile) {
        // Update local state and localStorage
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setSaving(false);
        return;
      }

      // Now handle avatar separately if it was changed
      console.log('🖼️ Processing avatar...');
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const avatarBase64 = reader.result as string;
            console.log('🖼️ Avatar size:', (avatarBase64.length * 0.75) / 1024, 'KB');

            // Update with avatar
            const avatarUpdateData: any = {
              fullName: formData.fullName,
              bio: formData.bio,
              studentId: formData.studentId,
              avatar: avatarBase64
            };

            // Only add department if it has a value
            if (formData.department && formData.department !== '') {
              avatarUpdateData.department = formData.department;
            }

            const avatarResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(avatarUpdateData),
            });

            const avatarData = await avatarResponse.json();

            if (!avatarResponse.ok) {
              console.error('❌ Avatar upload error:', avatarData);
              throw new Error(avatarData.error || 'Failed to update avatar');
            }

            // Update local state and localStorage
            const updatedUser = { ...user, ...avatarData.user };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setSaving(false);

            // Refresh navbar by reloading window
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            resolve();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update avatar');
            setSaving(false);
            resolve();
          }
        };
        reader.onerror = () => {
          setError('Failed to read file');
          setSaving(false);
          resolve();
        };
        reader.readAsDataURL(avatarFile);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        {Navbar}
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '100vh' }}>
          <p style={{ fontSize: '18px', color: '#64748b' }}>Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        {Navbar}
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '100vh' }}>
          <p style={{ fontSize: '18px', color: '#e11d48' }}>User data not found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {Navbar}

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
              My Profile
            </h1>
            <p style={{ fontSize: '16px', color: '#64748b' }}>
              Manage your account information and profile settings
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #fca5a5'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#ecfdf5',
              color: '#059669',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #6ee7b7'
            }}>
              {success}
            </div>
          )}

          {/* Profile Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            marginBottom: '32px'
          }}>
            {/* Profile Header */}
            <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', alignItems: 'flex-start' }}>
              {/* Avatar Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '150px' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: avatarPreview ? 'transparent' : getAvatarColor(user?.username || 'user'),
                  backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'white',
                  fontSize: '50px',
                  fontWeight: 'bold',
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {!avatarPreview && getInitials(user?.fullName || 'U')}
                </div>
                {isEditing && (
                  <label style={{
                    padding: '8px 16px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginTop: '8px'
                  }}>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div style={{ flex: 1 }}>
                {!isEditing ? (
                  <>
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '4px', margin: 0 }}>
                        {user.fullName}
                      </h2>
                      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', margin: 0, marginTop: '4px' }}>
                        @{user.username}
                      </p>
                      {user.department && (
                        <p style={{ fontSize: '14px', color: '#ff8a3c', margin: 0, marginTop: '4px', fontWeight: '500' }}>
                          📚 {user.department} • {user.currentTrimester} Trimester
                        </p>
                      )}
                      {user.bio && (
                        <p style={{ fontSize: '14px', color: '#475569', marginTop: '12px', lineHeight: '1.5', margin: 0, marginTop: '12px' }}>
                          {user.bio}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ff8a3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e2f'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff8a3c'}
                    >
                      Edit Profile
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {/* Edit Form */}
            {isEditing ? (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                {/* Full Name */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#ff8a3c'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    placeholder="Your full name"
                  />
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      minHeight: '100px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#ff8a3c'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Department */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      backgroundColor: 'white',
                      color: '#1e293b',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      appearance: 'auto',
                      WebkitAppearance: 'menulist',
                      MozAppearance: 'menulist'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#ff8a3c'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <option value="" style={{ color: '#94a3b8' }}>Select Department</option>
                    <option value="CSE" style={{ color: '#1e293b' }}>CSE</option>
                    <option value="EE" style={{ color: '#1e293b' }}>EE</option>
                    <option value="Pharmacy" style={{ color: '#1e293b' }}>Pharmacy</option>
                    <option value="Civil" style={{ color: '#1e293b' }}>Civil</option>
                    <option value="BBA" style={{ color: '#1e293b' }}>BBA</option>
                    <option value="Nursing" style={{ color: '#1e293b' }}>Nursing</option>
                    <option value="Architecture" style={{ color: '#1e293b' }}>Architecture</option>
                  </select>
                </div>

                {/* Student ID */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#ff8a3c'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    placeholder="Your student ID"
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarFile(null);
                      if (user) {
                        setFormData({
                          fullName: user.fullName || '',
                          bio: user.bio || '',
                          studentId: user.studentId || '',
                          department: user.department || '',
                        });
                        setAvatarPreview(user.avatar || '');
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    disabled={saving}
                    onMouseEnter={(e) => {
                      if (!saving) {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.color = '#1e293b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#ff8a3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'background-color 0.2s',
                      opacity: saving ? 0.7 : 1
                    }}
                    disabled={saving}
                    onMouseEnter={(e) => {
                      if (!saving) {
                        e.currentTarget.style.backgroundColor = '#e67e2f';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ff8a3c';
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Account Info Section */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px', margin: 0, marginBottom: '24px' }}>
              Account Information
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Email</label>
                <p style={{ fontSize: '14px', color: '#1e293b', margin: 0 }}>{user.email}</p>
              </div>

              {/* Username */}
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Username</label>
                <p style={{ fontSize: '14px', color: '#1e293b', margin: 0 }}>@{user.username}</p>
              </div>

              {/* Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Account Type</label>
                <p style={{ fontSize: '14px', color: '#1e293b', margin: 0, textTransform: 'capitalize' }}>
                  {user.role}
                </p>
              </div>

              {/* Department */}
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Department</label>
                <p style={{ fontSize: '14px', color: '#1e293b', margin: 0 }}>
                  {user.department || 'Not set'}
                </p>
              </div>

              {/* Trimester */}
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Current Trimester</label>
                <p style={{ fontSize: '14px', color: '#1e293b', margin: 0 }}>
                  {user.currentTrimester ? `${user.currentTrimester} Trimester` : 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
