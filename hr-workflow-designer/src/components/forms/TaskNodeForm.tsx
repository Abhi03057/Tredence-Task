import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import type { TaskNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  assignee: z.string(),
  dueDate: z.string(),
  customFields: z.array(z.object({ key: z.string(), value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: TaskNodeData;
}

export function TaskNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();

  const { register, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      description: data.description ?? '',
      assignee: data.assignee ?? '',
      dueDate: data.dueDate ?? '',
      customFields: data.customFields ?? [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'customFields' });

  useEffect(() => {
    const sub = watch((val) => {
      updateNodeData(nodeId, val as Partial<TaskNodeData>);
    });
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-input" placeholder="e.g. Review Documents" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          {...register('description')}
          className="form-input min-h-[72px] resize-none"
          placeholder="Describe this task..."
        />
      </div>

      <div>
        <label className="form-label">Assignee</label>
        <input {...register('assignee')} className="form-input" placeholder="e.g. hr@company.com" />
      </div>

      <div>
        <label className="form-label">Due Date</label>
        <input {...register('dueDate')} type="date" className="form-input" />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="form-label mb-0">Custom Fields</label>
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
                {...register(`customFields.${index}.key`)}
                className="form-input flex-1"
                placeholder="Field name"
              />
              <input
                {...register(`customFields.${index}.value`)}
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
    </div>
  );
}
