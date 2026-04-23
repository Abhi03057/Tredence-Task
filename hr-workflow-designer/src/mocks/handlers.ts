import { http, HttpResponse, delay } from 'msw';
import { mockAutomations } from './data/automations';
import type {
  SimulationResult,
  SerializedWorkflow,
  WorkflowNode,
  SimulationStep,
} from '../types/workflow.types';

export const handlers = [
  http.get('/api/automations', async () => {
    await delay(200);
    return HttpResponse.json(mockAutomations);
  }),

  http.post('/api/simulate', async ({ request }) => {
    await delay(600);

    const body = (await request.json()) as SerializedWorkflow;
    const nodes: WorkflowNode[] = body.nodes ?? [];
    const edges = body.edges ?? [];

    const errors: string[] = [];

    const startNodes = nodes.filter((n) => n.type === 'start');
    const endNodes = nodes.filter((n) => n.type === 'end');

    if (startNodes.length !== 1) {
      errors.push('Workflow must have exactly one Start node.');
    }
    if (endNodes.length === 0) {
      errors.push('Workflow must have at least one End node.');
    }

    const connectedIds = new Set<string>();
    for (const e of edges) {
      connectedIds.add(e.source);
      connectedIds.add(e.target);
    }
    const isolated = nodes.filter((n) => !connectedIds.has(n.id));
    if (isolated.length > 0) {
      errors.push(`Isolated nodes detected: ${isolated.map((n) => n.id).join(', ')}`);
    }

    if (errors.length > 0) {
      const result: SimulationResult = { success: false, steps: [], errors };
      return HttpResponse.json(result);
    }

    // Topological ordering (BFS from start node)
    const adjacency = new Map<string, string[]>();
    for (const node of nodes) adjacency.set(node.id, []);
    for (const edge of edges) {
      adjacency.get(edge.source)?.push(edge.target);
    }

    const ordered: WorkflowNode[] = [];
    const visited = new Set<string>();
    const queue: string[] = startNodes.map((n) => n.id);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      const node = nodes.find((n) => n.id === current);
      if (node) ordered.push(node);
      for (const next of adjacency.get(current) ?? []) {
        if (!visited.has(next)) queue.push(next);
      }
    }

    const steps: SimulationStep[] = ordered.map((node) => {
      const data = node.data as { title?: string; endMessage?: string };
      const title = data.title ?? data.endMessage ?? node.type ?? 'Unknown';
      const messages: Record<string, string> = {
        start: 'Workflow initiated successfully.',
        task: `Task "${title}" assigned and queued.`,
        approval: `Approval request sent for "${title}".`,
        automatedStep: `Automation "${title}" executed.`,
        end: data.endMessage ?? 'Workflow completed.',
      };

      return {
        nodeId: node.id,
        nodeType: node.type ?? 'task',
        title,
        status: 'completed',
        message: messages[node.type ?? 'task'] ?? 'Step executed.',
        timestamp: new Date().toISOString(),
      };
    });

    const result: SimulationResult = { success: true, steps, errors: [] };
    return HttpResponse.json(result);
  }),
];
