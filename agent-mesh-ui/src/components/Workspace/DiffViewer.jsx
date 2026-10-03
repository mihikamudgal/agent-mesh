import React, { useState } from 'react';
import { GitPullRequest, Check, RotateCcw, Plus, Minus } from 'lucide-react';

export default function DiffViewer({ diffs, onApplyDiff }) {
  const [selectedDiffId, setSelectedDiffId] = useState(diffs[0]?.id || '');
  const [appliedDiffs, setAppliedDiffs] = useState({});

  const currentDiff = diffs.find(d => d.id === selectedDiffId) || diffs[0];
  const isApplied = currentDiff ? appliedDiffs[currentDiff.id] : false;

  const handleApply = (diffId) => {
    setAppliedDiffs(prev => ({ ...prev, [diffId]: true }));
    if (onApplyDiff) onApplyDiff(diffId);
  };

  const handleRevert = (diffId) => {
    setAppliedDiffs(prev => ({ ...prev, [diffId]: false }));
  };

  if (!currentDiff) return null;

  return (
    <div className="diffviewer-root">
      {/* Diff Selector Bar */}
      <div className="diff-tabs-bar">
        {diffs.map(d => {
          const isSelected = d.id === selectedDiffId;
          return (
            <button
              key={d.id}
              className={"diff-tab-btn " + (isSelected ? 'active' : '')}
              onClick={() => setSelectedDiffId(d.id)}
            >
              <GitPullRequest size={14} />
              <span>{d.filePath.split('/').pop()}</span>
              <span className="diff-stat-pill">
                <span className="add">+{d.stats.additions}</span>
                <span className="del">-{d.stats.deletions}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Diff Header */}
      <div className="diff-header-bar">
        <div className="diff-meta">
          <h3>{currentDiff.description}</h3>
          <span className="diff-filepath">{currentDiff.filePath}</span>
          <span className="diff-author">Authored by <strong>{currentDiff.author}</strong></span>
        </div>

        <div className="diff-actions">
          {isApplied ? (
            <div className="applied-badge">
              <Check size={14} />
              <span>Applied to Workspace</span>
              <button
                className="diff-revert-btn"
                onClick={() => handleRevert(currentDiff.id)}
                title="Revert diff"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          ) : (
            <button
              className="diff-apply-btn"
              onClick={() => handleApply(currentDiff.id)}
            >
              <Check size={14} />
              <span>Accept & Commit</span>
            </button>
          )}
        </div>
      </div>

      {/* Diff Lines Table */}
      <div className="diff-lines-container">
        <table className="diff-table">
          <tbody>
            {currentDiff.lines.map((line, idx) => {
              const isAdd = line.type === 'add';
              const isDel = line.type === 'del';
              const rowClass = isAdd ? 'diff-row add' : (isDel ? 'diff-row del' : 'diff-row');

              return (
                <tr key={idx} className={rowClass}>
                  <td className="diff-linenum old">{line.lineOld || ''}</td>
                  <td className="diff-linenum new">{line.lineNew || ''}</td>
                  <td className="diff-sign">
                    {isAdd && <Plus size={12} />}
                    {isDel && <Minus size={12} />}
                  </td>
                  <td className="diff-content">
                    <code>{line.text}</code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}