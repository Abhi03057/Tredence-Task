import { useState } from 'react';
import type { SimulationResult, SimulateRequest } from '../types/workflow.types';
import { validateWorkflow } from '../utils/graphValidation';
import { serializeWorkflow } from '../utils/workflowSerializer';
import { useWorkflowStore } from './useWorkflowStore';

interface UseSimulationResult {
  isOpen: boolean;
  loading: boolean;
  result: SimulationResult | null;
  validationErrors: string[];
  runSimulation: () => Promise<void>;
  closePanel: () => void;
  visibleStepCount: number;
}

export function useSimulation(): UseSimulationResult {
  const { nodes, edges } = useWorkflowStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [visibleStepCount, setVisibleStepCount] = useState(0);

  const runSimulation = async () => {
    setIsOpen(true);
    setResult(null);
    setValidationErrors([]);
    setVisibleStepCount(0);

    // Client-side validation
    const validation = validateWorkflow(nodes, edges);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const payload: SimulateRequest = { nodes, edges };
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serializeWorkflow(nodes, edges, 'run')),
      });

      const data = (await res.json()) as SimulationResult;
      setResult(data);

      // Stagger step reveal
      if (data.steps.length > 0) {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          setVisibleStepCount(count);
          if (count >= data.steps.length) clearInterval(interval);
        }, 300);
      }
    } catch {
      setValidationErrors(['Network error: could not reach simulation API.']);
    } finally {
      setLoading(false);
    }
  };

  const closePanel = () => {
    setIsOpen(false);
    setResult(null);
    setValidationErrors([]);
    setVisibleStepCount(0);
  };

  return {
    isOpen,
    loading,
    result,
    validationErrors,
    runSimulation,
    closePanel,
    visibleStepCount,
  };
}
