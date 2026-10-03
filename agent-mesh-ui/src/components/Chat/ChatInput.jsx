import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Settings2, SlidersHorizontal, ArrowUp, Mic, Bot } from 'lucide-react';

export default function ChatInput({
  onSendMessage,
  loading,
  agents,
  selectedAgentId,
  onSelectAgent,
  onAttachClick,
  onOpenSettings
}) {
  const [inputVal, setInputVal] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [inputVal]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputVal.trim() || loading) return;
    onSendMessage(inputVal.trim());
    setInputVal('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <div className="floating-input-container">
      <div className="floating-input-card">
        <textarea
          ref={textareaRef}
          className="prompt-textarea"
          rows={1}
          placeholder="Ask Agent Mesh anything, assign tasks, or request code..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <div className="input-toolbar">
          <div className="input-toolbar-left">
            <button
              type="button"
              className="toolbar-pill-btn"
              onClick={onAttachClick}
              title="Attach context or workspace files"
            >
              <Paperclip size={14} />
              <span>Attach</span>
            </button>

            <div className="agent-selector-pill" title="Target Agent">
              <Bot size={14} style={{ color: currentAgent?.badgeColor || '#a855f7' }} />
              <select
                value={selectedAgentId}
                onChange={(e) => onSelectAgent(e.target.value)}
                className="agent-select-native"
              >
                <option value="auto">Auto-Mesh Router</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>@{a.name} ({a.role})</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="toolbar-pill-btn"
              onClick={onOpenSettings}
              title="Agent & Mesh Configuration"
            >
              <SlidersHorizontal size={14} />
              <span>Options</span>
            </button>
          </div>

          <div className="input-toolbar-right">
            <button
              type="button"
              className="voice-input-btn"
              title="Voice input"
              onClick={() => alert("Voice input active on microphone.")}
            >
              <Mic size={15} />
            </button>

            <button
              type="button"
              className={"send-orb-btn " + (inputVal.trim() && !loading ? 'ready' : '')}
              onClick={handleSubmit}
              disabled={loading || !inputVal.trim()}
              title="Send to Agent Mesh (Enter)"
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}