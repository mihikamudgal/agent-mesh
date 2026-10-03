import React, { useState } from 'react';
import { X, Server, Cpu, Network, Folder, CheckCircle2, AlertCircle, RefreshCw, Terminal, Sliders } from 'lucide-react';
import { checkBackendStatus } from '../../services/api';

export default function SettingsModal({ isOpen, onClose, backendStatus, onStatusRefresh }) {
  const [activeTab, setActiveTab] = useState('server');
  const [backendUrl, setBackendUrl] = useState('http://localhost:8080');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [selectedModel, setSelectedModel] = useState('qwen3:4b');
  const [workspacePath, setWorkspacePath] = useState('C:/Users/KIIT/Downloads/agent-mesh/agent-mesh');
  const [pingTesting, setPingTesting] = useState(false);
  const [pingResult, setPingResult] = useState(null);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setPingTesting(true);
    setPingResult(null);
    try {
      const res = await checkBackendStatus();
      setPingResult(res);
      if (onStatusRefresh) onStatusRefresh();
    } catch (e) {
      setPingResult({ connected: false, error: e.message });
    } finally {
      setPingTesting(false);
    }
  };

  return (
    <div className="settings-modal-backdrop" onClick={onClose}>
      <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-header">
          <div className="settings-title-group">
            <Sliders size={18} className="settings-icon" />
            <div>
              <h2>Agent Mesh Configuration</h2>
              <p>Manage multi-agent orchestration, backend connectivity, and local models</p>
            </div>
          </div>
          <button className="settings-close-btn" onClick={onClose} title="Close settings">
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="settings-nav-tabs">
          <button
            className={"settings-tab-btn " + (activeTab === 'server' ? 'active' : '')}
            onClick={() => setActiveTab('server')}
          >
            <Server size={14} />
            <span>Backend Server</span>
          </button>

          <button
            className={"settings-tab-btn " + (activeTab === 'ollama' ? 'active' : '')}
            onClick={() => setActiveTab('ollama')}
          >
            <Cpu size={14} />
            <span>Ollama & AI Models</span>
          </button>

          <button
            className={"settings-tab-btn " + (activeTab === 'mesh' ? 'active' : '')}
            onClick={() => setActiveTab('mesh')}
          >
            <Network size={14} />
            <span>Multi-Agent Mesh</span>
          </button>

          <button
            className={"settings-tab-btn " + (activeTab === 'workspace' ? 'active' : '')}
            onClick={() => setActiveTab('workspace')}
          >
            <Folder size={14} />
            <span>Workspace</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="settings-content-body">
          {activeTab === 'server' && (
            <div className="settings-tab-pane">
              <div className="form-group">
                <label>Spring Boot Backend Base URL</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    className="settings-input"
                  />
                  <button
                    className="test-ping-btn"
                    onClick={handleTestPing}
                    disabled={pingTesting}
                  >
                    <RefreshCw size={13} className={pingTesting ? 'spin' : ''} />
                    <span>{pingTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>
                <span className="field-hint">Default: `http://localhost:8080` running Spring Boot 3.3.2</span>
              </div>

              {pingResult && (
                <div className={"connection-result-banner " + (pingResult.connected ? 'success' : 'warning')}>
                  {pingResult.connected ? (
                    <>
                      <CheckCircle2 size={16} />
                      <div>
                        <strong>Connected to Spring Boot!</strong>
                        <p>AiAgentController & AgentManager endpoints responsive.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      <div>
                        <strong>Spring Boot is currently offline or unreachable ({pingResult.error})</strong>
                        <p>Agent Mesh UI is running in simulated live mesh mode with interactive agents.</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="helper-terminal-box">
                <div className="helper-header">
                  <Terminal size={13} />
                  <span>How to run the Spring Boot backend:</span>
                </div>
                <pre className="terminal-snippet">
cd C:\Users\KIIT\Downloads\agent-mesh\agent-mesh
.\mvnw.cmd spring-boot:run
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ollama' && (
            <div className="settings-tab-pane">
              <div className="form-group">
                <label>Ollama Server Endpoint</label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="settings-input"
                />
                <span className="field-hint">Configured in `spring.ai.ollama.base-url`</span>
              </div>

              <div className="form-group">
                <label>Active Chat Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="settings-select"
                >
                  <option value="qwen3:4b">qwen3:4b (Fast & Efficient, Current Default)</option>
                  <option value="llama3.2:3b">llama3.2:3b (Meta LLaMA 3.2)</option>
                  <option value="mistral:latest">mistral:latest (Mistral 7B)</option>
                  <option value="deepseek-r1:1.5b">deepseek-r1:1.5b (Reasoning Model)</option>
                </select>
                <span className="field-hint">Configured in `spring.ai.ollama.chat.model`</span>
              </div>

              <div className="toggle-row">
                <div>
                  <strong>Disable Deep Thinking Output</strong>
                  <p>Strip `&lt;think&gt;` tags for clean, direct response generation</p>
                </div>
                <span className="badge-active">Enabled (think=false)</span>
              </div>
            </div>
          )}

          {activeTab === 'mesh' && (
            <div className="settings-tab-pane">
              <div className="agent-topology-cards">
                <div className="topology-card">
                  <div className="card-agent-badge" style={{ borderColor: '#10b981', color: '#10b981' }}>
                    AgentCoder (software-agent)
                  </div>
                  <p><strong>Role:</strong> Software Developer</p>
                  <p><strong>Tools:</strong> `FileSystem`, `Execution`, `AssignTask`</p>
                  <p><strong>Keywords:</strong> Default fallback, build, implement, develop, create</p>
                </div>

                <div className="topology-card">
                  <div className="card-agent-badge" style={{ borderColor: '#a855f7', color: '#a855f7' }}>
                    DesignerAgent (designer-agent)
                  </div>
                  <p><strong>Role:</strong> Software Designer</p>
                  <p><strong>Tools:</strong> `FileSystem`</p>
                  <p><strong>Keywords:</strong> design, architecture, schema, database, entity</p>
                </div>

                <div className="topology-card">
                  <div className="card-agent-badge" style={{ borderColor: '#38bdf8', color: '#38bdf8' }}>
                    OpsAgent (ops-agent)
                  </div>
                  <p><strong>Role:</strong> DevOps Engineer</p>
                  <p><strong>Tools:</strong> `Execution`</p>
                  <p><strong>Keywords:</strong> deploy, deployment, docker, server, devops</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="settings-tab-pane">
              <div className="form-group">
                <label>Agent Filesystem Workspace Path</label>
                <input
                  type="text"
                  value={workspacePath}
                  onChange={(e) => setWorkspacePath(e.target.value)}
                  className="settings-input"
                />
                <span className="field-hint">Bound to `agent.filesystem.workspace` in backend</span>
              </div>

              <div className="info-box-styled">
                <strong>Workspace Security Boundary</strong>
                <p>
                  The FileSystem tool restricts read/write/execute operations strictly inside
                  this path using `resolvePath()` containment checks.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button className="settings-secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="settings-primary-btn" onClick={onClose}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}