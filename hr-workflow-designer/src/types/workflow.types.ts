import type { Node, Edge } from '@xyflow/react';

// ─── Node Type Literals ───────────────────────────────────────────────────────

export type WorkflowNodeType =
  | 'start'
  | 'task'
  | 'approval'
  | 'automatedStep'
  | 'end';

// ─── Form Data Interfaces ─────────────────────────────────────────────────────

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface StartNodeData {
  title: string;
  metadata: KeyValuePair[];
}

export interface TaskNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

export type ApproverRole = 'Manager' | 'HRBP' | 'Director' | 'CEO';

export interface ApprovalNodeData {
  title: string;
  approverRole: ApproverRole;
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData {
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  endMessage: string;
  generateSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

// ─── React Flow Node Types ────────────────────────────────────────────────────

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;

export type StartFlowNode = Node<StartNodeData, 'start'>;
export type TaskFlowNode = Node<TaskNodeData, 'task'>;
export type ApprovalFlowNode = Node<ApprovalNodeData, 'approval'>;
export type AutomatedStepFlowNode = Node<AutomatedStepNodeData, 'automatedStep'>;
export type EndFlowNode = Node<EndNodeData, 'end'>;

// ─── Automation API ───────────────────────────────────────────────────────────

export interface Automation {
  id: string;
  label: string;
  params: string[];
}

// ─── Simulation API ───────────────────────────────────────────────────────────

export type SimStepStatus = 'completed' | 'error' | 'skipped';

export interface SimulationStep {
  nodeId: string;
  nodeType: WorkflowNodeType;
  title: string;
  status: SimStepStatus;
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

export interface SimulateRequest {
  nodes: WorkflowNode[];
  edges: Edge[];
}

// ─── Serialized Workflow ──────────────────────────────────────────────────────

export interface SerializedWorkflow {
  version: '1.0';
  title: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  exportedAt: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
