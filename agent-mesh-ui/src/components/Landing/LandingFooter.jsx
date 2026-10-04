import React from 'react';
import { Sparkles, ArrowRight, Terminal } from 'lucide-react';

export default function LandingFooter({ onStartBuilding, onOpenLogin }) {
  return (
    <footer className="landing-footer-wrapper">
      <div className="footer-cta-card">
        <div className="cta-ambient" aria-hidden="true" />
        <div className="cta-content">
          <h2>Ready to Build with Your AI Team?</h2>
          <p>Launch Agent Mesh now to begin building, testing, and shipping in seconds.</p>
          <button className="cta-launch-btn" onClick={onStartBuilding}>
            <span>Start Building Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="landing-footer-bottom">
        <div className="footer-brand">
          <div className="brand-hex-small">
            <Sparkles size={14} />
          </div>
          <span>AGENT MESH</span>
          <span className="footer-ver">v1.0.0</span>
        </div>

        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#agents">Agents</a>
          <button onClick={onOpenLogin} className="footer-login-link">Login</button>
        </div>

        <div className="footer-system-status">
          <Terminal size={12} />
          <span>Spring Boot 3.3.2 • Ollama qwen3:4b • PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
}