import { X, CheckCircle2, XCircle, Loader2, PlayCircle, ClipboardList, CheckSquare, Zap, StopCircle, AlertTriangle } from 'lucide-react';
import type { SimulationStep } from '../../types/workflow.types';

interface Props {
  isOpen: boolean;
  loading: boolean;
  result: import('../../types/workflow.types').SimulationResult | null;
  validationErrors: string[];
  visibleStepCount: number;
  onClose: () => void;
}

const NODE_ICONS = {
  start: PlayCircle,
  task: ClipboardList,
  approval: CheckSquare,
  automatedStep: Zap,
  end: StopCircle,
};

const NODE_COLORS = {
  start: 'text-accent-green',
  task: 'text-accent-blue',
  approval: 'text-accent-amber',
  automatedStep: 'text-accent-purple',
  end: 'text-accent-red',
};

function SimStep({ step, index }: { step: SimulationStep; index: number }) {
  const Icon = NODE_ICONS[step.nodeType] ?? ClipboardList;
  const color = NODE_COLORS[step.nodeType] ?? 'text-accent-blue';

  return (
    <div
      className="sim-step-enter flex items-start gap-3 rounded-lg bg-bg-elevated px-3 py-2.5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-bg-surface ${color}`}>
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-text-primary">{step.title}</p>
          <StatusBadge status={step.status} />
        </div>
        <p className="mt-0.5 text-xs text-text-secondary">{step.message}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SimulationStep['status'] }) {
  if (status === 'completed') {
    return (
      <span className="flex items-center gap-1 rounded-full bg-accent-green/10 px-2 py-0.5 text-xs font-medium text-accent-green">
        <CheckCircle2 size={10} /> done
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 rounded-full bg-accent-red/10 px-2 py-0.5 text-xs font-medium text-accent-red">
        <XCircle size={10} /> error
      </span>
    );
  }
  return (
    <span className="rounded-full bg-bg-surface px-2 py-0.5 text-xs text-text-secondary">
      skipped
    </span>
  );
}

export function SimulationPanel({ isOpen, loading, result, validationErrors, visibleStepCount, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-t-2xl border border-border-default bg-bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <div className="flex items-center gap-2">
            <PlayCircle size={18} className="text-accent-blue" />
            <h2 className="text-base font-semibold text-text-primary">Workflow Simulation</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-10">
              <Loader2 size={28} className="animate-spin text-accent-blue" />
              <p className="text-sm text-text-secondary">Running simulation...</p>
            </div>
          )}

          {!loading && validationErrors.length > 0 && (
            <div className="rounded-lg border border-accent-red/30 bg-accent-red/5 p-4">
              <div className="flex items-center gap-2 text-accent-red">
                <AlertTriangle size={16} />
                <p className="text-sm font-semibold">Validation Failed</p>
              </div>
              <ul className="mt-2 space-y-1">
                {validationErrors.map((err, i) => (
                  <li key={i} className="text-sm text-accent-red/80">• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Overall status */}
              <div
                className={`flex items-center gap-2 rounded-lg p-3 ${
                  result.success
                    ? 'border border-accent-green/30 bg-accent-green/5'
                    : 'border border-accent-red/30 bg-accent-red/5'
                }`}
              >
                {result.success ? (
                  <CheckCircle2 size={18} className="text-accent-green" />
                ) : (
                  <XCircle size={18} className="text-accent-red" />
                )}
                <p className={`text-sm font-semibold ${result.success ? 'text-accent-green' : 'text-accent-red'}`}>
                  {result.success ? 'Simulation completed successfully' : 'Simulation failed'}
                </p>
                <span className="ml-auto text-xs text-text-secondary">
                  {result.steps.length} steps
                </span>
              </div>

              {result.errors.length > 0 && (
                <div className="rounded-lg border border-accent-red/30 bg-accent-red/5 p-3">
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-sm text-accent-red">• {err}</p>
                  ))}
                </div>
              )}

              {/* Step log */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Execution Log
                </p>
                {result.steps.slice(0, visibleStepCount).map((step, i) => (
                  <SimStep key={step.nodeId} step={step} index={i} />
                ))}
                {visibleStepCount < result.steps.length && (
                  <div className="flex justify-center py-2">
                    <Loader2 size={16} className="animate-spin text-text-secondary" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
