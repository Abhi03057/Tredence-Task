import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { AutomatedStepNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { useAutomations } from '../../hooks/useAutomations';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  actionId: z.string().min(1, 'Action is required'),
  actionParams: z.record(z.string()),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: AutomatedStepNodeData;
}

export function AutomatedStepNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();
  const { automations, loading, error } = useAutomations();

  const { register, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      actionId: data.actionId ?? '',
      actionParams: data.actionParams ?? {},
    },
    mode: 'onChange',
  });

  const selectedActionId = watch('actionId');
  const selectedAutomation = automations.find((a) => a.id === selectedActionId);

  // Reset actionParams when action changes
  useEffect(() => {
    if (selectedAutomation) {
      const resetParams: Record<string, string> = {};
      for (const param of selectedAutomation.params) {
        resetParams[param] = data.actionParams?.[param] ?? '';
      }
      setValue('actionParams', resetParams);
    }
  }, [selectedActionId, selectedAutomation, setValue, data.actionParams]);

  useEffect(() => {
    const sub = watch((val) => {
      updateNodeData(nodeId, val as Partial<AutomatedStepNodeData>);
    });
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-input" placeholder="e.g. Send Welcome Email" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="form-label">Action *</label>
        {loading ? (
          <div className="flex items-center gap-2 text-text-secondary">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-sm">Loading automations...</span>
          </div>
        ) : error ? (
          <p className="form-error">Failed to load automations</p>
        ) : (
          <select {...register('actionId')} className="form-input">
            <option value="">Select an action...</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        )}
        {errors.actionId && <p className="form-error">{errors.actionId.message}</p>}
      </div>

      {/* Dynamic param fields based on selected action */}
      {selectedAutomation && selectedAutomation.params.length > 0 && (
        <div>
          <label className="form-label">Action Parameters</label>
          <div className="space-y-2">
            {selectedAutomation.params.map((param) => (
              <div key={param}>
                <label className="mb-1 block text-xs capitalize text-text-secondary">
                  {param.replace(/_/g, ' ')}
                </label>
                <input
                  {...register(`actionParams.${param}`)}
                  className="form-input"
                  placeholder={`Enter ${param}...`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
