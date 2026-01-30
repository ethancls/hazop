"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  GitBranch,
  AlertTriangle,
  FileText,
  Settings,
  Trash2,
  Loader2,
  ChevronRight,
  Workflow,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { NodeTemplate } from "@/lib/hazop/templates";

// Dynamic import for FlowDiagram to avoid SSR issues
const FlowDiagram = dynamic(
  () => import("@/components/hazop/flow-diagram").then((mod) => mod.FlowDiagram),
  {
    ssr: false,
    loading: () => (
      <div className="h-150 border rounded-lg flex items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

interface Deviation {
  id: string;
  parameter: string;
  guideWord: string;
  deviation: string;
  cause: string | null;
  consequence: string | null;
  safeguards: string | null;
  recommendations: string | null;
  status: string;
  severity: number | null;
  likelihood: number | null;
  riskLevel: string | null;
}

interface Node {
  id: string;
  name: string;
  description: string | null;
  designIntent: string | null;
  parameters: string | null;
  position: string | null;
  nodeType: string | null;
  color: string | null;
  deviations: Deviation[];
  _count: { deviations: number };
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  nodes: Node[];
}

interface ProjectViewProps {
  project: Project;
  organizationSlug: string;
  userRole: string;
}

export function ProjectView({ project, organizationSlug, userRole }: ProjectViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("nodes");
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [addingNode, setAddingNode] = useState(false);
  const [newNode, setNewNode] = useState({
    name: "",
    description: "",
    designIntent: "",
  });

  const totalDeviations = project.nodes.reduce((acc, n) => acc + n._count.deviations, 0);
  const totalWithRecommendations = project.nodes.reduce(
    (acc, n) => acc + n.deviations.filter((d) => d.recommendations).length,
    0
  );
  const canEdit = userRole === "OWNER" || userRole === "ADMIN" || userRole === "MEMBER";

  const handleAddNode = async () => {
    setAddingNode(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNode),
      });

      if (res.ok) {
        setIsAddingNode(false);
        setNewNode({ name: "", description: "", designIntent: "" });
        router.refresh();
      }
    } catch {
      console.error("Failed to add node");
    } finally {
      setAddingNode(false);
    }
  };

  const handleAddNodeFromTemplate = async (template: NodeTemplate, position: { x: number; y: number }) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          designIntent: template.defaultDesignIntent,
          nodeType: template.id,
          color: template.color,
          parameters: JSON.stringify(template.defaultParameters),
          position: JSON.stringify(position),
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
      console.error("Failed to add node from template");
    }
  };

  const handleSavePositions = async (positions: Record<string, { x: number; y: number }>) => {
    try {
      await fetch(`/api/projects/${project.id}/nodes/positions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positions }),
      });
    } catch {
      console.error("Failed to save positions");
    }
  };

  const handleSaveConnections = async (connections: Array<{ sourceId: string; targetId: string; label?: string }>) => {
    try {
      await fetch(`/api/projects/${project.id}/connections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connections }),
      });
    } catch {
      console.error("Failed to save connections");
    }
  };

  const handleDeleteNode = async (nodeId: string) => {
    if (!confirm("Are you sure you want to delete this node?")) return;

    try {
      await fetch(`/api/projects/${project.id}/nodes/${nodeId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch {
      console.error("Failed to delete node");
    }
  };

  const getRiskBadgeVariant = (level: string | null) => {
    switch (level) {
      case "CRITICAL":
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      case "LOW":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/org/${organizationSlug}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to projects
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={project.status === "COMPLETED" ? "default" : "secondary"}>
            {project.status.replace("_", " ").toLowerCase()}
          </Badge>
          {canEdit && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/org/${organizationSlug}/projects/${project.id}/settings`}>
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <GitBranch className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{project.nodes.length}</p>
              <p className="text-xs text-muted-foreground">Study Nodes</p>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalDeviations}</p>
              <p className="text-xs text-muted-foreground">Deviations</p>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalWithRecommendations}</p>
              <p className="text-xs text-muted-foreground">With Recommendations</p>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="flow">Process Flow</TabsTrigger>
          <TabsTrigger value="worksheet">Worksheet</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Nodes Tab */}
        <TabsContent value="nodes" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Study Nodes</h2>
            {canEdit && (
              <Dialog open={isAddingNode} onOpenChange={setIsAddingNode}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Node
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Study Node</DialogTitle>
                    <DialogDescription>
                      Define a new node for your HAZOP study. Nodes represent process equipment or sections.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nodeName">Node Name</Label>
                      <Input
                        id="nodeName"
                        placeholder="e.g., Reactor Feed Section"
                        value={newNode.name}
                        onChange={(e) =>
                          setNewNode((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nodeDescription">Description</Label>
                      <Textarea
                        id="nodeDescription"
                        placeholder="Describe this node..."
                        value={newNode.description}
                        onChange={(e) =>
                          setNewNode((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designIntent">Design Intent</Label>
                      <Textarea
                        id="designIntent"
                        placeholder="What is the intended function of this node?"
                        value={newNode.designIntent}
                        onChange={(e) =>
                          setNewNode((prev) => ({
                            ...prev,
                            designIntent: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        The design intent describes the expected operation under normal conditions.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingNode(false)}
                      disabled={addingNode}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddNode} disabled={!newNode.name || addingNode}>
                      {addingNode ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Node"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {project.nodes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <GitBranch className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No nodes yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add study nodes to start your HAZOP analysis. Each node represents a process equipment or section.
                </p>
                {canEdit && (
                  <Button className="mt-4" onClick={() => setIsAddingNode(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Node
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {project.nodes.map((node) => (
                <Card key={node.id}>
                  <Link href={`/org/${organizationSlug}/projects/${project.id}/nodes/${node.id}`}>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{node.name}</CardTitle>
                          <CardDescription>{node.description || "No description"}</CardDescription>
                          {node.designIntent && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Intent: {node.designIntent}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {node._count.deviations} deviation{node._count.deviations !== 1 ? "s" : ""}
                          </Badge>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteNode(node.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardHeader>
                  </Link>
                  {node.deviations.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {node.deviations.slice(0, 3).map((dev) => (
                          <div
                            key={dev.id}
                            className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {dev.guideWord}
                              </Badge>
                              <span className="font-medium text-sm">{dev.parameter}</span>
                              <span className="text-sm text-muted-foreground truncate max-w-48">
                                {dev.cause || dev.deviation}
                              </span>
                            </div>
                            <Badge variant={getRiskBadgeVariant(dev.riskLevel)}>
                              {dev.riskLevel || "Unrated"}
                            </Badge>
                          </div>
                        ))}
                        {node.deviations.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center pt-2">
                            +{node.deviations.length - 3} more deviations
                          </p>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Process Flow Tab */}
        <TabsContent value="flow" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Process Flow Diagram
              </CardTitle>
              <CardDescription>
                Interactive flow diagram - drag nodes to reposition, connect them by dragging from node to node
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FlowDiagram
                nodes={project.nodes}
                canEdit={canEdit}
                onAddNode={handleAddNodeFromTemplate}
                onSavePositions={handleSavePositions}
                onSaveConnections={handleSaveConnections}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Worksheet Tab */}
        <TabsContent value="worksheet" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>HAZOP Worksheet</CardTitle>
              <CardDescription>
                Complete analysis worksheet with all nodes and deviations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.nodes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Add nodes to see the worksheet
                </p>
              ) : totalDeviations === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No deviations recorded yet. Add deviations to your nodes.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Node</th>
                        <th className="text-left p-2">Parameter</th>
                        <th className="text-left p-2">Guide Word</th>
                        <th className="text-left p-2">Cause</th>
                        <th className="text-left p-2">Consequence</th>
                        <th className="text-left p-2">Safeguards</th>
                        <th className="text-left p-2">S</th>
                        <th className="text-left p-2">L</th>
                        <th className="text-left p-2">Risk</th>
                        <th className="text-left p-2">Recommendations</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.nodes.flatMap((node) =>
                        node.deviations.map((dev) => (
                          <tr key={dev.id} className="border-b">
                            <td className="p-2 font-medium">{node.name}</td>
                            <td className="p-2">{dev.parameter}</td>
                            <td className="p-2">
                              <Badge variant="secondary">{dev.guideWord}</Badge>
                            </td>
                            <td className="p-2 max-w-32 truncate">{dev.cause || "-"}</td>
                            <td className="p-2 max-w-32 truncate">{dev.consequence || "-"}</td>
                            <td className="p-2 max-w-32 truncate">{dev.safeguards || "-"}</td>
                            <td className="p-2">{dev.severity || "-"}</td>
                            <td className="p-2">{dev.likelihood || "-"}</td>
                            <td className="p-2">
                              <Badge variant={getRiskBadgeVariant(dev.riskLevel)}>
                                {dev.riskLevel || "-"}
                              </Badge>
                            </td>
                            <td className="p-2 max-w-40 truncate">{dev.recommendations || "-"}</td>
                            <td className="p-2">
                              <Badge variant="outline" className="capitalize">
                                {dev.status.toLowerCase().replace("_", " ")}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>Overview of the HAZOP study progress and risk distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Progress</h4>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${
                        totalDeviations > 0
                          ? (project.nodes
                              .flatMap((n) => n.deviations)
                              .filter((d) => d.status === "CLOSED" || d.status === "RESOLVED").length /
                              totalDeviations) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.nodes
                    .flatMap((n) => n.deviations)
                    .filter((d) => d.status === "CLOSED" || d.status === "RESOLVED").length}{" "}
                  of {totalDeviations} deviations resolved
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Risk Distribution</h4>
                <div className="grid grid-cols-4 gap-2">
                  {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((level) => {
                    const count = project.nodes
                      .flatMap((n) => n.deviations)
                      .filter((d) => d.riskLevel === level).length;
                    const colorClass = level === "CRITICAL" ? "text-red-500" :
                      level === "HIGH" ? "text-orange-500" :
                      level === "MEDIUM" ? "text-yellow-500" : "text-green-500";
                    return (
                      <div
                        key={level}
                        className="p-3 border rounded-lg text-center"
                      >
                        <p className={`text-2xl font-bold ${colorClass}`}>{count}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {level.toLowerCase()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Status Distribution</h4>
                <div className="grid grid-cols-5 gap-2">
                  {["OPEN", "IN_PROGRESS", "RESOLVED", "ACCEPTED", "CLOSED"].map((status) => {
                    const count = project.nodes
                      .flatMap((n) => n.deviations)
                      .filter((d) => d.status === status).length;
                    return (
                      <div
                        key={status}
                        className="p-3 border rounded-lg text-center"
                      >
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {status.toLowerCase().replace("_", " ")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Nodes Summary</h4>
                <div className="space-y-2">
                  {project.nodes.map((node) => (
                    <div
                      key={node.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <span className="font-medium">{node.name}</span>
                        {node.designIntent && (
                          <p className="text-xs text-muted-foreground">{node.designIntent}</p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {node._count.deviations} deviation{node._count.deviations !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
