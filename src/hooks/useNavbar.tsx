import { useCallback, useState, useEffect } from 'react';
import styles from '../styles/HomePage.module.css';

export default function useNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const onLoginTextClick = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const onSignUpClick = useCallback(() => {
    window.location.href = '/signup';
  }, []);

  const onSubmitEntryClick = useCallback(() => {
    window.location.href = '/submit';
  }, []);

  const onLogoClick = useCallback(() => {
    window.location.href = '/';
  }, []);

  const Navbar = () => (
    <div className={styles.header2}>
      <div className={styles.nav}>
        <div className={styles.uiuTalentHunt} onClick={onLogoClick} style={{ cursor: 'pointer' }}>
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
          <button className={styles.button2} onClick={() => {
            localStorage.setItem('isLoggedIn', 'false');
            window.location.href = '/';
          }}>
            <div className={styles.login}>Logout</div>
          </button>
        )}
      </div>
    </div>
  );

  return { Navbar };
}
