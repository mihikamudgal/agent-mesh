import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat';
import Workspace from './components/Workspace/Workspace';
import SettingsModal from './components/Settings/SettingsModal';
import { AGENTS, INITIAL_CHATS, WORKSPACE_FILES, MOCK_DIFFS } from './data/mockData';
import { checkBackendStatus, askAgent } from './services/api';
import './App.css';

export default function App() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(null); // null shows the stunning hero screen!
  const [agents, setAgents] = useState(AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState('auto');
  const [viewMode, setViewMode] = useState('chat'); // 'chat' | 'split' | 'workspace'
  
  const [files, setFiles] = useState(WORKSPACE_FILES);
  const [diffs, setDiffs] = useState(MOCK_DIFFS);
  const [activeFileId, setActiveFileId] = useState('file-ai-controller');

  const [backendStatus, setBackendStatus] = useState({ connected: false });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check backend connectivity on mount and periodically
  const refreshBackendStatus = async () => {
    const status = await checkBackendStatus();
    setBackendStatus(status);
    if (status.connected) {
      setAgents(prev => prev.map(a => ({ ...a, status: 'online' })));
    }
  };

  useEffect(() => {
    refreshBackendStatus();
    const interval = setInterval(refreshBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut: Ctrl+N or Cmd+N for new chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const currentMessages = activeChat ? activeChat.messages : [];

  // Start fresh chat / Hero screen
  const handleNewChat = () => {
    setActiveChatId(null);
    setViewMode('chat');
  };

  // Select historical chat
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setViewMode('chat');
  };

  // Delete chat
  const handleDeleteChat = (chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  // Select agent
  const handleSelectAgent = (agentId) => {
    setSelectedAgentId(agentId);
  };

  // Send message
  const handleSendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let targetChatId = activeChatId;

    if (!targetChatId) {
      // Create new chat
      const newId = 'chat-' + Date.now();
      const firstTitle = text.slice(0, 28) + (text.length > 28 ? '...' : '');
      const newChatObj = {
        id: newId,
        title: firstTitle,
        updatedAt: 'Just now',
        activeAgentId: selectedAgentId,
        messages: [userMsg]
      };
      setChats(prev => [newChatObj, ...prev]);
      setActiveChatId(newId);
      targetChatId = newId;
    } else {
      setChats(prev => prev.map(c => {
        if (c.id === targetChatId) {
          return { ...c, messages: [...c.messages, userMsg], updatedAt: 'Just now' };
        }
        return c;
      }));
    }

    setLoading(true);

    try {
      const response = await askAgent(text, selectedAgentId);

      const resolvedAgent = agents.find(a => a.id === response.agentId) || agents[0];

      const aiMsg = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        agentId: resolvedAgent.id,
        agentName: resolvedAgent.name,
        agentRole: resolvedAgent.role,
        agentColor: resolvedAgent.accentColor,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        toolActivities: response.toolActivities || []
      };

      setChats(prev => prev.map(c => {
        if (c.id === targetChatId) {
          return { ...c, messages: [...c.messages, aiMsg] };
        }
        return c;
      }));
    } catch (err) {
      console.error("Agent error:", err);
      const errorMsg = {
        id: 'msg-err-' + Date.now(),
        sender: 'ai',
        agentId: 'software-agent',
        agentName: 'AgentCoder',
        agentRole: 'Software Developer',
        agentColor: '#ef4444',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Sorry, could not communicate with Agent Mesh. Check the connection in Settings.',
        toolActivities: []
      };
      setChats(prev => prev.map(c => {
        if (c.id === targetChatId) {
          return { ...c, messages: [...c.messages, errorMsg] };
        }
        return c;
      }));
    } finally {
      setLoading(false);
    }
  };

  // Open file in workspace from chat code block
  const handleOpenFileInWorkspace = (languageOrPath) => {
    if (languageOrPath === 'java') {
      setActiveFileId('file-ai-controller');
    } else if (languageOrPath === 'properties') {
      setActiveFileId('file-app-props');
    } else if (languageOrPath === 'xml') {
      setActiveFileId('file-pom');
    }
    setViewMode('workspace');
  };

  // Export current conversation to Markdown
  const handleExportChat = () => {
    if (!activeChat || activeChat.messages.length === 0) {
      alert("No messages to export in current session.");
      return;
    }

    let markdown = `# AGENT MESH - ${activeChat.title}\nExported on ${new Date().toLocaleString()}\n\n---\n\n`;
    activeChat.messages.forEach(m => {
      const sender = m.sender === 'user' ? 'User' : (m.agentName || 'AI Agent');
      markdown += `### ${sender} (${m.timestamp})\n\n${m.text}\n\n`;
      if (m.toolActivities && m.toolActivities.length > 0) {
        markdown += `> **Tools executed:** ${m.toolActivities.map(t => t.toolName).join(', ')}\n\n`;
      }
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChat.title.replace(/\s+/g, '_')}_transcript.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout
      viewMode={viewMode}
      sidebar={
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          agents={agents}
          activeAgentId={selectedAgentId}
          onSelectAgent={handleSelectAgent}
          activeView={viewMode}
          onViewChange={setViewMode}
          backendStatus={backendStatus}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      }
      chat={
        <Chat
          messages={currentMessages}
          loading={loading}
          onSendMessage={handleSendMessage}
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={handleSelectAgent}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onExportChat={handleExportChat}
          onOpenFileInWorkspace={handleOpenFileInWorkspace}
          onAttachClick={() => setViewMode('workspace')}
          backendStatus={backendStatus}
        />
      }
      workspace={
        <Workspace
          files={files}
          diffs={diffs}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId}
        />
      }
      settingsModal={
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          backendStatus={backendStatus}
          onStatusRefresh={refreshBackendStatus}
        />
      }
    />
  );
}