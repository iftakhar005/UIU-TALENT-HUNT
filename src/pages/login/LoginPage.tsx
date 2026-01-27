import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import styles from "../../styles/LoginPage.module.css";

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    avatar?: string;
    role: string;
  };
  requiresVerification?: boolean;
  redirect?: string;
  testCode?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminUser, setAdminUser] = useState<LoginResponse['user'] | null>(null);

  const onLoginClick = useCallback(async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(email, password) as LoginResponse;

      // Check if verification is required (admin email verification)
      if (response.requiresVerification) {
        setRequiresVerification(true);
        setAdminEmail(response.user.email);
        setAdminUser(response.user);
        // Show test code in development if available
        if (response.testCode) {
          setError(`Test code sent: ${response.testCode} (Check your email for code)`);
        } else {
          setError(""); // Clear any login error
        }
        return;
      }

      // Save auth data
      const user = {
        ...response.user,
        role: (response.user.role as 'user' | 'admin' | 'judge') || 'user'
      };
      authAPI.saveAuth(response.token, user);

      // Navigate to dashboard or redirect based on user role
      if (response.redirect) {
        navigate(response.redirect);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate]);

  const onVerifyCodeClick = useCallback(async () => {
    setError("");

    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.verifyAdminEmail(
        adminEmail,
        verificationCode
      ) as LoginResponse;

      // Save auth data
      const user = {
        ...response.user,
        role: (response.user.role as 'user' | 'admin' | 'judge') || 'user'
      };
      authAPI.saveAuth(response.token, user);

      // Navigate to admin dashboard
      navigate(response.redirect || "/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [verificationCode, adminEmail, navigate]);

  const onBackToLogin = useCallback(() => {
    setRequiresVerification(false);
    setVerificationCode("");
    setEmail("");
    setPassword("");
    setError("");
    setAdminEmail("");
    setAdminUser(null);
  }, []);

  const onSignUpClick = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  const onLogoClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onForgotPasswordClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/forgot-password");
  }, [navigate]);

  // Verification Code Screen
  if (requiresVerification && adminUser) {
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

        {/* Right Side - Verification Form */}
        <div className={styles.background2}>
          <div className={styles.container}>
            <b className={styles.heading12}>Email Verification</b>
            <p style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}>
              A verification code has been sent to <strong>{adminEmail}</strong>
            </p>

            {/* Verification Code Input */}
            <div className={styles.label}>
              <div className={styles.emailOrUsername}>Verification Code</div>
              <div className={styles.input}>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className={styles.inputField}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && verificationCode) {
                      onVerifyCodeClick();
                    }
                  }}
                  maxLength={6}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  color: error.includes("Test") ? "#059669" : "#dc2626",
                  fontSize: "12px",
                  marginBottom: "12px",
                  padding: "8px",
                  backgroundColor: error.includes("Test") ? "#f0fdf4" : "#fef2f2",
                  borderRadius: "4px",
                }}
              >
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              className={styles.button}
              onClick={onVerifyCodeClick}
              disabled={loading || !verificationCode}
              style={{ opacity: loading || !verificationCode ? 0.7 : 1 }}
            >
              <b className={styles.login2}>
                {loading ? "Verifying..." : "Verify Code"}
              </b>
            </button>

            {/* Back to Login */}
            <div className={styles.dontHaveAnContainer}>
              <button
                onClick={onBackToLogin}
                className={styles.signUpLink}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Login Screen
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    onLoginClick();
                  }
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className={styles.label2}>
            <div className={styles.password}>Password</div>
            <div className={styles.inputPasswordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={styles.inputField2}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    onLoginClick();
                  }
                }}
              />
              <button
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                color: "#dc2626",
                fontSize: "12px",
                marginBottom: "12px",
              }}
            >
              {error}
            </div>
          )}

          {/* Forgot Password */}
          <button
            onClick={onForgotPasswordClick}
            className={styles.linkForgot}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            Forgot Password?
          </button>

          {/* Login Button */}
          <button
            className={styles.button}
            onClick={onLoginClick}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <b className={styles.login2}>
              {loading ? "Logging in..." : "Login"}
            </b>
          </button>

          {/* Sign Up Link */}
          <div className={styles.dontHaveAnContainer}>
            <span>
              Don't have an account?{" "}
              <button onClick={onSignUpClick} className={styles.signUpLink}>
                Sign Up
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
// End of LoginPage.tsx
