import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { ClipboardList, X } from 'lucide-react';
import type { TaskNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export const TaskNode = memo(function TaskNode({ id, data, selected }: NodeProps) {
  const nodeData = data as TaskNodeData;
  const { deleteNode, selectNode } = useWorkflowStore();

  return (
    <div
      onClick={() => selectNode(id)}
      className={`workflow-node relative min-w-[180px] rounded-xl border-2 bg-bg-surface px-4 py-3 cursor-pointer transition-all
        ${selected ? 'border-accent-blue shadow-lg shadow-accent-blue/20' : 'border-border-default hover:border-accent-blue/50'}`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="node-delete-btn absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-white hover:bg-red-400"
      >
        <X size={10} />
      </button>

      <Handle type="target" position={Position.Top} id="target" className="!border-accent-blue" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-blue/10">
          <ClipboardList size={18} className="text-accent-blue" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent-blue">Task</p>
          <p className="truncate max-w-[110px] text-sm font-semibold text-text-primary">
            {nodeData.title || 'New Task'}
          </p>
        </div>
      </div>

      {nodeData.assignee && (
        <p className="mt-1.5 truncate text-xs text-text-secondary">
          Assignee: {nodeData.assignee}
        </p>
      )}
      {nodeData.dueDate && (
        <p className="truncate text-xs text-text-secondary">
          Due: {nodeData.dueDate}
        </p>
      )}

      <Handle type="source" position={Position.Bottom} id="source" className="!border-accent-blue" />
    </div>
  );
});
