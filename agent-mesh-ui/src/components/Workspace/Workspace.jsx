import React, { useState } from 'react';
import FileTree from './FileTree';
import CodeViewer from './CodeViewer';
import DiffViewer from './DiffViewer';
import { FolderGit2, GitCompare, Code2, Sparkles } from 'lucide-react';

export default function Workspace({
  files,
  diffs,
  activeFileId,
  onSelectFile
}) {
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'diffs'
  const [openFileIds, setOpenFileIds] = useState(['file-ai-controller', 'file-agent-manager']);

  const currentFile = files.find(f => f.id === activeFileId) || files[0];

  const handleSelectFile = (fileId) => {
    onSelectFile(fileId);
    if (!openFileIds.includes(fileId)) {
      setOpenFileIds(prev => [...prev, fileId]);
    }
    setActiveTab('code');
  };

  const handleCloseFile = (fileId) => {
    const nextOpen = openFileIds.filter(id => id !== fileId);
    setOpenFileIds(nextOpen);
    if (activeFileId === fileId && nextOpen.length > 0) {
      onSelectFile(nextOpen[0]);
    }
  };

  const openFilesList = files.filter(f => openFileIds.includes(f.id));

  return (
    <div className="workspace-root">
      {/* Workspace Sub-Header Navigation */}
      <div className="workspace-subnav">
        <div className="workspace-tabs-group">
          <button
            className={"workspace-tab-nav " + (activeTab === 'code' ? 'active' : '')}
            onClick={() => setActiveTab('code')}
          >
            <Code2 size={15} />
            <span>Code Viewer</span>
          </button>

          <button
            className={"workspace-tab-nav " + (activeTab === 'diffs' ? 'active' : '')}
            onClick={() => setActiveTab('diffs')}
          >
            <GitCompare size={15} />
            <span>Git Diffs</span>
            <span className="diff-count-chip">{diffs.length}</span>
          </button>
        </div>

        <div className="workspace-info-badge">
          <Sparkles size={13} color="#a855f7" />
          <span>Local Path: C:/Users/KIIT/Downloads/agent-mesh/agent-mesh</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="workspace-layout">
        {/* Left Side: File Explorer */}
        <aside className="workspace-filetree-pane">
          <FileTree
            files={files}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
          />
        </aside>

        {/* Right Side: Code Viewer OR Diff Viewer */}
        <main className="workspace-content-pane">
          {activeTab === 'code' ? (
            <CodeViewer
              activeFile={currentFile}
              openFiles={openFilesList}
              activeFileId={activeFileId}
              onSelectFile={handleSelectFile}
              onCloseFile={handleCloseFile}
            />
          ) : (
            <DiffViewer diffs={diffs} />
          )}
        </main>
      </div>
    </div>
  );
}