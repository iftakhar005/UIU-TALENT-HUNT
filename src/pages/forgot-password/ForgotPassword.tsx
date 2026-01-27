import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Reset
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return setError('Email is required');

        setError('');
        setLoading(true);
        try {
            const response = await authAPI.forgotPassword(email);
            setSuccess(response.message);
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !newPassword || !confirmPassword) {
            return setError('All fields are required');
        }
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (newPassword.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setError('');
        setLoading(true);
        try {
            const response = await authAPI.resetPassword({ email, code, newPassword });
            setSuccess(response.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const onLogoClick = () => {
        navigate("/");
    };

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

            {/* Right Side - Form */}
            <div className={styles.background2}>
                <div className={styles.container}>
                    <b className={styles.heading12}>Reset Password</b>
                    <p style={{ color: "#666", marginBottom: "30px", fontSize: "14px" }}>
                        {step === 1
                            ? "Enter your email to receive a reset code"
                            : "Enter the code and your new password"}
                    </p>

                    {error && (
                        <div
                            style={{
                                color: "#dc2626",
                                fontSize: "12px",
                                marginBottom: "12px",
                                padding: "8px",
                                backgroundColor: "#fef2f2",
                                borderRadius: "4px",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            style={{
                                color: "#059669",
                                fontSize: "12px",
                                marginBottom: "12px",
                                padding: "8px",
                                backgroundColor: "#f0fdf4",
                                borderRadius: "4px",
                            }}
                        >
                            {success}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRequestCode}>
                            <div className={styles.label}>
                                <div className={styles.emailOrUsername}>University Email</div>
                                <div className={styles.input}>
                                    <input
                                        type="email"
                                        placeholder="student_id@bscse.uiu.ac.bd"
                                        className={styles.inputField}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className={styles.button} disabled={loading}>
                                <b className={styles.login2}>
                                    {loading ? 'Sending...' : 'Send Reset Code'}
                                </b>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <div className={styles.label}>
                                <div className={styles.emailOrUsername}>Verification Code</div>
                                <div className={styles.input}>
                                    <input
                                        type="text"
                                        placeholder="6-digit code"
                                        className={styles.inputField}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.label}>
                                <div className={styles.emailOrUsername}>New Password</div>
                                <div className={styles.input}>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className={styles.inputField}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.label}>
                                <div className={styles.emailOrUsername}>Confirm New Password</div>
                                <div className={styles.input}>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className={styles.inputField}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className={styles.button} disabled={loading}>
                                <b className={styles.login2}>
                                    {loading ? 'Resetting...' : 'Update Password'}
                                </b>
                            </button>
                        </form>
                    )}

                    <div className={styles.dontHaveAnContainer}>
                        <span>Remember your password? </span>
                        <Link to="/login" className={styles.signUpLink}>Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
