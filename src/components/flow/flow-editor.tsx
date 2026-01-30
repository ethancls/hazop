"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  Panel,
  MiniMap,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Save, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Circle,
  Square,
  Hexagon,
  ArrowRight,
} from "lucide-react";
import { ProcessNode } from "./process-node";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const nodeTypes: NodeTypes = {
  process: ProcessNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "process",
    position: { x: 100, y: 100 },
    data: { 
      label: "Feed Tank",
      type: "vessel",
      parameters: ["Level", "Temperature", "Pressure"],
    },
  },
  {
    id: "2",
    type: "process",
    position: { x: 400, y: 100 },
    data: { 
      label: "Pump P-101",
      type: "pump",
      parameters: ["Flow", "Pressure"],
    },
  },
  {
    id: "3",
    type: "process",
    position: { x: 700, y: 100 },
    data: { 
      label: "Heat Exchanger",
      type: "exchanger",
      parameters: ["Temperature", "Flow", "Pressure"],
    },
  },
];

const initialEdges: Edge[] = [
  { 
    id: "e1-2", 
    source: "1", 
    target: "2", 
    animated: true,
    style: { stroke: "hsl(var(--primary))" },
  },
  { 
    id: "e2-3", 
    source: "2", 
    target: "3", 
    animated: true,
    style: { stroke: "hsl(var(--primary))" },
  },
];

export function FlowEditor() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({
      ...connection,
      animated: true,
      style: { stroke: "hsl(var(--primary))" },
    }, eds)),
    []
  );

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodes(nodes.map((n) => n.id));
  }, []);

  const addNode = (type: string, label: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: "process",
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 200 + 100 
      },
      data: { 
        label,
        type,
        parameters: getDefaultParameters(type),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const getDefaultParameters = (type: string): string[] => {
    switch (type) {
      case "vessel":
        return ["Level", "Temperature", "Pressure"];
      case "pump":
        return ["Flow", "Pressure", "Speed"];
      case "exchanger":
        return ["Temperature In", "Temperature Out", "Flow"];
      case "valve":
        return ["Flow", "Position", "Pressure Drop"];
      case "reactor":
        return ["Temperature", "Pressure", "Level", "Concentration"];
      default:
        return ["Flow", "Pressure"];
    }
  };

  const deleteSelected = () => {
    setNodes((nds) => nds.filter((n) => !selectedNodes.includes(n.id)));
    setEdges((eds) => eds.filter(
      (e) => !selectedNodes.includes(e.source) && !selectedNodes.includes(e.target)
    ));
    setSelectedNodes([]);
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
      >
        <Panel position="top-left" className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Equipment
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Equipment Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => addNode("vessel", "Tank")}>
                <Circle className="h-4 w-4 mr-2" />
                Vessel / Tank
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("pump", "Pump")}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Pump
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("exchanger", "Heat Exchanger")}>
                <Square className="h-4 w-4 mr-2" />
                Heat Exchanger
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("valve", "Valve")}>
                <Hexagon className="h-4 w-4 mr-2" />
                Valve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("reactor", "Reactor")}>
                <Circle className="h-4 w-4 mr-2" />
                Reactor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedNodes.length > 0 && (
            <Button size="sm" variant="destructive" onClick={deleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedNodes.length})
            </Button>
          )}

          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </Panel>

        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          className="bg-card border border-border rounded-lg"
        />
        <MiniMap 
          className="bg-card border border-border rounded-lg"
          maskColor="rgba(0, 0, 0, 0.2)"
          nodeColor="hsl(var(--primary))"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
