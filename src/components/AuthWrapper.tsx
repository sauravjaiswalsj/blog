import React, { useState, useEffect } from 'react';
import styles from './AuthWrapper.module.css';
import { useAuthConfig } from '../config/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Get configuration from Docusaurus using the proper hook
  const config = useAuthConfig();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      try {
        const session = localStorage.getItem(config.sessionKey);
        if (session) {
          const { timestamp, authenticated } = JSON.parse(session);
          const now = Date.now();
          
          // Check if session is still valid
          if (authenticated && (now - timestamp) < config.sessionDuration) {
            setIsAuthenticated(true);
          } else {
            // Session expired, clear it
            localStorage.removeItem(config.sessionKey);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem(config.sessionKey);
      }
      setLoading(false);
    };

    checkAuth();
  }, [config]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === config.password) {
      // Store authentication in localStorage with timestamp
      const session = {
        authenticated: true,
        timestamp: Date.now()
      };
      localStorage.setItem(config.sessionKey, JSON.stringify(session));
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError(config.ui.errorMessage);
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(config.sessionKey);
    setIsAuthenticated(false);
    setPassword('');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <div className={styles.authHeader}>
            <h2>{config.ui.title}</h2>
            <p>{config.ui.subtitle}</p>
          </div>
          
          <form onSubmit={handleLogin} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={styles.passwordInput}
                autoFocus
              />
            </div>
            
            {error && (
              <div className={styles.errorMessage}>
                ⚠️ {error}
              </div>
            )}
            
            <button type="submit" className={styles.loginButton}>
              {config.ui.loginButtonText}
            </button>
          </form>
          
          <div className={styles.authFooter}>
            <p>
              <small>
                {config.ui.sessionExpiryText}
              </small>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authenticatedContainer}>
      <div className={styles.logoutBar}>
        <span className={styles.authStatus}>
          {config.ui.authStatusText}
        </span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          {config.ui.logoutButtonText}
        </button>
      </div>
      {children}
    </div>
  );
};

export default AuthWrapper;