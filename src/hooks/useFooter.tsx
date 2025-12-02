import styles from '../styles/HomePage.module.css';

export default function useFooter() {
  const Footer = () => (
    <div className={styles.footer}>
      <div className={styles.developedByVoid}>Developed by VOID</div>
      <div className={styles.copyright2025By}>
        © Copyright 2025 by VOID. All rights reserved.
      </div>
    </div>
  );

  return { Footer };
}
