import React, { useState, useEffect } from 'react';
import styles from './AuthWrapper.module.css';
import { getAuthConfig } from '../config/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState(getAuthConfig());

  useEffect(() => {
    // Update config when component mounts (in browser)
    setConfig(getAuthConfig());
    
    // Check if user is already authenticated
    const checkAuth = () => {
      try {
        const currentConfig = getAuthConfig();
        const session = localStorage.getItem(currentConfig.sessionKey);
        if (session) {
          const { timestamp, authenticated } = JSON.parse(session);
          const now = Date.now();
          
          // Check if session is still valid
          if (authenticated && (now - timestamp) < currentConfig.sessionDuration) {
            setIsAuthenticated(true);
          } else {
            // Session expired, clear it
            localStorage.removeItem(currentConfig.sessionKey);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        const currentConfig = getAuthConfig();
        localStorage.removeItem(currentConfig.sessionKey);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const currentConfig = getAuthConfig();
    if (password === currentConfig.password) {
      // Store authentication in localStorage with timestamp
      const session = {
        authenticated: true,
        timestamp: Date.now()
      };
      localStorage.setItem(currentConfig.sessionKey, JSON.stringify(session));
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError(currentConfig.ui.errorMessage);
      setPassword('');
    }
  };

  const handleLogout = () => {
    const currentConfig = getAuthConfig();
    localStorage.removeItem(currentConfig.sessionKey);
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