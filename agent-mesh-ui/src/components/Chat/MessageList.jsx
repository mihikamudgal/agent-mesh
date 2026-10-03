import React, { useRef, useEffect } from 'react';
import Message from './Message';
import MeshOrb from './MeshOrb';
import ChatInput from './ChatInput';
import { Sparkles, Code2, Layers, Cpu } from 'lucide-react';

export default function MessageList({
  messages,
  loading,
  onSendMessage,
  agents,
  selectedAgentId,
  onSelectAgent,
  onOpenFileInWorkspace,
  onAttachClick,
  onOpenSettings
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current && messages.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const quickPrompts = [
    { label: "Create REST API", icon: "🌐", text: "Create a secure REST API in Spring Boot for user profile management." },
    { label: "Fix Authentication", icon: "🔐", text: "Fix CORS issue and configure JWT authentication for Vite localhost:5173." },
    { label: "System Design", icon: "📐", text: "Design database schema and relationship diagrams for Agent Mesh tasks." },
    { label: "Run Tests & Diff", icon: "⚡", text: "Run project tests with Maven Wrapper and show the git diff." }
  ];

  // If conversation is empty, display the stunning hero matching the reference image!
  if (messages.length === 0) {
    return (
      <div className="chat-empty-state">
        {/* Animated 3D Glowing Orb */}
        <MeshOrb />

        {/* Hero Title */}
        <div className="hero-text-block">
          <h1 className="hero-headline">Ready to Create Something New?</h1>
          <p className="hero-subline">
            Autonomous multi-agent intelligence orchestrating code, architecture, and infrastructure.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="quick-prompts-row">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              className="quick-chip-btn"
              onClick={() => onSendMessage(p.text)}
            >
              <span className="chip-icon">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Floating Input Centerpiece */}
        <ChatInput
          onSendMessage={onSendMessage}
          loading={loading}
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={onSelectAgent}
          onAttachClick={onAttachClick}
          onOpenSettings={onOpenSettings}
        />

        {/* Bottom Feature Cards (Matching Reference Screenshot) */}
        <div className="hero-feature-cards">
          <div
            className="feature-card"
            onClick={() => onSendMessage("Explain project structure and write a Spring Boot REST service.")}
          >
            <div className="card-top">
              <div className="card-icon dev">
                <Code2 size={16} />
              </div>
              <span className="card-badge">AgentCoder</span>
            </div>
            <h3>Dev Assistant</h3>
            <p>Generate clean, production-ready Java code, refactor services, and run automated tests.</p>
          </div>

          <div
            className="feature-card"
            onClick={() => onSendMessage("Design database schema and API architecture for Agent Mesh.")}
          >
            <div className="card-top">
              <div className="card-icon arch">
                <Layers size={16} />
              </div>
              <span className="card-badge">DesignerAgent</span>
            </div>
            <h3>System Design</h3>
            <p>Model PostgreSQL entity relations, map JPA entities, and define API contracts.</p>
          </div>

          <div
            className="feature-card"
            onClick={() => onSendMessage("Inspect container status and generate Dockerfile.")}
          >
            <div className="card-top">
              <div className="card-icon ops">
                <Cpu size={16} />
              </div>
              <span className="card-badge">OpsAgent</span>
            </div>
            <h3>DevOps & Infrastructure</h3>
            <p>Automate Docker containerization, configure CI/CD pipelines, and inspect terminal outputs.</p>
          </div>
        </div>
      </div>
    );
  }

  // Active chat state
  return (
    <div className="chat-messages-container">
      <div className="messages-scroll-area">
        {messages.map((msg, index) => (
          <Message
            key={msg.id || index}
            message={msg}
            onOpenFileInWorkspace={onOpenFileInWorkspace}
          />
        ))}

        {loading && (
          <div className="message-row ai-row loading-row">
            <div className="agent-avatar-circle pulsing">
              <Sparkles size={16} className="spin-slow" />
            </div>
            <div className="message-body">
              <div className="thinking-indicator">
                <span className="thinking-text">Agent Mesh is executing tools & synthesizing...</span>
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Floating Input at bottom of active conversation */}
      <ChatInput
        onSendMessage={onSendMessage}
        loading={loading}
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={onSelectAgent}
        onAttachClick={onAttachClick}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}