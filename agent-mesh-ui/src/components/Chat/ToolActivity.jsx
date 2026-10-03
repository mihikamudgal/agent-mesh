import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal, FileCode, GitCommit, CheckCircle2, Wrench } from 'lucide-react';

export default function ToolActivity({ activities }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!activities || activities.length === 0) return null;

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getToolIcon = (name) => {
    if (name.includes('File')) return <FileCode size={14} className="tool-icon file" />;
    if (name.includes('run') || name.includes('Command') || name.includes('Test')) return <Terminal size={14} className="tool-icon term" />;
    if (name.includes('git') || name.includes('Diff')) return <GitCommit size={14} className="tool-icon git" />;
    return <Wrench size={14} className="tool-icon def" />;
  };

  return (
    <div className="tool-activity-container">
      <div className="tool-activity-header">
        <span className="tool-activity-label">
          <Wrench size={12} />
          <span>Agent Tool Executions ({activities.length})</span>
        </span>
      </div>

      <div className="tool-activity-list">
        {activities.map((act) => {
          const isExpanded = expandedId === act.id;
          return (
            <div key={act.id} className={"tool-item " + (isExpanded ? 'expanded' : '')}>
              <div className="tool-item-bar" onClick={() => toggleExpand(act.id)}>
                <div className="tool-bar-left">
                  {getToolIcon(act.toolName)}
                  <span className="tool-agent-badge">{act.agent || 'Agent'}</span>
                  <span className="tool-name">{act.toolName}</span>
                </div>

                <div className="tool-bar-right">
                  <span className="tool-duration">{act.duration || 'ok'}</span>
                  <span className="tool-status-badge">
                    <CheckCircle2 size={12} />
                    <span>Done</span>
                  </span>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
              </div>

              {isExpanded && (
                <div className="tool-item-drawer">
                  {act.args && (
                    <div className="tool-drawer-block">
                      <div className="drawer-title">PARAMETERS</div>
                      <pre className="tool-code-preview">{JSON.stringify(act.args, null, 2)}</pre>
                    </div>
                  )}
                  {act.output && (
                    <div className="tool-drawer-block">
                      <div className="drawer-title">OUTPUT / RESULT</div>
                      <pre className="tool-code-preview output">{act.output}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}