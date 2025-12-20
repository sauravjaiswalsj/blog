// Authentication Configuration
// Password is loaded from Docusaurus custom fields (set via environment variables)

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Default configuration (fallbacks) - NO PASSWORD HERE
const DEFAULT_CONFIG = {
  sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
  sessionKey: 'notes_auth_session',
  ui: {
    title: '🔒 Protected Notes',
    subtitle: 'Please enter the password to access the notes section.',
    loginButtonText: '🔓 Access Notes',
    logoutButtonText: 'Logout',
    authStatusText: '🔓 Authenticated',
    sessionExpiryText: 'Session expires after 24 hours for security.',
    errorMessage: 'Incorrect password. Please try again.',
  }
};

// Hook to get auth config using Docusaurus context
export const useAuthConfig = () => {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields || {};
  
  return {
    password: customFields.authPassword as string, // Password comes from environment variable only
    sessionDuration: parseInt((customFields.sessionDuration as string) || DEFAULT_CONFIG.sessionDuration.toString()),
    sessionKey: DEFAULT_CONFIG.sessionKey,
    ui: {
      ...DEFAULT_CONFIG.ui,
      title: (customFields.authTitle as string) || DEFAULT_CONFIG.ui.title,
      subtitle: (customFields.authSubtitle as string) || DEFAULT_CONFIG.ui.subtitle,
    }
  };
};

// Function to get auth config from Docusaurus global context (fallback)
export const getAuthConfig = () => {
  // Check if we're in browser and have access to global config
  if (typeof window !== 'undefined' && (window as any).__DOCUSAURUS_CONFIG__) {
    const siteConfig = (window as any).__DOCUSAURUS_CONFIG__;
    const customFields = siteConfig.customFields || {};
    console.log('🔐 getAuthConfig (global):', customFields);
    
    return {
      password: customFields.authPassword, // Password comes from environment variable only
      sessionDuration: parseInt(customFields.sessionDuration || DEFAULT_CONFIG.sessionDuration.toString()),
      sessionKey: DEFAULT_CONFIG.sessionKey,
      ui: {
        ...DEFAULT_CONFIG.ui,
        title: customFields.authTitle || DEFAULT_CONFIG.ui.title,
        subtitle: customFields.authSubtitle || DEFAULT_CONFIG.ui.subtitle,
      }
    };
  }

  // Fallback for SSG (no password available during build)
  console.log('🔐 getAuthConfig (fallback)');
  return {
    password: undefined, // Will be set at runtime from Docusaurus config
    sessionDuration: DEFAULT_CONFIG.sessionDuration,
    sessionKey: DEFAULT_CONFIG.sessionKey,
    ui: DEFAULT_CONFIG.ui
  };
};

// Static export for backward compatibility (no password)
export const AUTH_CONFIG = {
  ...DEFAULT_CONFIG,
  password: undefined, // Password must come from environment via Docusaurus config
};