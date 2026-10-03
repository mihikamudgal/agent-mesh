import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileText, Settings, Search, ChevronRight, ChevronDown } from 'lucide-react';

export default function FileTree({ files, activeFileId, onSelectFile }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFolders, setOpenFolders] = useState({
    'src': true,
    'src/main': true,
    'src/main/java': true,
    'Controller': true,
    'Service': true,
    'Tools': true
  });

  const toggleFolder = (folderKey) => {
    setOpenFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.java')) return <FileCode size={14} className="tree-file-icon java" />;
    if (fileName.endsWith('.properties')) return <Settings size={14} className="tree-file-icon props" />;
    if (fileName.endsWith('.xml')) return <FileCode size={14} className="tree-file-icon xml" />;
    return <FileText size={14} className="tree-file-icon default" />;
  };

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="filetree-container">
      <div className="filetree-header">
        <span className="filetree-title">PROJECT EXPLORER</span>
        <span className="filetree-count">{files.length} files</span>
      </div>

      <div className="filetree-search-box">
        <Search size={13} className="search-icon" />
        <input
          type="text"
          placeholder="Filter workspace files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filetree-search-input"
        />
      </div>

      <div className="filetree-items-list">
        {filteredFiles.map((file) => {
          const isActive = file.id === activeFileId;
          const isController = file.path.includes('Controller');
          const isService = file.path.includes('Service');
          const isTool = file.path.includes('Tools');

          let folderTag = 'root';
          if (isController) folderTag = 'Controller';
          else if (isService) folderTag = 'Service';
          else if (isTool) folderTag = 'Tools';
          else if (file.path.includes('resources')) folderTag = 'resources';

          return (
            <div
              key={file.id}
              className={"tree-file-item " + (isActive ? 'active' : '')}
              onClick={() => onSelectFile(file.id)}
              title={file.path}
            >
              {getFileIcon(file.name)}
              <span className="tree-file-name">{file.name}</span>
              <span className="tree-folder-badge">{folderTag}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}