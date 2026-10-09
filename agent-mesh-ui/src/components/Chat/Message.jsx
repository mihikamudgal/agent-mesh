import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ToolActivity from './ToolActivity';
import { Copy, Check, ExternalLink, Bot, User } from 'lucide-react';

export default function Message({ message, onOpenFileInWorkspace }) {
const isUser = message.sender === 'user';
const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

const copyToClipboard = async (text, idx) => {
try {
await navigator.clipboard.writeText(text);
setCopiedCodeIdx(idx);
setTimeout(() => setCopiedCodeIdx(null), 2000);
} catch (error) {
console.error('Failed to copy code:', error);
}
};

let codeBlockIndex = 0;

return (
<div className={'message-row ' + (isUser ? 'user-row' : 'ai-row')}> <div className="message-avatar-box">
{isUser ? ( <div className="user-avatar-circle"> <User size={16} /> </div>
) : (
<div
className="agent-avatar-circle"
style={{ borderColor: message.agentColor || '#8b5cf6' }}
>
<Bot
size={16}
color={message.agentColor || '#a855f7'}
/> </div>
)} </div>

```
  <div className="message-body">
    <div className="message-meta">
      <span className="sender-name">
        {isUser ? 'You' : message.agentName || 'AgentCoder'}
      </span>

      {!isUser && (
        <span
          className="agent-tag"
          style={{
            borderColor: message.agentColor || '#8b5cf6',
            color: message.agentColor || '#c084fc'
          }}
        >
          {message.agentRole || 'Multi-Agent Mesh'}
        </span>
      )}

      <span className="message-time">
        {message.timestamp || 'Just now'}
      </span>
    </div>

    {!isUser && message.toolActivities?.length > 0 && (
      <ToolActivity activities={message.toolActivities} />
    )}

    <div className="message-text-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <>{children}</>,

          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');
            const isBlock = Boolean(match) || String(children).includes('\n');

            if (!isBlock) {
              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            }

            const idx = codeBlockIndex++;
            const language = match?.[1] || 'text';

            return (
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span className="code-lang-tag">{language}</span>

                  <div className="code-block-actions">
                    {onOpenFileInWorkspace && (
                      <button
                        type="button"
                        className="code-action-btn"
                        onClick={() => onOpenFileInWorkspace(language)}
                        title="Open in Workspace"
                      >
                        <ExternalLink size={13} />
                        <span>Open in Workspace</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="code-action-btn"
                      onClick={() => copyToClipboard(code, idx)}
                      title="Copy code"
                    >
                      {copiedCodeIdx === idx ? (
                        <Check size={13} color="#10b981" />
                      ) : (
                        <Copy size={13} />
                      )}
                      <span>
                        {copiedCodeIdx === idx ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </div>
                </div>

                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  PreTag="pre"
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    background: 'transparent',
                    fontSize: '13px',
                    lineHeight: '1.65',
                    overflowX: 'auto'
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'JetBrains Mono, monospace'
                    }
                  }}
                  wrapLongLines={false}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            );
          }
        }}
      >
        {message.text || ''}

      </ReactMarkdown>
    </div>
  </div>
</div>
  );
}
