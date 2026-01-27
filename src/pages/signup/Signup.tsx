import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import styles from '../../styles/SignUp.module.css';

type SignupStep = 'form' | 'verify';

const SignUp = () => {
  const navigate = useNavigate();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [currentTrimester, setCurrentTrimester] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<SignupStep>('form');

  // UI states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const validateEmail = (emailValue: string) => {
    const uiuEmailRegex = /@.*\.?uiu\.ac\.bd$/;
    if (!emailValue.match(uiuEmailRegex)) {
      return 'Only UIU email addresses are allowed';
    }
    return '';
  };

  // Step 1: Submit form and send verification code
  const handleSendVerification = useCallback(async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!email) {
      setError('Email is required');
      return;
    }
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Generate username from email (before @)
      const username = email.split('@')[0];

      const response = await authAPI.sendVerification({
        email,
        username,
        password,
        fullName: fullName.trim(),
        studentId: studentId.trim() || undefined,
        department: department || undefined,
        currentTrimester: currentTrimester || undefined,
      });

      // Move to verification step
      setStep('verify');
      setSuccess(response.message || 'Verification code sent to your email!');
      setResendCooldown(60); // 60 seconds cooldown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fullName, email, studentId, department, currentTrimester, password, confirmPassword]);

  // Step 2: Verify code and complete registration
  const handleVerifyCode = useCallback(async () => {
    setError('');
    setSuccess('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyCode(email, verificationCode);

      // Save auth data
      authAPI.saveAuth(response.token, response.user);

      setSuccess('Account created successfully!');

      // Navigate to home after a brief delay
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, verificationCode, navigate]);

  // Resend verification code
  const handleResendCode = useCallback(async () => {
    if (resendCooldown > 0) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.resendCode(email);
      setSuccess('New verification code sent!');
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, resendCooldown]);

  // Go back to form
  const handleBackToForm = useCallback(() => {
    setStep('form');
    setVerificationCode('');
    setError('');
    setSuccess('');
  }, []);

  const handleLoginClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleHomeClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Verification Code Input Component
  const renderVerificationStep = () => (
    <div className={styles.container}>
      <b className={styles.heading1}>Verify Your Email</b>
      <div className={styles.createYourChapnion}>
        Enter the 6-digit code sent to<br />
        <strong style={{ color: '#ff8a3c' }}>{email}</strong>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          color: '#059669',
          fontSize: '13px',
          marginBottom: '12px',
          padding: '10px',
          backgroundColor: '#ecfdf5',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          color: '#dc2626',
          fontSize: '13px',
          marginBottom: '12px',
          padding: '10px',
          backgroundColor: '#fef2f2',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div className={styles.form}>
        {/* Verification Code Input */}
        <input
          type="text"
          className={styles.input}
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setVerificationCode(value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading && verificationCode.length === 6) {
              handleVerifyCode();
            }
          }}
          maxLength={6}
          style={{
            textAlign: 'center',
            letterSpacing: '8px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        />

        {/* Verify Button */}
        <div
          className={styles.button}
          onClick={handleVerifyCode}
          style={{
            opacity: loading ? 0.7 : 1,
            pointerEvents: loading ? 'none' : 'auto'
          }}
        >
          <div className={styles.signup2}>
            {loading ? 'Verifying...' : 'Verify & Create Account'}
          </div>
        </div>

        {/* Resend Code */}
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          Didn't receive the code?{' '}
          <span
            onClick={handleResendCode}
            style={{
              color: resendCooldown > 0 ? '#9ca3af' : '#ff8a3c',
              cursor: resendCooldown > 0 ? 'default' : 'pointer',
              fontWeight: '600'
            }}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </span>
        </div>

        {/* Back Button */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '12px',
            color: '#6b7280',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          onClick={handleBackToForm}
        >
          ← Back to signup form
        </div>
      </div>
    </div>
  );

  // Signup Form Component
  const renderFormStep = () => (
    <div className={styles.container}>
      <b className={styles.heading1}>Join the Hunt!</b>
      <div className={styles.createYourChapnion}>Create your champion account</div>

      {/* Error Message */}
      {error && (
        <div style={{
          color: '#dc2626',
          fontSize: '13px',
          marginBottom: '12px',
          padding: '10px',
          backgroundColor: '#fef2f2',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSendVerification();
            }
          }}
        />
        <input
          type="email"
          className={styles.input2}
          placeholder="Enter UIU Email (e.g., name@uiu.ac.bd)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSendVerification();
            }
          }}
        />
        <input
          type="text"
          className={styles.input3}
          placeholder="Enter Student ID (optional)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSendVerification();
            }
          }}
        />
        <select
          className={styles.input3}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSendVerification();
            }
          }}
        >
          <option value="">Select Department</option>
          <option value="CSE">Department of CSE</option>
          <option value="EE">Department of EE</option>
          <option value="Pharmacy">Department of Pharmacy</option>
          <option value="Civil">Department of Civil</option>
          <option value="BBA">Department of BBA</option>
          <option value="Nursing">Department of Nursing</option>
          <option value="Architecture">Department of Architecture</option>
        </select>
        <select
          className={styles.input3}
          value={currentTrimester}
          onChange={(e) => setCurrentTrimester(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSendVerification();
            }
          }}
        >
          <option value="">Select Current Trimester</option>
          <option value="1st">1st Trimester</option>
          <option value="2nd">2nd Trimester</option>
          <option value="3rd">3rd Trimester</option>
          <option value="4th">4th Trimester</option>
          <option value="5th">5th Trimester</option>
          <option value="6th">6th Trimester</option>
          <option value="7th">7th Trimester</option>
          <option value="8th">8th Trimester</option>
          <option value="9th">9th Trimester</option>
          <option value="10th">10th Trimester</option>
          <option value="11th">11th Trimester</option>
          <option value="12th">12th Trimester</option>
        </select>
        <div className={styles.input4}>
          <input
            type={showPassword ? 'text' : 'password'}
            className={styles.createPassword}
            placeholder="Create Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSendVerification();
              }
            }}
          />
          <span
            className={styles.buttonIcon}
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <div className={styles.input5}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className={styles.confirmPassword}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSendVerification();
              }
            }}
          />
          <span
            className={styles.buttonIcon2}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ cursor: 'pointer' }}
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <div
          className={styles.button}
          onClick={handleSendVerification}
          style={{
            opacity: loading ? 0.7 : 1,
            pointerEvents: loading ? 'none' : 'auto'
          }}
        >
          <div className={styles.signup2}>
            {loading ? 'Sending Code...' : 'Continue'}
          </div>
        </div>
      </div>
      <div className={styles.alreadyHaveAn}>
        {`Already have an account? `}
        <span onClick={handleLoginClick} className={styles.link}>
          <span className={styles.login}>Login</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.signup}>
      <div className={styles.backgroundverticalborder}>
        <b className={styles.heading2}>UIU TALENT HUNT SHOW</b>
        <div className={styles.unleashYourPotential}>Unleash Your Potential. Showcase Your Talent.</div>
        <div className={styles.tWrapper} onClick={handleHomeClick}>
          <div className={styles.t}>T</div>
        </div>
      </div>
      <div className={styles.background}>
        {step === 'form' ? renderFormStep() : renderVerificationStep()}
      </div>
    </div>
  );
};

export default SignUp;
