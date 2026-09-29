import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const cleanResponse = (text) => {
    if (!text) return "";

    if (text.includes("</think>")) {
      return text.split("</think>").pop().trim();
    }

    if (text.includes("<think>")) {
      return text
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .trim();
    }

    return text.trim();
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage
      }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/agent/ask?question=${encodeURIComponent(userMessage)}`
      );

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.text();

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: cleanResponse(data)
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, something went wrong while contacting Agent Mesh."
        }
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([]);
    setMessage("");
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">✦</div>

          <div>
            <h1>Agent Mesh</h1>
            <span>AI Development Workspace</span>
          </div>
        </div>

        {/* New Chat */}
        <button className="new-chat" onClick={newChat}>
          <span className="new-chat-icon">＋</span>
          <span>New Chat</span>
        </button>

        {/* Workspace */}
        <div className="sidebar-section workspace-section">

          <p className="section-title">Workspace</p>

          <div className="sidebar-nav">

            <button className="nav-item active">
              <span className="nav-icon">◉</span>
              <span>Chat</span>
            </button>

            <button className="nav-item">
              <span className="nav-icon">◇</span>
              <span>Agents</span>
            </button>

            <button className="nav-item">
              <span className="nav-icon">▣</span>
              <span>Project</span>
            </button>

            <button className="nav-item">
              <span className="nav-icon">ϟ</span>
              <span>Activity</span>
            </button>

          </div>

        </div>

        {/* Recent Chats */}
        <div className="sidebar-section recent-section">

          <p className="section-title">Recent Chats</p>

          <div className="chat-history">

            <button className="history-item active">
              <span className="history-icon">◌</span>
              <span>Current Chat</span>
            </button>

            <button className="history-item">
              <span className="history-icon">◌</span>
              <span>Spring Boot Project</span>
            </button>

            <button className="history-item">
              <span className="history-icon">◌</span>
              <span>API Development</span>
            </button>

          </div>

        </div>

        {/* Bottom */}
        <div className="sidebar-bottom">

          {/* Agent Status */}
          <div className="agent-status">

            <div className="agent-status-indicator">
              <span className="status-dot"></span>
            </div>

            <div className="agent-info">
              <strong>AgentCoder</strong>
              <small>Ready</small>
            </div>

            <span className="agent-menu">•••</span>

          </div>

          {/* Settings */}
          <button className="settings-button">
            <span className="settings-icon">⚙</span>
            <span>Settings</span>
          </button>

        </div>

      </aside>

      {/* MAIN CHAT */}
      <main className="chat">

        <header className="chat-header">

          <div>
            <h2>AgentCoder</h2>
            <p>Software Developer Agent</p>
          </div>

          <div className="connection-status">
            <span></span>
            Connected
          </div>

        </header>

        {/* Messages */}
        <div className="messages">

          {messages.length === 0 ? (

            <div className="welcome">

              <div className="welcome-icon">
                ✦
              </div>

              <h2>How can I help you?</h2>

              <p>
                Build, modify, debug, or analyze your project
                with Agent Mesh.
              </p>

              <div className="suggestions">

                <button
                  onClick={() =>
                    setMessage("Explain the structure of my project")
                  }
                >
                  📁 Explain my project
                </button>

                <button
                  onClick={() =>
                    setMessage("Find and fix bugs in my project")
                  }
                >
                  🐛 Find and fix bugs
                </button>

                <button
                  onClick={() =>
                    setMessage("Create a REST API")
                  }
                >
                  ⚡ Create a REST API
                </button>

              </div>

            </div>

          ) : (

            messages.map((msg, index) => (

              <div
                key={index}
                className={`message-row ${msg.sender}`}
              >

                <div className="message-avatar">
                  {msg.sender === "user" ? "You" : "✦"}
                </div>

                <div className="message-content">

                  <div className="message-name">
                    {msg.sender === "user"
                      ? "You"
                      : "AgentCoder"}
                  </div>

                  <div className="message-text">
                    {msg.text}
                  </div>

                </div>

              </div>

            ))

          )}

          {loading && (

            <div className="message-row ai">

              <div className="message-avatar">
                ✦
              </div>

              <div className="message-content">

                <div className="message-name">
                  AgentCoder
                </div>

                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>

            </div>

          )}

        </div>

        {/* Input */}
        <div className="input-wrapper">

          <div className="input-area">

            <input
              type="text"
              placeholder="Ask Agent Mesh anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              disabled={loading}
            />

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={loading || !message.trim()}
            >
              ↑
            </button>

          </div>

          <p className="input-hint">
            Agent Mesh can read, modify, and test your project.
          </p>

        </div>

      </main>

    </div>
  );
}

export default App;