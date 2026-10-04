import React from 'react';
import NewChat from './NewChat';
import ChatHistory from './ChatHistory';
import AgentList from './AgentList';
import { Layers, FolderGit2, Settings, Sparkles, Terminal, Compass } from 'lucide-react';

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  agents,
  activeAgentId,
  onSelectAgent,
  activeView,
  onViewChange,
  backendStatus,
  onOpenSettings,
  onGoToLanding
}) {
  return (
    <aside className="mesh-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo" onClick={onGoToLanding} style={{ cursor: 'pointer' }} title="Go to Landing Page">
          <div className="brand-hex">
            <Sparkles size={18} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <h2>AGENT MESH</h2>
            <span className="brand-tag">Autonomous Core</span>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="sidebar-newchat-container">
        <NewChat onNewChat={onNewChat} />
      </div>

      {/* Scrollable Navigation */}
      <div className="sidebar-scrollable">
        {/* RECENT CHATS */}
        <ChatHistory
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
        />

        <div className="sidebar-divider" />

        {/* AGENTS LIST */}
        <AgentList
          agents={agents}
          activeAgentId={activeAgentId}
          onSelectAgent={onSelectAgent}
        />

        <div className="sidebar-divider" />

        {/* WORKSPACE & SETTINGS NAVIGATION */}
        <div className="sidebar-nav-section">
          {onGoToLanding && (
            <button
              className="sidebar-nav-btn"
              onClick={onGoToLanding}
              title="Return to Landing Page"
            >
              <Compass size={16} color="#c084fc" />
              <span>Landing Page</span>
              <span className="badge-count">✦</span>
            </button>
          )}

          <button
            className={"sidebar-nav-btn " + (activeView === 'chat' ? 'active' : '')}
            onClick={() => onViewChange('chat')}
          >
            <Layers size={16} />
            <span>Chat Canvas</span>
          </button>

          <button
            className={"sidebar-nav-btn " + (activeView === 'workspace' ? 'active' : '')}
            onClick={() => onViewChange('workspace')}
          >
            <FolderGit2 size={16} />
            <span>Workspace</span>
            <span className="badge-count">Files & Diff</span>
          </button>

          <button
            className="sidebar-nav-btn"
            onClick={onOpenSettings}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="sidebar-footer">
        <div className="footer-status-card">
          <div className="status-top">
            <div className="status-pill">
              <span className={"pulse-dot " + (backendStatus?.connected ? 'green' : 'purple')} />
              <span>{backendStatus?.connected ? 'Spring Boot Active' : 'Live Mesh Mode'}</span>
            </div>
            <span className="status-port">:8080</span>
          </div>
          <div className="status-details">
            <Terminal size={12} className="status-icon" />
            <span className="workspace-path">agent-mesh/src/main</span>
          </div>
        </div>
      </div>
    </aside>
  );
}