import React from 'react';
import { Compass, Code, Terminal, CheckCircle2 } from 'lucide-react';

export default function LandingValue() {
  const pillars = [
    {
      step: "01",
      tag: "PLAN",
      title: "Turn an idea into a clear plan.",
      description: "DesignerAgent breaks down requirements into system architecture blueprints, database entity relationships, and verified API contracts before writing code.",
      icon: <Compass size={24} className="pillar-icon plan" />,
      bullets: ["System & Database Architecture", "JPA Entity Relationship Modeling", "REST API Contract Specifications"]
    },
    {
      step: "02",
      tag: "BUILD",
      title: "Write, change, and test the code.",
      description: "AgentCoder reads your project files, implements production-ready Spring Boot services, and executes the Maven Wrapper test suite directly in the workspace.",
      icon: <Code size={24} className="pillar-icon build" />,
      bullets: ["Direct FileSystem Read & Write", "Automated Maven Wrapper Tests", "Interactive Git Diff Inspection"]
    },
    {
      step: "03",
      tag: "RUN",
      title: "Execute tasks and see what happens.",
      description: "OpsAgent containerizes services with Docker, checks environment configurations, runs PowerShell commands, and monitors terminal outputs.",
      icon: <Terminal size={24} className="pillar-icon run" />,
      bullets: ["Terminal Process Execution", "Multi-stage Dockerfile Generation", "Continuous Status & Health Telemetry"]
    }
  ];

  return (
    <section id="features" className="landing-value-section">
      <div className="section-head-center">
        <span className="section-eyebrow">UNIFIED ENGINEERING EXPERIENCE</span>
        <h2 className="section-title">Your idea. Your agents. One workspace.</h2>
        <p className="section-subtitle">
          Build, test, and ship without jumping between tools.
        </p>
      </div>

      <div className="pillars-grid">
        {pillars.map((p, idx) => (
          <div key={idx} className="pillar-card">
            <div className="pillar-top">
              <span className="pillar-step">{p.step}</span>
              <span className="pillar-tag">{p.tag}</span>
              <div className="pillar-icon-box">{p.icon}</div>
            </div>

            <h3 className="pillar-title">{p.title}</h3>
            <p className="pillar-desc">{p.description}</p>

            <ul className="pillar-bullets">
              {p.bullets.map((b, bIdx) => (
                <li key={bIdx}>
                  <CheckCircle2 size={14} className="bullet-check" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}