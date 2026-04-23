import type { Edge } from '@xyflow/react';
import type { WorkflowNode, SerializedWorkflow } from '../types/workflow.types';

export function serializeWorkflow(
  nodes: WorkflowNode[],
  edges: Edge[],
  title: string
): SerializedWorkflow {
  return {
    version: '1.0',
    title,
    nodes,
    edges,
    exportedAt: new Date().toISOString(),
  };
}

export function downloadWorkflowJson(
  nodes: WorkflowNode[],
  edges: Edge[],
  title: string
): void {
  const data = serializeWorkflow(nodes, edges, title);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseWorkflowJson(json: string): SerializedWorkflow | null {
  try {
    const data = JSON.parse(json) as SerializedWorkflow;
    if (!data.nodes || !data.edges) return null;
    return data;
  } catch {
    return null;
  }
}
