import React from 'react';
import { Bot, CheckCircle2 } from 'lucide-react';

export default function AgentList({ agents, activeAgentId, onSelectAgent }) {
  return (
    <div className="sidebar-section">
      <div className="section-header">
        <span>AGENTS</span>
      </div>
      <div className="agent-list">
        {agents.map((agent) => {
          const isSelected = agent.id === activeAgentId;
          const isOnline = agent.status === 'online';

          return (
            <div
              key={agent.id}
              className={"agent-list-item " + (isSelected ? 'selected' : '')}
              onClick={() => onSelectAgent(agent.id)}
              title={agent.name + " - " + agent.role + " (" + agent.status + ")"}
            >
              <span
                className={"agent-status-indicator " + (isOnline ? 'online' : 'standby')}
                style={{ backgroundColor: isOnline ? agent.badgeColor : 'transparent', borderColor: agent.badgeColor }}
              />
              <div className="agent-item-info">
                <span className="agent-item-name">{agent.name}</span>
                <span className="agent-item-role">{agent.role}</span>
              </div>
              {isSelected && <CheckCircle2 size={14} className="agent-active-icon" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}