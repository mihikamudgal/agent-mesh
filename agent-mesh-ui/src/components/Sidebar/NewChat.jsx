import React from 'react';
import { Plus } from 'lucide-react';

export default function NewChat({ onNewChat }) {
  return (
    <button className="new-chat-btn" onClick={onNewChat} title="Start a fresh conversation">
      <div className="new-chat-icon-wrapper">
        <Plus size={16} strokeWidth={2.5} />
      </div>
      <span>New Chat</span>
      <span className="kbd-shortcut">Ctrl+N</span>
    </button>
  );
}