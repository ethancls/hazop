"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  Connection,
  Edge,
  NodeTypes,
  MarkerType,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Save, Loader2 } from "lucide-react";
import { NODE_TEMPLATES, NODE_CATEGORIES, NodeTemplate } from "@/lib/hazop/templates";

// Custom Node Component
function HAZOPNode({ data, selected }: { data: HAZOPNodeData; selected: boolean }) {
  return (
    <div
      className={`
        px-4 py-3 bg-card border-2 rounded-lg shadow-sm min-w-40 transition-all
        ${selected ? "ring-2 ring-primary ring-offset-2" : ""}
      `}
      style={{ borderColor: data.color || "#3b82f6" }}
    >
      <div className="flex items-center gap-2 mb-1">
        {data.nodeType && (
          <Badge
            variant="outline"
            className="text-xs"
            style={{ borderColor: data.color, color: data.color }}
          >
            {data.nodeType}
          </Badge>
        )}
      </div>
      <p className="font-medium text-sm">{data.label}</p>
      {data.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {data.description}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="secondary" className="text-xs">
          {data.deviationCount} deviations
        </Badge>
      </div>
    </div>
  );
}

interface HAZOPNodeData {
  label: string;
  description?: string;
  nodeType?: string;
  color?: string;
  deviationCount: number;
  [key: string]: unknown;
}

const nodeTypes: NodeTypes = {
  hazop: HAZOPNode,
};

interface FlowDiagramNode {
  id: string;
  name: string;
  description: string | null;
  nodeType: string | null;
  color: string | null;
  position: string | null;
  _count: { deviations: number };
}

interface FlowDiagramProps {
  nodes: FlowDiagramNode[];
  canEdit: boolean;
  onAddNode: (template: NodeTemplate, position: { x: number; y: number }) => void;
  onSavePositions: (positions: Record<string, { x: number; y: number }>) => Promise<void>;
  onSaveConnections: (connections: Array<{ sourceId: string; targetId: string; label?: string }>) => Promise<void>;
}

export function FlowDiagram({
  nodes,
  canEdit,
  onAddNode,
  onSavePositions,
  onSaveConnections,
}: FlowDiagramProps) {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Convert HAZOP nodes to React Flow nodes
  const initialNodes = useMemo(() => {
    return nodes.map((node, index) => {
      const position = node.position ? JSON.parse(node.position) : { x: 100 + index * 200, y: 100 };
      return {
        id: node.id,
        type: "hazop",
        position,
        data: {
          label: node.name,
          description: node.description,
          nodeType: node.nodeType,
          color: node.color || "#3b82f6",
          deviationCount: node._count.deviations,
        },
      };
    });
  }, [nodes]);

  const [flowNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Update nodes when prop changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
      setHasChanges(true);
    },
    [setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);
      // Check if any position changed
      if (changes.some((c) => c.type === "position" && c.dragging === false)) {
        setHasChanges(true);
      }
    },
    [onNodesChange]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save positions
      const positions: Record<string, { x: number; y: number }> = {};
      flowNodes.forEach((node) => {
        positions[node.id] = node.position;
      });
      await onSavePositions(positions);

      // Save connections
      const connections = edges.map((edge) => ({
        sourceId: edge.source,
        targetId: edge.target,
        label: typeof edge.label === "string" ? edge.label : undefined,
      }));
      await onSaveConnections(connections);

      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFromTemplate = (template: NodeTemplate) => {
    // Add at center of viewport
    const position = { x: 200, y: 200 };
    onAddNode(template, position);
  };

  return (
    <div className="h-150 border rounded-lg overflow-hidden bg-background">
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={canEdit ? onConnect : undefined}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        nodesDraggable={canEdit}
        nodesConnectable={canEdit}
        elementsSelectable={canEdit}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => (node.data as HAZOPNodeData).color || "#3b82f6"}
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        {canEdit && (
          <Panel position="top-left" className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Node
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                {NODE_CATEGORIES.map((category) => (
                  <DropdownMenuGroup key={category.id}>
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </DropdownMenuLabel>
                    {NODE_TEMPLATES.filter((t) => t.category === category.id).map(
                      (template) => (
                        <DropdownMenuItem
                          key={template.id}
                          onClick={() => handleAddFromTemplate(template)}
                        >
                          <div className="flex-1">
                            <p className="font-medium">{template.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {template.description}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      )
                    )}
                    <DropdownMenuSeparator />
                  </DropdownMenuGroup>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {hasChanges && (
              <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Layout
                  </>
                )}
              </Button>
            )}
          </Panel>
        )}

        {flowNodes.length === 0 && (
          <Panel position="top-center" className="mt-32">
            <div className="text-center p-8 bg-card rounded-lg border shadow-sm">
              <p className="text-lg font-medium mb-2">No nodes yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first process node to start building the flow diagram
              </p>
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Node
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                    {NODE_CATEGORIES.map((category) => (
                      <DropdownMenuGroup key={category.id}>
                        <DropdownMenuLabel className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </DropdownMenuLabel>
                        {NODE_TEMPLATES.filter((t) => t.category === category.id).map(
                          (template) => (
                            <DropdownMenuItem
                              key={template.id}
                              onClick={() => handleAddFromTemplate(template)}
                            >
                              <div className="flex-1">
                                <p className="font-medium">{template.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {template.description}
                                </p>
                              </div>
                            </DropdownMenuItem>
                          )
                        )}
                        <DropdownMenuSeparator />
                      </DropdownMenuGroup>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
