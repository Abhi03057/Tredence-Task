import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { CheckSquare, X } from 'lucide-react';
import type { ApprovalNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export const ApprovalNode = memo(function ApprovalNode({ id, data, selected }: NodeProps) {
  const nodeData = data as ApprovalNodeData;
  const { deleteNode, selectNode } = useWorkflowStore();

  return (
    <div
      onClick={() => selectNode(id)}
      className={`workflow-node relative min-w-[180px] rounded-xl border-2 bg-bg-surface px-4 py-3 cursor-pointer transition-all
        ${selected ? 'border-accent-amber shadow-lg shadow-accent-amber/20' : 'border-border-default hover:border-accent-amber/50'}`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
        className="node-delete-btn absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-white hover:bg-red-400"
      >
        <X size={10} />
      </button>

      <Handle type="target" position={Position.Top} id="target" className="!border-accent-amber" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-amber/10">
          <CheckSquare size={18} className="text-accent-amber" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent-amber">Approval</p>
          <p className="truncate max-w-[110px] text-sm font-semibold text-text-primary">
            {nodeData.title || 'Approval Step'}
          </p>
        </div>
      </div>

      {nodeData.approverRole && (
        <p className="mt-1.5 truncate text-xs text-text-secondary">
          Approver: {nodeData.approverRole}
        </p>
      )}
      {nodeData.autoApproveThreshold > 0 && (
        <p className="truncate text-xs text-text-secondary">
          Auto-approve: {nodeData.autoApproveThreshold}%
        </p>
      )}

      <Handle type="source" position={Position.Bottom} id="source" className="!border-accent-amber" />
    </div>
  );
});
