import dagre from '@dagrejs/dagre';
import type { Edge } from '@xyflow/react';
import type { WorkflowNode } from '../types/workflow.types';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function getAutoLayoutedElements(
  nodes: WorkflowNode[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB'
): { nodes: WorkflowNode[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, ranksep: 80, nodesep: 40 });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
