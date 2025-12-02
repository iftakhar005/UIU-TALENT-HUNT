import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/SignUp.module.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (emailValue: string) => {
    const uiuEmailRegex = /@.*\.?uiu\.ac\.bd$/;
    if (!emailValue.match(uiuEmailRegex)) {
      setEmailError('Only UIU email addresses are allowed');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
    }
  }, []);

  const handleSignUp = useCallback(() => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      return;
    }
    // Add sign up logic here
    localStorage.setItem('isLoggedIn', 'true');
    console.log('Sign up with email:', email);
    navigate('/');
  }, [email, navigate]);

  const handleLoginClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleHomeClick = useCallback(() => {
    navigate('/');
  }, [navigate]);
  	
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
        				<div className={styles.container}>
          					<b className={styles.heading1}>Join the Hunt!</b>
          					<div className={styles.createYourChapnion}>Create your champion account</div>
          					<div className={styles.form}>
            						<input 
              							type="text"
              							className={styles.input}
              							placeholder="Enter Full Name"
            						/>
            						<div>
              							<input 
                								type="email"
                								className={styles.input2}
                								placeholder="Enter Email"
                								value={email}
                								onChange={handleEmailChange}
              							/>
              							{emailError && <div className={styles.errorMessage}>{emailError}</div>}
            						</div>
            						<input 
              							type="text"
              							className={styles.input3}
              							placeholder="Enter Student ID"
            						/>
            						<div className={styles.input4}>
              							<input 
                								type="password"
                								className={styles.createPassword}
                								placeholder="Create Password"
              							/>
                								<span className={styles.buttonIcon}>👁️</span>
            						</div>
            						<div className={styles.input5}>
              							<input 
                								type="password"
                								className={styles.confirmPassword}
                								placeholder="Confirm Password"
              							/>
                								<span className={styles.buttonIcon2}>👁️</span>
            						</div>
            						<div className={styles.button} onClick={handleSignUp}>
              							<div className={styles.signup2}>Signup</div>
            						</div>
          					</div>
          					<div className={styles.alreadyHaveAn}>{`Already have an account? `}<span onClick={handleLoginClick} className={styles.link}><span className={styles.login}>Login</span></span></div>
        				</div>
      			</div>
    		</div>);
};

export default SignUp;
