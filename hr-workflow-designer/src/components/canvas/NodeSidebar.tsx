import { PlayCircle, ClipboardList, CheckSquare, Zap, StopCircle } from 'lucide-react';
import type { WorkflowNodeType } from '../../types/workflow.types';

interface NodeTemplate {
  type: WorkflowNodeType;
  label: string;
  description: string;
  Icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Entry point of the workflow',
    Icon: PlayCircle,
    color: 'text-accent-green',
    bgColor: 'bg-accent-green/10',
    borderColor: 'border-accent-green/30',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Manual work item with assignee',
    Icon: ClipboardList,
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
    borderColor: 'border-accent-blue/30',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Requires sign-off from a role',
    Icon: CheckSquare,
    color: 'text-accent-amber',
    bgColor: 'bg-accent-amber/10',
    borderColor: 'border-accent-amber/30',
  },
  {
    type: 'automatedStep',
    label: 'Automated',
    description: 'Trigger an automated action',
    Icon: Zap,
    color: 'text-accent-purple',
    bgColor: 'bg-accent-purple/10',
    borderColor: 'border-accent-purple/30',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Terminates the workflow',
    Icon: StopCircle,
    color: 'text-accent-red',
    bgColor: 'bg-accent-red/10',
    borderColor: 'border-accent-red/30',
  },
];

export function NodeSidebar() {
  const onDragStart = (e: React.DragEvent, nodeType: WorkflowNodeType) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex h-full w-56 flex-shrink-0 flex-col border-r border-border-default bg-bg-surface">
      <div className="border-b border-border-default px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Node Types
        </h2>
        <p className="mt-0.5 text-xs text-text-secondary">Drag onto canvas</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {NODE_TEMPLATES.map((template) => {
          const { Icon } = template;
          return (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template.type)}
              className={`flex cursor-grab items-center gap-3 rounded-xl border px-3 py-2.5 transition-all hover:bg-bg-elevated active:cursor-grabbing ${template.borderColor}`}
            >
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${template.bgColor}`}>
                <Icon size={16} className={template.color} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${template.color}`}>{template.label}</p>
                <p className="truncate text-xs text-text-secondary">{template.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border-default p-3">
        <p className="text-center text-xs text-text-secondary">
          Connect nodes by dragging from handle to handle
        </p>
      </div>
    </div>
  );
}
