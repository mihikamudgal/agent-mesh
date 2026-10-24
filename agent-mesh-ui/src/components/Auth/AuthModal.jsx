
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
} from 'lucide-react';
import './Auth.css';

const AUTH_URL = 'http://localhost:8080/api/auth';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
}) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint =
        mode === 'login' ? '/login' : '/signup';

      const response = await fetch(`${AUTH_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          'Authentication failed. Please try again.'
        );
      }

      if (!data.token) {
        throw new Error('The server did not return an authentication token.');
      }

      // Remember me controls whether the session survives closing the tab.
      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      otherStorage.removeItem('agentMeshToken');
      otherStorage.removeItem('agentMeshEmail');

      storage.setItem('agentMeshToken', data.token);
      storage.setItem('agentMeshEmail', data.email);

      const userProfile = {
        name: mode === 'signup' && name.trim()
          ? name.trim()
          : data.email.split('@')[0],
        email: data.email,
        role: 'Lead Architect',
        avatar: '👨‍💻',
      };

      onLoginSuccess?.(userProfile);
      onClose();
    } catch (err) {
      setError(
        err.message || 'Could not connect to the server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="auth-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-close-btn"
          onClick={onClose}
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles size={20} className="auth-sparkle" />
          </div>

          <h2>
            {mode === 'login'
              ? 'Welcome to Agent Mesh'
              : 'Join Agent Mesh'}
          </h2>

          <p>
            {mode === 'login'
              ? 'Sign in to access your autonomous AI team & workspace.'
              : 'Create an account to start building with your AI team.'}
          </p>
        </div>

        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`auth-mode-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeChange('login')}
          >
            Login
          </button>

          <button
            type="button"
            className={`auth-mode-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => handleModeChange('signup')}
          >
            Get Started
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-field-icon" />
                <input
                  type="text"
                  placeholder="Your name"
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
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <div className="auth-label-row">
              <label>Password</label>
            </div>

            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-field-icon" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === 'login'
                    ? 'current-password'
                    : 'new-password'
                }
                minLength={mode === 'signup' ? 8 : undefined}
                required
              />
            </div>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

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

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            <span>
              {isLoading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Login & Enter Workspace'
                  : 'Create Account & Start'}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
