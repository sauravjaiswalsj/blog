# Authentication Setup Guide

## 🔒 Overview

Your LaTeX Notes system now includes **password protection** for the entire notes section. Only users with the correct password can access your documentation.

## ✨ Features

- **Client-side Authentication**: Secure password protection
- **Session Management**: 24-hour login sessions
- **Responsive Design**: Works on all devices
- **Dark Mode Support**: Matches your site theme
- **Easy Configuration**: Simple password changes
- **Logout Functionality**: Manual session termination

## 🔧 Configuration

### Change Password

Edit `src/config/auth.ts`:

```typescript
export const AUTH_CONFIG = {
  // Change this to your desired password
  password: 'your-secure-password-here',
  
  // Session duration (default: 24 hours)
  sessionDuration: 24 * 60 * 60 * 1000,
  
  // Customize UI text
  ui: {
    title: '🔒 My Private Notes',
    subtitle: 'Enter password to access my study materials.',
    // ... other UI customizations
  }
};
```

### Environment-Based Passwords

You can set different passwords for development and production:

```typescript
export const getAuthConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    return {
      ...AUTH_CONFIG,
      password: 'dev123', // Development password
    };
  }
  
  return {
    ...AUTH_CONFIG,
    password: 'prod-secure-password', // Production password
  };
};
```

## 🎯 How It Works

### Protection Scope
- **Protected**: All `/docs/*` pages (your notes)
- **Public**: Homepage, blog, other pages
- **Selective**: Only documentation requires authentication

### Session Management
- **Duration**: 24 hours by default
- **Storage**: Browser localStorage
- **Expiry**: Automatic logout after session expires
- **Manual**: Logout button available

### Security Features
- **Client-side**: Password validation in browser
- **Session tokens**: Timestamped authentication
- **Auto-expiry**: Sessions expire automatically
- **Clear on logout**: All session data removed

## 🚀 Usage

### For You (Site Owner)
1. **Set Password**: Edit `src/config/auth.ts`
2. **Build & Deploy**: Normal deployment process
3. **Share Password**: Give password to authorized users

### For Users
1. **Visit Notes**: Navigate to any `/docs/` page
2. **Enter Password**: Use the login form
3. **Access Content**: Browse all notes freely
4. **Auto-logout**: Session expires in 24 hours
5. **Manual Logout**: Click logout button anytime

## 🎨 Customization

### UI Styling

Edit `src/components/AuthWrapper.module.css`:

```css
.authContainer {
  /* Change background gradient */
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}

.authBox {
  /* Customize login box */
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

### Text Content

Edit `src/config/auth.ts`:

```typescript
ui: {
  title: '🔐 My Personal Notes',
  subtitle: 'These are my private study materials.',
  loginButtonText: '🚀 Enter',
  errorMessage: 'Wrong password! Try again.',
}
```

## 🔄 Workflow Integration

### Development
```bash
# Normal development - auth works locally
npm run dev
```

### Building
```bash
# Auth is included in build
npm run build
```

### GitHub Actions
The authentication works seamlessly with your existing CI/CD:
- No changes needed to workflows
- Auth is built into the static site
- Works on any hosting platform

## 🛡️ Security Considerations

### Client-Side Limitations
- **Not Server-Side**: Password is in client code
- **Obfuscated**: Bundled and minified in production
- **Deterrent**: Prevents casual access
- **Session-Based**: Reduces password exposure

### Best Practices
1. **Use Strong Password**: Long, complex passwords
2. **Regular Changes**: Update password periodically
3. **Limited Sharing**: Only share with trusted users
4. **Monitor Access**: Check who has the password

### For Higher Security
If you need server-side authentication:
- Consider Netlify Identity
- Use Vercel Authentication
- Deploy behind a VPN
- Use enterprise hosting with auth

## 📱 User Experience

### Login Flow
1. User visits `/docs/arrays` (or any notes page)
2. Sees password prompt instead of content
3. Enters password and clicks "Access Notes"
4. Gets full access to all documentation
5. Sees logout button in top bar

### Session Persistence
- **Stays Logged In**: Across page refreshes
- **Multiple Tabs**: Works in all browser tabs
- **24 Hour Limit**: Automatic logout for security
- **Manual Logout**: Available anytime

## 🐛 Troubleshooting

### Common Issues

**Password Not Working**
- Check `src/config/auth.ts` for correct password
- Ensure no extra spaces or characters
- Try clearing browser cache

**Session Expires Too Quickly**
- Increase `sessionDuration` in config
- Check system clock accuracy

**Styling Issues**
- Check CSS modules are loading
- Verify dark mode compatibility
- Test on different screen sizes

### Reset Authentication
```bash
# Clear all auth data
localStorage.removeItem('notes_auth_session');
```

## 🎉 Benefits

- ✅ **Privacy Protection**: Keep your notes private
- ✅ **Easy Setup**: Simple configuration
- ✅ **User Friendly**: Clean login interface
- ✅ **Mobile Ready**: Works on all devices
- ✅ **No Backend**: Pure client-side solution
- ✅ **CI/CD Compatible**: Works with existing workflows

Your notes are now protected! Share the password only with people you trust. 🔐