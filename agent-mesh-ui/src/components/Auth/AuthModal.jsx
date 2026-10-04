import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import './Auth.css';

// Crisp inline SVGs for GitHub & Google
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/>
  </svg>
);

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('developer@agentmesh.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Carter');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userProfile = {
        name: mode === 'signup' ? name : 'Alex Carter',
        email: email,
        role: 'Lead Architect',
        avatar: '👨‍💻'
      };
      if (onLoginSuccess) {
        onLoginSuccess(userProfile);
      }
      onClose();
    }, 450);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userProfile = {
        name: 'Alex Carter',
        email: 'alex@agentmesh.ai',
        role: 'Autonomous AI Engineer',
        avatar: '⚡'
      };
      if (onLoginSuccess) {
        onLoginSuccess(userProfile);
      }
      onClose();
    }, 300);
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} title="Close">
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles size={20} className="auth-sparkle" />
          </div>
          <h2>{mode === 'login' ? 'Welcome to Agent Mesh' : 'Join Agent Mesh'}</h2>
          <p>
            {mode === 'login'
              ? 'Sign in to access your autonomous AI team & workspace.'
              : 'Create an account to start building with your AI team.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-mode-tabs">
          <button
            type="button"
            className={"auth-mode-tab " + (mode === 'login' ? 'active' : '')}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={"auth-mode-tab " + (mode === 'signup' ? 'active' : '')}
            onClick={() => setMode('signup')}
          >
            Get Started
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-field-icon" />
                <input
                  type="text"
                  placeholder="Alex Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Work Email</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-field-icon" />
              <input
                type="email"
                placeholder="developer@agentmesh.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <div className="auth-label-row">
              <label>Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  className="forgot-pass-btn"
                  onClick={() => alert("Password reset link sent to demo email.")}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-field-icon" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-options-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            <span>{isLoading ? 'Entering Workspace...' : (mode === 'login' ? 'Login & Enter Workspace' : 'Create Account & Start')}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-divider">
          <span>OR SIGN IN WITH</span>
        </div>

        {/* Social and Demo Buttons */}
        <div className="social-auth-grid">
          <button type="button" className="social-auth-btn" onClick={handleDemoLogin}>
            <GithubIcon />
            <span>GitHub</span>
          </button>

          <button type="button" className="social-auth-btn" onClick={handleDemoLogin}>
            <GoogleIcon />
            <span>Google</span>
          </button>
        </div>

        {/* Instant Demo Access Pill */}
        <div className="demo-access-banner" onClick={handleDemoLogin}>
          <CheckCircle2 size={16} className="demo-check" />
          <div className="demo-text">
            <strong>Instant Demo Access</strong>
            <span>One-click login to explore the live multi-agent workspace</span>
          </div>
          <span className="demo-arrow">→</span>
        </div>
      </div>
    </div>
  );
}