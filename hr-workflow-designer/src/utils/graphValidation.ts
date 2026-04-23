import type { Edge } from '@xyflow/react';
import type { WorkflowNode, ValidationResult } from '../types/workflow.types';

function hasCycle(nodes: WorkflowNode[], edges: Edge[]): boolean {
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) adjacency.set(node.id, []);
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
  }

  const visited = new Set<string>();
  const inStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    inStack.add(nodeId);
    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (inStack.has(neighbor)) {
        return true;
      }
    }
    inStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }
  return false;
}

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: Edge[]
): ValidationResult {
  const errors: string[] = [];

  if (nodes.length === 0) {
    errors.push('Workflow is empty. Add at least a Start and End node.');
    return { valid: false, errors };
  }

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push('Workflow must have exactly one Start node.');
  } else if (startNodes.length > 1) {
    errors.push('Workflow must have exactly one Start node (found multiple).');
  }

  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one End node.');
  }

  // Check for isolated nodes (not connected to any edge)
  const connectedNodeIds = new Set<string>();
  for (const edge of edges) {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  }

  const isolatedNodes = nodes.filter((n) => !connectedNodeIds.has(n.id));
  if (isolatedNodes.length > 0) {
    const names = isolatedNodes
      .map((n) => {
        const data = n.data as { title?: string };
        return data.title ?? n.type ?? n.id;
      })
      .join(', ');
    errors.push(`Isolated nodes (not connected): ${names}`);
  }

  if (hasCycle(nodes, edges)) {
    errors.push('Workflow contains a cycle. Cycles are not allowed.');
  }

  return { valid: errors.length === 0, errors };
}
