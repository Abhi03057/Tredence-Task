import { ReactFlowProvider } from '@xyflow/react';
import { Toaster } from 'sonner';
import { CanvasToolbar } from './components/canvas/CanvasToolbar';
import { NodeSidebar } from './components/canvas/NodeSidebar';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeFormPanel } from './components/forms/NodeFormPanel';
import { SimulationPanel } from './components/simulation/SimulationPanel';
import { useSimulation } from './hooks/useSimulation';

function AppContent() {
  const simulation = useSimulation();

  return (
    <div className="flex h-screen flex-col bg-bg-primary">
      <CanvasToolbar onRunSimulation={simulation.runSimulation} />

      <div className="flex flex-1 overflow-hidden">
        <NodeSidebar />

        <div className="relative flex-1 overflow-hidden">
          <WorkflowCanvas />
        </div>

        <NodeFormPanel />
      </div>

      <SimulationPanel
        isOpen={simulation.isOpen}
        loading={simulation.loading}
        result={simulation.result}
        validationErrors={simulation.validationErrors}
        visibleStepCount={simulation.visibleStepCount}
        onClose={simulation.closePanel}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1d27',
            border: '1px solid #2e3347',
            color: '#e8eaf0',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
