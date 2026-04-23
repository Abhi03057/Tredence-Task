import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { EndNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

const schema = z.object({
  endMessage: z.string(),
  generateSummary: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: EndNodeData;
}

export function EndNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();

  const { register, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      endMessage: data.endMessage ?? '',
      generateSummary: data.generateSummary ?? false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const sub = watch((val) => {
      updateNodeData(nodeId, val as Partial<EndNodeData>);
    });
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">End Message</label>
        <input
          {...register('endMessage')}
          className="form-input"
          placeholder="e.g. Onboarding completed successfully"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg bg-bg-elevated px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-text-primary">Generate Summary</p>
          <p className="text-xs text-text-secondary">Create a workflow execution report</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" {...register('generateSummary')} className="peer sr-only" />
          <div className="peer h-5 w-9 rounded-full bg-border-default after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent-blue peer-checked:after:translate-x-full" />
        </label>
      </div>
    </div>
  );
}
