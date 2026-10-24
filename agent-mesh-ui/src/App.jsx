import React, { useState, useEffect } from 'react';
import LandingPage from './components/Landing/LandingPage';
import AuthModal from './components/Auth/AuthModal';
import Layout from './components/Layout/Layout';
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat';
import Workspace from './components/Workspace/Workspace';
import SettingsModal from './components/Settings/SettingsModal';
import { AGENTS, WORKSPACE_FILES, MOCK_DIFFS } from './data/mockData';
    import {
  checkBackendStatus,
  askAgent,
  getChats,
  createChat,
  getChat,
  saveChatMessage,
  deleteChatFromBackend
} from './services/api';
import './App.css';

export default function App() {
  // Screen state: 'landing' or 'app'
 const [currentScreen, setCurrentScreen] = useState(() => {
   const token =
     localStorage.getItem('agentMeshToken') ||
     sessionStorage.getItem('agentMeshToken');

   const savedUser = localStorage.getItem('agent_mesh_user');

   return token && savedUser ? 'app' : 'landing';
 });
  
  // Auth state (Frontend only)
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agent_mesh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
});
useEffect(() => {
  let cancelled = false;

  async function loadChats() {
    try {
      const data = await getChats();

      if (!cancelled) {
        setChats(data.map(chat => ({
          id: String(chat.id),
          title: chat.title,
          updatedAt: chat.updatedAt,
          activeAgentId: chat.agentId,
          messages: (chat.messages || []).map(message => ({
            id: String(message.id),
            sender: message.sender,
            text: message.content,
            agentId: message.agentId,
            agentName: message.agentName,
            agentRole: message.agentRole,
            agentColor: message.agentColor,
            timestamp: message.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : ""
          }))
        })));
      }
    } catch (error) {
      console.error("Failed to load saved chats:", error);
    } finally {
      if (!cancelled) setChatsLoaded(true);
    }
  }

  loadChats();

  return () => {
    cancelled = true;
  };
}, []);


  const [chats, setChats] = useState([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null); // null shows hero screen in app
  const [agents, setAgents] = useState(AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState('auto');
  const [viewMode, setViewMode] = useState('chat'); // 'chat' | 'split' | 'workspace'
  
  const [files, setFiles] = useState(WORKSPACE_FILES);
  const [diffs, setDiffs] = useState(MOCK_DIFFS);
  const [activeFileId, setActiveFileId] = useState('file-ai-controller');

  const [backendStatus, setBackendStatus] = useState({ connected: false });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check backend status periodically
  const refreshBackendStatus = async () => {
    const status = await checkBackendStatus();
    setBackendStatus(status);
  };

  useEffect(() => {
    refreshBackendStatus();
    const interval = setInterval(refreshBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+N for new chat inside app
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

  // Authentication Handlers (Frontend only)
  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const handleOpenSignup = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };

const handleLoginSuccess = (profile) => {
  setUser(profile);

  try {
    localStorage.setItem('agent_mesh_user', JSON.stringify(profile));
  } catch (error) {
    console.warn('Could not save user profile:', error);
  }

  setCurrentScreen('app');
};

  const handleStartBuilding = () => {
    setCurrentScreen('app');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const currentMessages = activeChat ? activeChat.messages : [];

  const handleNewChat = () => {
    setActiveChatId(null);
    setViewMode('chat');
  };

  const handleSelectChat = async (chatId) => {
    setActiveChatId(String(chatId));
    setViewMode('chat');

    try {
      const chat = await getChat(chatId);

      const loadedChat = {
        id: String(chat.id),
        title: chat.title,
        updatedAt: chat.updatedAt,
        activeAgentId: chat.agentId,
        messages: (chat.messages || []).map(message => ({
          id: String(message.id),
          sender: message.sender,
          text: message.content,
          agentId: message.agentId,
          agentName: message.agentName,
          agentRole: message.agentRole,
          agentColor: message.agentColor,
          timestamp: message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            : ''
        }))
      };

      setChats(prev => [
        loadedChat,
        ...prev.filter(c => c.id !== loadedChat.id)
      ]);
    } catch (error) {
      console.error("Failed to open chat:", error);
    }
  };


 const handleDeleteChat = async (chatId) => {
   try {
     await deleteChatFromBackend(chatId);

     setChats(prev => prev.filter(c => c.id !== String(chatId)));

     if (String(activeChatId) === String(chatId)) {
       setActiveChatId(null);
     }
   } catch (error) {
     console.error("Failed to delete chat:", error);
     alert("Could not delete this conversation.");
   }
 };

  const handleSelectAgent = (agentId) => {
    setSelectedAgentId(agentId);
  };

 const handleSendMessage = async (text) => {
   if (!text.trim() || loading) return;

   setLoading(true);

   let targetChatId = activeChatId;

   const userMsg = {
     id: 'msg-' + Date.now(),
     sender: 'user',
     text,
     timestamp: new Date().toLocaleTimeString([], {
       hour: '2-digit',
       minute: '2-digit'
     })
   };

   try {
     if (!targetChatId) {
       const created = await createChat(
         text.slice(0, 28) + (text.length > 28 ? '...' : ''),
         selectedAgentId
       );

       targetChatId = String(created.id);
       setActiveChatId(targetChatId);

       setChats(prev => [{
         id: targetChatId,
         title: created.title,
         updatedAt: created.updatedAt,
         activeAgentId: selectedAgentId,
         messages: []
       }, ...prev.filter(c => c.id !== targetChatId)]);
     }

     await saveChatMessage(targetChatId, userMsg);

     setChats(prev => prev.map(chat =>
       chat.id === targetChatId
         ? {
             ...chat,
             messages: [...chat.messages, userMsg],
             updatedAt: new Date().toISOString()
           }
         : chat
     ));

     const response = await askAgent(text, selectedAgentId);

     if (!response.success) {
       throw new Error(response.error || 'Request failed.');
     }

     const resolvedAgent =
       agents.find(a => a.id === response.agentId) || agents[0];

     const aiMsg = {
       id: 'msg-ai-' + Date.now(),
       sender: 'ai',
       agentId: resolvedAgent.id,
       agentName: resolvedAgent.name,
       agentRole: resolvedAgent.role,
       agentColor: resolvedAgent.accentColor,
       timestamp: new Date().toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit'
       }),
       text: response.text,
       toolActivities: response.toolActivities || []
     };

     await saveChatMessage(targetChatId, aiMsg);

     setChats(prev => prev.map(chat =>
       chat.id === targetChatId
         ? {
             ...chat,
             messages: [...chat.messages, aiMsg],
             updatedAt: new Date().toISOString()
           }
         : chat
     ));
   } catch (error) {
     console.error("Chat error:", error);

     const errorMsg = {
       id: 'msg-err-' + Date.now(),
       sender: 'ai',
       agentId: 'software-agent',
       agentName: 'AgentCoder',
       agentRole: 'Software Developer',
       agentColor: '#ef4444',
       timestamp: new Date().toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit'
       }),
       text: 'Error: ' + (error.message || 'Unable to complete request.'),
       toolActivities: []
     };

     if (targetChatId) {
       setChats(prev => prev.map(chat =>
         chat.id === targetChatId
           ? { ...chat, messages: [...chat.messages, errorMsg] }
           : chat
       ));
     }
   } finally {
     setLoading(false);
   }
 };


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

  const handleExportChat = () => {
    if (!activeChat || activeChat.messages.length === 0) {
      alert("No messages to export in current session.");
      return;
    }

    let markdown = '# AGENT MESH - ' + activeChat.title + '\nExported on ' + new Date().toLocaleString() + '\n\n---\n\n';
    activeChat.messages.forEach(m => {
      const sender = m.sender === 'user' ? 'User' : (m.agentName || 'AI Agent');
      markdown += '### ' + sender + ' (' + m.timestamp + ')\n\n' + m.text + '\n\n';
      if (m.toolActivities && m.toolActivities.length > 0) {
        markdown += '> **Tools executed:** ' + m.toolActivities.map(t => t.toolName).join(', ') + '\n\n';
      }
      markdown += '---\n\n';
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeChat.title.replace(/\s+/g, '_') + '_transcript.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // If on Landing Screen, render Landing Page
  if (currentScreen === 'landing') {
    return (
      <>
        <LandingPage
          onOpenLogin={handleOpenLogin}
          onOpenSignup={handleOpenSignup}
          onStartBuilding={handleStartBuilding}
          agents={agents}
          user={user}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialMode={authMode}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // App Workspace Screen
  return (
    <>
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
            onGoToLanding={handleBackToLanding}
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

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}