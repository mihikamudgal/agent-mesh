import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, Code } from 'lucide-react';

export default function CodeViewer({ activeFile, openFiles, activeFileId, onSelectFile, onCloseFile }) {
  const [copied, setCopied] = useState(false);

  if (!activeFile) {
    return (
      <div className="code-viewer-empty">
        <Code size={40} className="empty-icon" />
        <h3>No File Selected</h3>
        <p>Select a file from the explorer on the left to inspect source code.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = activeFile.content.split('\n');

  return (
    <div className="codeviewer-root">
      {/* File Tabs Bar */}
      <div className="codeviewer-tabs-bar">
        {openFiles.map(f => {
          const isSelected = f.id === activeFileId;
          return (
            <div
              key={f.id}
              className={"code-tab " + (isSelected ? 'active' : '')}
              onClick={() => onSelectFile(f.id)}
            >
              <span className="tab-name">{f.name}</span>
              {openFiles.length > 1 && (
                <button
                  className="tab-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseFile(f.id);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Breadcrumb Path Bar */}
      <div className="codeviewer-breadcrumb">
        <div className="breadcrumb-path">
          <Terminal size={13} />
          <span>{activeFile.path}</span>
        </div>
        <div className="breadcrumb-actions">
          <span className="file-meta-chip">{lines.length} lines</span>
          <span className="file-meta-chip">{activeFile.size}</span>
          <button className="copy-code-btn" onClick={handleCopy}>
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="codeviewer-body">
        <div className="line-numbers-column" aria-hidden="true">
          {lines.map((_, i) => (
            <div key={i} className="line-num">{i + 1}</div>
          ))}
        </div>
        <pre className="code-text-column">
          <code>{activeFile.content}</code>
        </pre>
      </div>
    </div>
  );
}