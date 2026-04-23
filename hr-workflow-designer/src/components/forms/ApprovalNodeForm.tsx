import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ApprovalNodeData, ApproverRole } from '../../types/workflow.types';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

const APPROVER_ROLES: ApproverRole[] = ['Manager', 'HRBP', 'Director', 'CEO'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  approverRole: z.enum(['Manager', 'HRBP', 'Director', 'CEO']),
  autoApproveThreshold: z.coerce.number().min(0).max(100),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: ApprovalNodeData;
}

export function ApprovalNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore();

  const { register, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      approverRole: data.approverRole ?? 'Manager',
      autoApproveThreshold: data.autoApproveThreshold ?? 0,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const sub = watch((val) => {
      updateNodeData(nodeId, val as Partial<ApprovalNodeData>);
    });
    return () => sub.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title *</label>
        <input {...register('title')} className="form-input" placeholder="e.g. Manager Approval" />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="form-label">Approver Role</label>
        <select {...register('approverRole')} className="form-input">
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">
          Auto-Approve Threshold (%)
          <span className="ml-1 text-xs text-text-secondary">0 = disabled</span>
        </label>
        <input
          {...register('autoApproveThreshold')}
          type="number"
          min={0}
          max={100}
          className="form-input"
          placeholder="0"
        />
        {errors.autoApproveThreshold && (
          <p className="form-error">{errors.autoApproveThreshold.message}</p>
        )}
      </div>
    </div>
  );
}
