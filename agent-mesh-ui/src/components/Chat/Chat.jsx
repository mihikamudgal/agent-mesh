import React from 'react';
import MessageList from './MessageList';
import { SlidersHorizontal, Download, Bot, SplitSquareVertical, Maximize2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Chat({
  messages,
  loading,
  onSendMessage,
  agents,
  selectedAgentId,
  onSelectAgent,
  viewMode,
  onViewModeChange,
  onOpenSettings,
  onExportChat,
  onOpenFileInWorkspace,
  onAttachClick,
  backendStatus
}) {
  const currentAgent = agents.find(a => a.id === selectedAgentId) || { name: 'Auto Mesh Router', role: 'Autonomous' };

  return (
    <div className="chat-view-root">
      {/* Top Navbar Header */}
      <header className="chat-top-navbar">
        <div className="navbar-left">
          <div className="model-selector-chip">
            <Sparkles size={15} className="model-sparkle" />
            <select
              value={selectedAgentId}
              onChange={(e) => onSelectAgent(e.target.value)}
              className="model-select-clean"
            >
              <option value="auto">Agent Mesh Orchestrator (Auto)</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name} — {a.role}</option>
              ))}
            </select>
          </div>

          <div className="mesh-status-indicator">
            <span className={"status-pip " + (backendStatus.connected ? 'active' : 'simulated')} />
            <span className="status-label">
              {backendStatus.connected ? 'Connected: :8080' : 'Autonomous Mesh (Local)'}
            </span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="view-mode-toggle" title="Layout Mode">
            <button
              className={"view-mode-btn " + (viewMode === 'chat' ? 'active' : '')}
              onClick={() => onViewModeChange('chat')}
              title="Chat Only Canvas"
            >
              Chat
            </button>
            <button
              className={"view-mode-btn " + (viewMode === 'split' ? 'active' : '')}
              onClick={() => onViewModeChange('split')}
              title="Split View (Chat + Workspace)"
            >
              <SplitSquareVertical size={14} />
              <span>Split</span>
            </button>
          </div>

          <button
            className="navbar-action-btn"
            onClick={onOpenSettings}
            title="Mesh & Agent Settings"
          >
            <SlidersHorizontal size={15} />
            <span>Configuration</span>
          </button>

          <button
            className="navbar-action-btn"
            onClick={onExportChat}
            title="Export conversation"
          >
            <Download size={15} />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* Main Messages & Canvas Body */}
      <main className="chat-body-canvas">
        <MessageList
          messages={messages}
          loading={loading}
          onSendMessage={onSendMessage}
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={onSelectAgent}
          onOpenFileInWorkspace={onOpenFileInWorkspace}
          onAttachClick={onAttachClick}
          onOpenSettings={onOpenSettings}
        />
      </main>
    </div>
  );
}