import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { PlayCircle, X } from 'lucide-react';
import type { StartNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export const StartNode = memo(function StartNode({ id, data, selected }: NodeProps) {
  const nodeData = data as StartNodeData;
  const { deleteNode, selectNode } = useWorkflowStore();
  const { getNode } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  const handleClick = () => {
    selectNode(id);
  };

  const node = getNode(id);
  void node;

  return (
    <div
      onClick={handleClick}
      className={`workflow-node relative min-w-[160px] rounded-xl border-2 bg-bg-surface px-4 py-3 cursor-pointer transition-all
        ${selected ? 'border-accent-green shadow-lg shadow-accent-green/20' : 'border-border-default hover:border-accent-green/50'}`}
    >
      <button
        onClick={handleDelete}
        className="node-delete-btn absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-white hover:bg-red-400"
      >
        <X size={10} />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/10">
          <PlayCircle size={18} className="text-accent-green" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent-green">Start</p>
          <p className="truncate max-w-[100px] text-sm font-semibold text-text-primary">
            {nodeData.title || 'Start'}
          </p>
        </div>
      </div>

      {nodeData.metadata && nodeData.metadata.length > 0 && (
        <div className="mt-2 space-y-0.5">
          {nodeData.metadata.slice(0, 2).map((kv, i) => (
            <p key={i} className="truncate text-xs text-text-secondary">
              {kv.key}: {kv.value}
            </p>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        className="!border-accent-green"
      />
    </div>
  );
});
