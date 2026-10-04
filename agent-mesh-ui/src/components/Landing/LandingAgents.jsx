import React from 'react';
import { Wrench, Code2, Layers, Terminal } from 'lucide-react';

export default function LandingAgents({ agents, onSelectAgentForTask }) {
  return (
    <section id="agents" className="landing-agents-section">
      <div className="section-head-center">
        <span className="section-eyebrow">THE SPECIALISTS</span>
        <h2 className="section-title">Meet Your Autonomous AI Team</h2>
        <p className="section-subtitle">
          Specialized expertise working in harmony. Each agent comes pre-equipped with dedicated tools and system parameters.
        </p>
      </div>

      <div className="agents-deep-grid">
        {agents.map((agent) => {
          const isDev = agent.id === 'software-agent';
          const isDesign = agent.id === 'designer-agent';
          const isOps = agent.id === 'ops-agent';

          let icon = <Code2 size={24} />;
          if (isDesign) icon = <Layers size={24} />;
          if (isOps) icon = <Terminal size={24} />;

          return (
            <div key={agent.id} className="agent-detail-card" style={{ '--agent-accent': agent.accentColor }}>
              <div className="agent-card-accent-bar" />
              
              <div className="agent-card-top-info">
                <div className="agent-avatar-box" style={{ borderColor: agent.accentColor }}>
                  {icon}
                </div>
                <div className="agent-name-group">
                  <h3>{agent.name}</h3>
                  <span className="agent-role-title">{agent.role}</span>
                </div>
                <span className="agent-status-badge">
                  <span className="status-dot" style={{ backgroundColor: agent.badgeColor }} />
                  <span>{agent.status}</span>
                </span>
              </div>

              <p className="agent-description-text">{agent.description}</p>

              <div className="agent-tools-section">
                <span className="tools-title">ENABLED TOOLS:</span>
                <div className="tools-pills-row">
                  {agent.tools.map((t, tIdx) => (
                    <span key={tIdx} className="tool-pill">
                      <Wrench size={11} />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="agent-prompt-quote">
                <em>"{agent.systemPrompt}"</em>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}