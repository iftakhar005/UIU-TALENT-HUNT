import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import styles from '../../styles/LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLoginClick = useCallback(async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      
      // Save auth data
      authAPI.saveAuth(response.token, response.user);
      
      // Navigate to home
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate]);

  const onSignUpClick = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

  const onLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className={styles.login}>
      {/* Left Side - Branding */}
      <div className={styles.background}>
        <div className={styles.tWrapper} onClick={onLogoClick}>
          <div className={styles.t}>T</div>
        </div>
        <b className={styles.heading1}>UIU Talent Hunt</b>
        <div className={styles.theStageIs}>The Stage is Yours.</div>
      </div>

      {/* Right Side - Login Form */}
      <div className={styles.background2}>
        <div className={styles.container}>
          <b className={styles.heading12}>Welcome Back!</b>

          {/* Email Input */}
          <div className={styles.label}>
            <div className={styles.emailOrUsername}>Email or Username</div>
            <div className={styles.input}>
              <input
                type="text"
                placeholder="Enter your email or username"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className={styles.label2}>
            <div className={styles.password}>Password</div>
            <div className={styles.inputPasswordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={styles.inputField2}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}

          {/* Forgot Password */}
          <a href="#" className={styles.linkForgot}>
            Forgot Password?
          </a>

          {/* Login Button */}
          <button 
            className={styles.button} 
            onClick={onLoginClick}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <b className={styles.login2}>{loading ? 'Logging in...' : 'Login'}</b>
          </button>

          {/* Sign Up Link */}
          <div className={styles.dontHaveAnContainer}>
            <span>
              Don't have an account?{' '}
              <button
                onClick={onSignUpClick}
                className={styles.signUpLink}
              >
                Sign Up
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
