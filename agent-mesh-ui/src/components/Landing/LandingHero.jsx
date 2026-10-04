import React from 'react';
import { ArrowRight, Terminal, Layers, Code2, Play } from 'lucide-react';

export default function LandingHero({ onStartBuilding, onOpenLogin }) {
  return (
    <header className="landing-hero-section">
      <div className="landing-ambient-glow" aria-hidden="true" />

      {/* Hero Badge */}
      <div className="hero-announcement-pill">
        <span className="spark-dot" />
        <span>Next-Generation Autonomous Multi-Agent Engineering</span>
      </div>

      {/* Hero Headline: BUILD WITH AN AI TEAM */}
      <div className="hero-title-container">
        <h1 className="hero-big-title">
          BUILD WITH <br />
          <span className="hero-gradient-text">AN AI TEAM</span>
        </h1>
        <p className="hero-description">
          Autonomous agents that reason, collaborate, and execute software tasks.
        </p>
      </div>

      {/* [ Start Building ] CTA */}
      <div className="hero-cta-group">
        <button className="hero-primary-btn" onClick={onStartBuilding}>
          <span>Start Building</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>

        <a href="#how-it-works" className="hero-secondary-btn">
          <Play size={14} fill="currentColor" />
          <span>See How It Works</span>
        </a>
      </div>

      {/* Trio of Agents: AgentCoder, DesignerAgent, OpsAgent */}
      <div className="hero-agents-showcase">
        <div className="hero-agent-card dev" onClick={onStartBuilding}>
          <div className="agent-card-header">
            <span className="agent-status-light green" />
            <strong className="agent-title">AgentCoder</strong>
            <span className="agent-role-pill">Software Developer</span>
          </div>
          <div className="agent-task-preview">
            <span className="task-prompt">Writing Java controller & executing Maven tests</span>
            <div className="agent-code-chip">
              <code>Execution.runTests() → BUILD SUCCESS</code>
            </div>
          </div>
        </div>

        <div className="hero-agent-card design" onClick={onStartBuilding}>
          <div className="agent-card-header">
            <span className="agent-status-light purple" />
            <strong className="agent-title">DesignerAgent</strong>
            <span className="agent-role-pill">Software Designer</span>
          </div>
          <div className="agent-task-preview">
            <span className="task-prompt">Architecting PostgreSQL schema & entity relationships</span>
            <div className="agent-code-chip">
              <code>CREATE TABLE agent_memory (...)</code>
            </div>
          </div>
        </div>

        <div className="hero-agent-card ops" onClick={onStartBuilding}>
          <div className="agent-card-header">
            <span className="agent-status-light blue" />
            <strong className="agent-title">OpsAgent</strong>
            <span className="agent-role-pill">DevOps Engineer</span>
          </div>
          <div className="agent-task-preview">
            <span className="task-prompt">Building Docker pipelines & monitoring terminal</span>
            <div className="agent-code-chip">
              <code>docker ps --filter name=agentmesh</code>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}