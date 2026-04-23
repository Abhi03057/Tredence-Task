# HR Workflow Designer

A production-grade HR Workflow Designer built as a full-stack React application for the Tredence Analytics internship case study. HR admins can visually create, configure, and simulate internal workflows (onboarding, leave approval, document verification, etc.).

---

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Architecture Overview

```
src/
  components/
    canvas/
      WorkflowCanvas.tsx       # React Flow canvas with drag-drop, pan/zoom
      NodeSidebar.tsx          # Draggable node palette (left panel)
      CanvasToolbar.tsx        # Top toolbar: run, export, import, clear, layout
    nodes/
      StartNode.tsx            # Emerald — entry point
      TaskNode.tsx             # Blue — manual work item
      ApprovalNode.tsx         # Amber — requires sign-off
      AutomatedStepNode.tsx    # Purple — triggers automation
      EndNode.tsx              # Red — terminates workflow
      index.ts                 # nodeTypes map for React Flow
    forms/
      StartNodeForm.tsx        # Title + dynamic metadata key-value pairs
      TaskNodeForm.tsx         # Title, description, assignee, due date, custom fields
      ApprovalNodeForm.tsx     # Title, approver role select, auto-approve threshold
      AutomatedStepNodeForm.tsx# Title, action select (from API), dynamic param fields
      EndNodeForm.tsx          # End message + summary toggle
      NodeFormPanel.tsx        # Right panel: renders correct form for selected node
    simulation/
      SimulationPanel.tsx      # Bottom drawer: step-by-step execution log
  hooks/
    useWorkflowStore.ts        # Zustand store (nodes, edges, selected node, undo/redo)
    useSimulation.ts           # Orchestrates validation → POST /api/simulate → stagger reveal
    useAutomations.ts          # GET /api/automations with loading/error states
  mocks/
    handlers.ts                # MSW handlers for /api/automations and /api/simulate
    browser.ts                 # MSW browser worker setup
    data/automations.ts        # Static mock automation catalog
  types/
    workflow.types.ts          # All TypeScript interfaces (no `any`)
  utils/
    graphValidation.ts         # Cycle detection (DFS), start/end checks, isolation check
    workflowSerializer.ts      # Serialize to JSON, download, parse imported files
    autoLayout.ts              # Dagre-based auto-layout (TB/LR)
```

---

## Design Decisions

### Zustand over React Context
Zustand gives a flat, subscription-based store with zero boilerplate. Context + useReducer would require wrapping the entire tree and cause unnecessary re-renders whenever any part of the workflow state changed. With Zustand, components subscribe to only the slices they need.

### MSW over json-server
MSW intercepts at the Service Worker level — no separate process to run. It supports realistic request/response logic (validation, delay simulation) and runs identically in tests and the browser. json-server is file-driven and can't simulate error branches.

### React Hook Form + Zod
Forms auto-save on change by subscribing to `watch()` and writing to Zustand — no explicit Save button. Zod provides a single source of truth for schema and TypeScript types via `z.infer<>`. Validation errors appear inline without manual state management.

### Dynamic `actionParams` in AutomatedStepNodeForm
When the user selects an automation action, the form renders input fields dynamically based on the action's `params` array fetched from `/api/automations`. This avoids hardcoding per-action forms — new automation types added to the API appear automatically without any frontend changes. Fields are registered under `actionParams.<paramName>` and reset when the action changes.

### Undo/Redo with History Stack
The Zustand store maintains a `history` array of `{nodes, edges}` snapshots with an index pointer. Any structural mutation calls `pushHistory()` before modifying state. Undo/redo moves the pointer.

---

## What's Implemented

- [x] Full React Flow canvas with dark theme, dot-grid, MiniMap, Controls
- [x] 5 custom node types with color-coded icons and handles
- [x] Drag-and-drop from sidebar onto canvas
- [x] Delete nodes on hover (X button)
- [x] Right-panel forms for all 5 node types (auto-save to Zustand)
- [x] Dynamic action params in AutomatedStep form (driven by API response)
- [x] MSW mock API (`/api/automations`, `/api/simulate`)
- [x] Client-side graph validation (start/end, isolated nodes, DFS cycle detection)
- [x] Simulation panel with staggered step reveal (300ms)
- [x] Export/Import workflow as JSON
- [x] Editable workflow title
- [x] Undo/Redo (history stack in Zustand)
- [x] Auto-layout with Dagre (TB direction)
- [x] Sonner toast notifications
- [x] Zero TypeScript errors (`strict: true`, no `any`)

## What Would Be Added With More Time

- Workflow templates (pre-configured multi-node flows in the sidebar)
- Persistent storage (localStorage or backend API)
- Node validation error indicators (red ring + tooltip on invalid nodes)
- Multi-select and bulk operations
- Edge labels and conditional branching
- Unit tests for graphValidation and workflowSerializer
- E2E tests with Playwright

## Known Limitations

- Simulation is entirely mocked — no real backend execution
- Undo/redo does not persist across page refreshes
- Auto-layout always uses top-to-bottom direction (LR available via `getAutoLayoutedElements(..., 'LR')`)
