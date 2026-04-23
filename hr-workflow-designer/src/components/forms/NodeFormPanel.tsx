import { X, PlayCircle, ClipboardList, CheckSquare, Zap, StopCircle } from 'lucide-react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedStepNodeForm } from './AutomatedStepNodeForm';
import { EndNodeForm } from './EndNodeForm';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
} from '../../types/workflow.types';

const NODE_META = {
  start: { label: 'Start Node', Icon: PlayCircle, color: 'text-accent-green' },
  task: { label: 'Task Node', Icon: ClipboardList, color: 'text-accent-blue' },
  approval: { label: 'Approval Node', Icon: CheckSquare, color: 'text-accent-amber' },
  automatedStep: { label: 'Automated Step', Icon: Zap, color: 'text-accent-purple' },
  end: { label: 'End Node', Icon: StopCircle, color: 'text-accent-red' },
} as const;

export function NodeFormPanel() {
  const { nodes, selectedNodeId, selectNode } = useWorkflowStore();

  if (!selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node || !node.type) return null;

  const meta = NODE_META[node.type as keyof typeof NODE_META];
  if (!meta) return null;

  const { Icon } = meta;

  return (
    <div className="flex h-full w-80 flex-shrink-0 flex-col border-l border-border-default bg-bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className={meta.color} />
          <span className="text-sm font-semibold text-text-primary">{meta.label}</span>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="rounded-md p-1 text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
        >
          <X size={16} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        {node.type === 'start' && (
          <StartNodeForm nodeId={node.id} data={node.data as StartNodeData} />
        )}
        {node.type === 'task' && (
          <TaskNodeForm nodeId={node.id} data={node.data as TaskNodeData} />
        )}
        {node.type === 'approval' && (
          <ApprovalNodeForm nodeId={node.id} data={node.data as ApprovalNodeData} />
        )}
        {node.type === 'automatedStep' && (
          <AutomatedStepNodeForm nodeId={node.id} data={node.data as AutomatedStepNodeData} />
        )}
        {node.type === 'end' && (
          <EndNodeForm nodeId={node.id} data={node.data as EndNodeData} />
        )}
      </div>

      {/* Node ID (for debugging) */}
      <div className="border-t border-border-default px-4 py-2">
        <p className="font-mono text-xs text-text-secondary">ID: {node.id}</p>
      </div>
    </div>
  );
}
