import React from 'react';

export default function Layout({
  sidebar,
  chat,
  workspace,
  settingsModal,
  viewMode
}) {
  return (
    <div className="mesh-layout-root">
      {/* Sidebar Component */}
      {sidebar}

      {/* Main Content Area */}
      <div className={"mesh-main-canvas mode-" + viewMode}>
        {viewMode === 'chat' && (
          <div className="canvas-pane-full">
            {chat}
          </div>
        )}

        {viewMode === 'workspace' && (
          <div className="canvas-pane-full">
            {workspace}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="canvas-split-grid">
            <div className="split-pane-chat">
              {chat}
            </div>
            <div className="split-pane-workspace">
              {workspace}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal Component */}
      {settingsModal}
    </div>
  );
}