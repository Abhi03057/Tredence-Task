import { useState, useEffect } from 'react';
import type { Automation } from '../types/workflow.types';

interface UseAutomationsResult {
  automations: Automation[];
  loading: boolean;
  error: string | null;
}

export function useAutomations(): UseAutomationsResult {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAutomations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/automations');
        if (!res.ok) throw new Error('Failed to fetch automations');
        const data = (await res.json()) as Automation[];
        if (!cancelled) setAutomations(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchAutomations();
    return () => { cancelled = true; };
  }, []);

  return { automations, loading, error };
}
