import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type {
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
} from '@xyflow/react';
import type { WorkflowNode, WorkflowNodeData } from '../types/workflow.types';

interface HistoryEntry {
  nodes: WorkflowNode[];
  edges: Edge[];
}

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  workflowTitle: string;
  history: HistoryEntry[];
  historyIndex: number;

  // Flow callbacks
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node management
  addNode: (node: WorkflowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;

  // Workflow management
  setWorkflowTitle: (title: string) => void;
  clearCanvas: () => void;
  loadWorkflow: (nodes: WorkflowNode[], edges: Edge[]) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

const MAX_HISTORY = 50;

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  workflowTitle: 'Untitled Workflow',
  history: [],
  historyIndex: -1,

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    get().pushHistory();
    set((state) => ({
      edges: addEdge({ ...connection, animated: true }, state.edges),
    }));
  },

  addNode: (node) => {
    get().pushHistory();
    set((state) => ({ nodes: [...state.nodes, node] }));
  },

  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    }));
  },

  deleteNode: (nodeId) => {
    get().pushHistory();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
      selectedNodeId:
        state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  setWorkflowTitle: (title) => {
    set({ workflowTitle: title });
  },

  clearCanvas: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNodeId: null });
  },

  loadWorkflow: (nodes, edges) => {
    get().pushHistory();
    set({ nodes, edges, selectedNodeId: null });
  },

  pushHistory: () => {
    set((state) => {
      const entry: HistoryEntry = {
        nodes: state.nodes,
        edges: state.edges,
      };
      const truncated = state.history.slice(0, state.historyIndex + 1);
      const newHistory = [...truncated, entry].slice(-MAX_HISTORY);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const prev = state.history[state.historyIndex - 1];
      return {
        nodes: prev.nodes,
        edges: prev.edges,
        historyIndex: state.historyIndex - 1,
        selectedNodeId: null,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const next = state.history[state.historyIndex + 1];
      return {
        nodes: next.nodes,
        edges: next.edges,
        historyIndex: state.historyIndex + 1,
        selectedNodeId: null,
      };
    });
  },
}));
