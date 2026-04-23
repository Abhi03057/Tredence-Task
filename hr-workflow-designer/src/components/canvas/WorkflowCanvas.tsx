import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  type OnConnectEnd,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nanoid } from 'nanoid';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { nodeTypes } from '../nodes';
import type { WorkflowNode, WorkflowNodeType } from '../../types/workflow.types';

const DEFAULT_NODE_DATA: Record<WorkflowNodeType, object> = {
  start: { title: 'Start', metadata: [] },
  task: { title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
  approval: { title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 },
  automatedStep: { title: 'Automation', actionId: '', actionParams: {} },
  end: { endMessage: 'Workflow End', generateSummary: false },
};

export function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
      if (!type || !rfInstance) return;

      const position = rfInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode: WorkflowNode = {
        id: nanoid(),
        type,
        position,
        data: { ...DEFAULT_NODE_DATA[type] } as WorkflowNode['data'],
      };

      addNode(newNode);
    },
    [addNode, rfInstance]
  );

  const onPaneClick = useCallback(() => selectNode(null), [selectNode]);

  const onConnectEnd: OnConnectEnd = useCallback(() => {}, []);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        onInit={setRfInstance}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: '#13161f' }}
        defaultEdgeOptions={{ animated: true, style: { stroke: '#4f8ef7', strokeWidth: 2 } }}
        connectionLineStyle={{ stroke: '#4f8ef7', strokeWidth: 2 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#2e3347"
        />
        <Controls showInteractive={false} />
        <MiniMap
          style={{ background: '#1a1d27', border: '1px solid #2e3347' }}
          nodeColor={(node) => {
            const colorMap: Record<string, string> = {
              start: '#34d399',
              task: '#4f8ef7',
              approval: '#fbbf24',
              automatedStep: '#a78bfa',
              end: '#f87171',
            };
            return colorMap[node.type ?? 'task'] ?? '#4f8ef7';
          }}
          maskColor="rgba(15,17,23,0.7)"
        />
      </ReactFlow>
    </div>
  );
}
