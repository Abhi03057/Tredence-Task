import { useRef, useState } from 'react';
import { Play, Download, Upload, Trash2, Undo2, Redo2, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import {
  downloadWorkflowJson,
  parseWorkflowJson,
} from '../../utils/workflowSerializer';
import { getAutoLayoutedElements } from '../../utils/autoLayout';
import type { WorkflowNode } from '../../types/workflow.types';
import type { Edge } from '@xyflow/react';

interface Props {
  onRunSimulation: () => void;
}

export function CanvasToolbar({ onRunSimulation }: Props) {
  const {
    nodes,
    edges,
    workflowTitle,
    setWorkflowTitle,
    clearCanvas,
    loadWorkflow,
    undo,
    redo,
    historyIndex,
    history,
  } = useWorkflowStore();

  const [editingTitle, setEditingTitle] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    downloadWorkflowJson(nodes, edges, workflowTitle);
    toast.success('Workflow exported as JSON');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const parsed = parseWorkflowJson(content);
      if (!parsed) {
        toast.error('Invalid workflow JSON file');
        return;
      }
      loadWorkflow(parsed.nodes as WorkflowNode[], parsed.edges as Edge[]);
      if (parsed.title) setWorkflowTitle(parsed.title);
      toast.success('Workflow imported successfully');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAutoLayout = () => {
    const { nodes: ln, edges: le } = getAutoLayoutedElements(nodes, edges);
    loadWorkflow(ln, le);
    toast.success('Auto-layout applied');
  };

  const handleClear = () => {
    if (showClearConfirm) {
      clearCanvas();
      setShowClearConfirm(false);
      toast.success('Canvas cleared');
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
      {/* Left: Logo + Undo/Redo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded bg-accent-blue" />
          <span className="text-sm font-bold text-text-primary">HR Flow</span>
        </div>

        <div className="h-4 w-px bg-border-default" />

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
            className="rounded-md p-1.5 text-text-secondary hover:bg-bg-elevated hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
            className="rounded-md p-1.5 text-text-secondary hover:bg-bg-elevated hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* Center: Workflow Title */}
      <div className="flex items-center">
        {editingTitle ? (
          <input
            autoFocus
            value={workflowTitle}
            onChange={(e) => setWorkflowTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitle(false); }}
            className="rounded-md border border-accent-blue bg-bg-elevated px-2 py-0.5 text-center text-sm font-semibold text-text-primary outline-none"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="rounded-md px-2 py-0.5 text-sm font-semibold text-text-primary hover:bg-bg-elevated"
            title="Click to rename"
          >
            {workflowTitle}
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import JSON"
          className="toolbar-btn"
        >
          <Upload size={14} />
          <span>Import</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button onClick={handleAutoLayout} title="Auto-layout (Dagre)" className="toolbar-btn">
          <LayoutDashboard size={14} />
          <span>Layout</span>
        </button>

        <button onClick={handleExport} title="Export JSON" className="toolbar-btn">
          <Download size={14} />
          <span>Export</span>
        </button>

        <button
          onClick={handleClear}
          title={showClearConfirm ? 'Click again to confirm' : 'Clear canvas'}
          className={`toolbar-btn ${showClearConfirm ? 'border-accent-red text-accent-red' : ''}`}
        >
          <Trash2 size={14} />
          <span>{showClearConfirm ? 'Confirm?' : 'Clear'}</span>
        </button>

        <button
          onClick={onRunSimulation}
          className="flex items-center gap-1.5 rounded-lg bg-accent-blue px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <Play size={14} />
          Run Workflow
        </button>
      </div>
    </div>
  );
}
