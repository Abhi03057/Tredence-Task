import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import type { StartNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  metadata: z.array(z.object({ key: z.string(), value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: StartNodeData;
}

export function StartNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();

  const { register, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: data.title, metadata: data.metadata ?? [] },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'metadata' });
  const values = watch();

  useEffect(() => {
    const sub = watch((val) => {
      updateNodeData(nodeId, val as Partial<StartNodeData>);
    });
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-input" placeholder="e.g. Start Onboarding" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="form-label mb-0">Metadata</label>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="flex items-center gap-1 rounded-md bg-bg-elevated px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`metadata.${index}.key`)}
                className="form-input flex-1"
                placeholder="Key"
              />
              <input
                {...register(`metadata.${index}.value`)}
                className="form-input flex-1"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex-shrink-0 rounded-md p-1.5 text-text-secondary hover:text-accent-red"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden">{JSON.stringify(values)}</div>
    </div>
  );
}
