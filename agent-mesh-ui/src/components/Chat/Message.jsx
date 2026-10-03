import React, { useState } from 'react';
import ToolActivity from './ToolActivity';
import { Copy, Check, ExternalLink, Bot, User, CornerDownRight } from 'lucide-react';

export default function Message({ message, onOpenFileInWorkspace }) {
  const isUser = message.sender === 'user';
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Helper to render markdown-like code blocks and styled text
  const renderMessageContent = (content) => {
    if (!content) return null;

    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');

        return (
          <div key={index} className="code-block-wrapper">
            <div className="code-block-header">
              <span className="code-lang-tag">{language || 'code'}</span>
              <div className="code-block-actions">
                {onOpenFileInWorkspace && (
                  <button
                    className="code-action-btn"
                    onClick={() => onOpenFileInWorkspace(language)}
                    title="Inspect in Workspace File Viewer"
                  >
                    <ExternalLink size={13} />
                    <span>Open in Workspace</span>
                  </button>
                )}
                <button
                  className="code-action-btn"
                  onClick={() => copyToClipboard(code, index)}
                  title="Copy code"
                >
                  {copiedCodeIdx === index ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copiedCodeIdx === index ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <pre className="code-block-content">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format bold, backtick code, and line breaks
      return (
        <div key={index} className="message-paragraph">
          {part.split('\n').map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {formatInlineText(line)}
              {lIdx < part.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      );
    });
  };

  const formatInlineText = (text) => {
    if (!text) return null;
    // Replace `code` with styled inline code
    const tokens = text.split(/(`[^`]+`)/g);
    return tokens.map((token, tIdx) => {
      if (token.startsWith('`') && token.endsWith('`')) {
        return <code key={tIdx} className="inline-code">{token.slice(1, -1)}</code>;
      }
      // Simple bold formatting
      const boldParts = token.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return <strong key={bIdx}>{bPart.slice(2, -2)}</strong>;
        }
        return bPart;
      });
    });
  };

  return (
    <div className={"message-row " + (isUser ? 'user-row' : 'ai-row')}>
      <div className="message-avatar-box">
        {isUser ? (
          <div className="user-avatar-circle">
            <User size={16} />
          </div>
        ) : (
          <div className="agent-avatar-circle" style={{ borderColor: message.agentColor || '#8b5cf6' }}>
            <Bot size={16} color={message.agentColor || '#a855f7'} />
          </div>
        )}
      </div>

      <div className="message-body">
        <div className="message-meta">
          <span className="sender-name">
            {isUser ? 'You' : (message.agentName || 'AgentCoder')}
          </span>
          {!isUser && (
            <span className="agent-tag" style={{ borderColor: message.agentColor || '#8b5cf6', color: message.agentColor || '#c084fc' }}>
              {message.agentRole || 'Multi-Agent Mesh'}
            </span>
          )}
          <span className="message-time">{message.timestamp || 'Just now'}</span>
        </div>

        {/* Multi-Agent Tool Activity Drawer */}
        {!isUser && message.toolActivities && (
          <ToolActivity activities={message.toolActivities} />
        )}

        {/* Message Content */}
        <div className="message-text-container">
          {renderMessageContent(message.text)}
        </div>
      </div>
    </div>
  );
}