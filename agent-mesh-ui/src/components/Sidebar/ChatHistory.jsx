import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';

export default function ChatHistory({ chats, activeChatId, onSelectChat, onDeleteChat }) {
  return (
    <div className="sidebar-section">
      <div className="section-header">
        <span>RECENT</span>
      </div>
      <div className="chat-history-list">
        {chats.map((chat) => {
          const isActive = chat.id === activeChatId;
          return (
            <div
              key={chat.id}
              className={"chat-history-item " + (isActive ? 'active' : '')}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare size={15} className="history-icon" />
              <span className="history-title" title={chat.title}>{chat.title}</span>
              {onDeleteChat && (
                <button
                  className="history-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  title="Delete chat"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}