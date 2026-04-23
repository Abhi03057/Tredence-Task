import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { StopCircle, X } from 'lucide-react';
import type { EndNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export const EndNode = memo(function EndNode({ id, data, selected }: NodeProps) {
  const nodeData = data as EndNodeData;
  const { deleteNode, selectNode } = useWorkflowStore();

  return (
    <div
      onClick={() => selectNode(id)}
      className={`workflow-node relative min-w-[160px] rounded-xl border-2 bg-bg-surface px-4 py-3 cursor-pointer transition-all
        ${selected ? 'border-accent-red shadow-lg shadow-accent-red/20' : 'border-border-default hover:border-accent-red/50'}`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="node-delete-btn absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-white hover:bg-red-400"
      >
        <X size={10} />
      </button>

      <Handle type="target" position={Position.Top} id="target" className="!border-accent-red" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-red/10">
          <StopCircle size={18} className="text-accent-red" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent-red">End</p>
          <p className="truncate max-w-[100px] text-sm font-semibold text-text-primary">
            {nodeData.endMessage || 'End'}
          </p>
        </div>
      </div>

      {nodeData.generateSummary && (
        <p className="mt-1.5 text-xs text-text-secondary">Summary: enabled</p>
      )}
    </div>
  );
});
