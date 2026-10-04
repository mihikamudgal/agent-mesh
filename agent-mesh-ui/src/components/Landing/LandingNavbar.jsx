import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LandingNavbar({
  onOpenLogin,
  onOpenSignup,
  onEnterWorkspace,
  user
}) {
  return (
    <nav className="landing-navbar">
      <div className="landing-nav-inner">
        {/* ✦ AGENT MESH Logo */}
        <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="landing-brand-hex">
            <Sparkles size={18} className="brand-icon-spark" />
          </div>
          <span className="landing-brand-title">AGENT MESH</span>
        </div>

        {/* Navigation links */}
        <div className="landing-nav-links">
          <a href="#about" className="landing-nav-link">What is it?</a>
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How It Works</a>
          <a href="#agents" className="landing-nav-link">AI Agents</a>
        </div>

        {/* Login and Get Started */}
        <div className="landing-nav-actions">
          {user ? (
            <div className="user-logged-chip" onClick={onEnterWorkspace} title="Go to Workspace">
              <span className="user-avatar-tag">{user.avatar || '👨‍💻'}</span>
              <span className="user-name-tag">{user.name}</span>
              <span className="workspace-badge">Open App →</span>
            </div>
          ) : (
            <>
              <button className="landing-login-btn" onClick={onOpenLogin}>
                Login
              </button>
              <button className="landing-getstarted-btn" onClick={onOpenSignup}>
                <span>Get Started</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}