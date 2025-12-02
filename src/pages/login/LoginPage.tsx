import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dummy credentials
  const DUMMY_EMAIL = 'user@uiu.ac.bd';
  const DUMMY_PASSWORD = 'password123';

  const onLoginClick = useCallback(() => {
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/');
    } else {
      setError('Invalid email or password');
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
          <button className={styles.button} onClick={onLoginClick}>
            <b className={styles.login2}>Login</b>
          </button>

          {/* Dummy Credentials Info */}
          <div style={{ fontSize: '12px', color: '#666', marginTop: '16px', textAlign: 'center' }}>
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: {DUMMY_EMAIL}</p>
            <p>Password: {DUMMY_PASSWORD}</p>
          </div>

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
