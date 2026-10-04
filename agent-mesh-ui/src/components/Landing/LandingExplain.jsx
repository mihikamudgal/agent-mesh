import React from 'react';
import { HelpCircle, Zap, Network } from 'lucide-react';

export default function LandingExplain() {
  const faqs = [
    {
      id: "what",
      icon: <HelpCircle size={22} className="explain-icon purple" />,
      title: "What is Agent Mesh?",
      answer: "Agent Mesh is an autonomous multi-AI agent ecosystem designed for end-to-end software engineering. Rather than relying on a single monolithic chatbot that suffers from hallucinations and context loss, Agent Mesh coordinates specialized agents (Software Developer, Software Designer, DevOps Engineer) working together in a unified workspace."
    },
    {
      id: "why",
      icon: <Zap size={22} className="explain-icon yellow" />,
      title: "Why should I use it?",
      answer: "Traditional AI assistants generate isolated code snippets that you have to copy, paste, and debug manually. Agent Mesh directly inspects your project files, edits code, runs Maven tests (.mvnw test), and generates git diffs before merging. You eliminate context switching and get verified, working software."
    },
    {
      id: "how",
      icon: <Network size={22} className="explain-icon blue" />,
      title: "How does it work?",
      answer: "When you give a prompt, the Mesh Router automatically classifies the task and assigns it to the specialist agent. Agents communicate through an intercomm protocol, call workspace tools (FileSystem, Execution, AssignTask), and surface live execution steps and diffs in your browser."
    }
  ];

  return (
    <section id="about" className="landing-explain-section">
      <div className="section-head-center">
        <span className="section-eyebrow">DEEP DIVE</span>
        <h2 className="section-title">The Multi-Agent Advantage</h2>
        <p className="section-subtitle">
          Everything you need to understand how Agent Mesh transforms software development.
        </p>
      </div>

      <div className="explain-cards-container">
        {faqs.map((item) => (
          <div key={item.id} className="explain-card">
            <div className="explain-card-header">
              <div className="explain-icon-wrapper">{item.icon}</div>
              <h3>{item.title}</h3>
            </div>
            <p className="explain-card-body">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* How it Works Diagram */}
      <div id="how-it-works" className="how-it-works-banner">
        <div className="how-banner-head">
          <span className="how-badge">MESH PIPELINE</span>
          <h3>How Agent Mesh Executes Your Task</h3>
        </div>

        <div className="pipeline-steps-row">
          <div className="pipeline-step">
            <span className="step-num">1</span>
            <strong>Your Prompt</strong>
            <p>Task or feature request submitted</p>
          </div>
          <span className="pipeline-arrow">→</span>

          <div className="pipeline-step">
            <span className="step-num">2</span>
            <strong>Mesh Router</strong>
            <p>Autonomous task classification & routing</p>
          </div>
          <span className="pipeline-arrow">→</span>

          <div className="pipeline-step">
            <span className="step-num">3</span>
            <strong>Tool Execution</strong>
            <p>FileSystem, Tests & Shell execution</p>
          </div>
          <span className="pipeline-arrow">→</span>

          <div className="pipeline-step">
            <span className="step-num">4</span>
            <strong>Verified Code</strong>
            <p>Inspected via CodeViewer & Git Diff</p>
          </div>
        </div>
      </div>
    </section>
  );
}