"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  deviations: Deviation[];
}

interface Project {
  id: string;
  name: string;
}

interface NodeViewProps {
  node: Node;
  project: Project;
  organizationSlug: string;
  userRole: string;
}

export function NodeView({ node: initialNode, project, organizationSlug, userRole }: NodeViewProps) {
  const router = useRouter();
  const [node, setNode] = useState(initialNode);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingDeviation, setIsAddingDeviation] = useState(false);
  
  // New Deviation State
  const [newDeviation, setNewDeviation] = useState({
    parameter: "",
    guideWord: "",
    deviation: "",
    cause: "",
    consequence: "",
    safeguards: "",
    recommendations: "",
  });

  const canEdit = userRole === "OWNER" || userRole === "ADMIN" || userRole === "MEMBER";

  const handleSaveNode = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/nodes/${node.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: node.name,
          description: node.description,
          designIntent: node.designIntent,
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save node", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDeviation = async () => {
    setIsAddingDeviation(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/nodes/${node.id}/deviations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDeviation),
      });

      if (res.ok) {
        setNewDeviation({
            parameter: "",
            guideWord: "",
            deviation: "",
            cause: "",
            consequence: "",
            safeguards: "",
            recommendations: "",
        });
        // Ideally we'd update local state or revalidate, refreshing for now
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to add deviation", error);
    } finally {
      setIsAddingDeviation(false);
    }
  };
    
  // Simple risk badge helper
  const getRiskBadgeVariant = (level: string | null) => {
    switch (level) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "destructive"; // Or separate class if available
      case "MEDIUM": return "secondary"; // Or warning color
      case "LOW": return "outline"; // Or success color
      default: return "outline";
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-2">
        <Link
          href={`/org/${organizationSlug}/projects/${project.id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground w-fit"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Project: {project.name}
        </Link>
        <div className="flex items-start justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{node.name}</h1>
            <p className="text-muted-foreground">Manage design intent and deviations</p>
          </div>
          {canEdit && (
            <Button onClick={handleSaveNode} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Node Details Column */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Node Definition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Node Name</Label>
                <Input
                  id="name"
                  value={node.name}
                  onChange={(e) => setNode({ ...node, name: e.target.value })}
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={node.description || ""}
                  onChange={(e) => setNode({ ...node, description: e.target.value })}
                  disabled={!canEdit}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designIntent">Design Intent</Label>
                <Textarea
                  id="designIntent"
                  value={node.designIntent || ""}
                  onChange={(e) => setNode({ ...node, designIntent: e.target.value })}
                  disabled={!canEdit}
                  placeholder="Describe the intended function and operating parameters..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deviations Column */}
        <div className="md:col-span-2 space-y-6">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Deviations (HAZOP)</CardTitle>
                <CardDescription>
                  Analyze deviations from the design intent.
                </CardDescription>
              </div>
              {canEdit && (
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Deviation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Deviation</DialogTitle>
                            <DialogDescription>
                                Identify a potential deviation and its causes/consequences.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Parameter</Label>
                                    <Select 
                                        value={newDeviation.parameter}
                                        onValueChange={(val) => setNewDeviation({...newDeviation, parameter: val})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select parameter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Flow">Flow</SelectItem>
                                            <SelectItem value="Pressure">Pressure</SelectItem>
                                            <SelectItem value="Temperature">Temperature</SelectItem>
                                            <SelectItem value="Level">Level</SelectItem>
                                            <SelectItem value="Composition">Composition</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Guide Word</Label>
                                    <Select 
                                        value={newDeviation.guideWord}
                                        onValueChange={(val) => setNewDeviation({...newDeviation, guideWord: val})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select guide word" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NO">NO / NONE</SelectItem>
                                            <SelectItem value="MORE">MORE</SelectItem>
                                            <SelectItem value="LESS">LESS</SelectItem>
                                            <SelectItem value="AS WELL AS">AS WELL AS</SelectItem>
                                            <SelectItem value="PART OF">PART OF</SelectItem>
                                            <SelectItem value="REVERSE">REVERSE</SelectItem>
                                            <SelectItem value="OTHER THAN">OTHER THAN</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Deviation Description</Label>
                                <Input 
                                    placeholder="e.g. No Flow of Cooling Water" 
                                    value={newDeviation.deviation}
                                    onChange={(e) => setNewDeviation({...newDeviation, deviation: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Cause</Label>
                                    <Textarea 
                                        placeholder="What causes this?" 
                                        value={newDeviation.cause}
                                        onChange={(e) => setNewDeviation({...newDeviation, cause: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Consequence</Label>
                                    <Textarea 
                                        placeholder="What happens?" 
                                        value={newDeviation.consequence}
                                        onChange={(e) => setNewDeviation({...newDeviation, consequence: e.target.value})}
                                    />
                                </div>
                            </div>

                             <div className="space-y-2">
                                <Label>Safeguards (Existing)</Label>
                                <Textarea 
                                    placeholder="What prevents/mitigates this?" 
                                    value={newDeviation.safeguards}
                                    onChange={(e) => setNewDeviation({...newDeviation, safeguards: e.target.value})}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Recommendations (Action Items)</Label>
                                <Textarea 
                                    placeholder="What should be done?" 
                                    value={newDeviation.recommendations}
                                    onChange={(e) => setNewDeviation({...newDeviation, recommendations: e.target.value})}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                             <Button onClick={handleAddDeviation} disabled={isAddingDeviation}>
                                {isAddingDeviation ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                                Add Deviation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>
              )}
            </CardHeader>
            <CardContent>
                {node.deviations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <AlertTriangle className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p>No deviations recorded for this node yet.</p>
                        <p className="text-sm">Use the button above to start the analysis.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {node.deviations.map((dev) => (
                            <div key={dev.id} className="border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Badge>{dev.guideWord}</Badge>
                                        <Badge variant="outline">{dev.parameter}</Badge>
                                        <span className="font-medium ml-2">{dev.deviation}</span>
                                    </div>
                                    <Badge variant={getRiskBadgeVariant(dev.riskLevel)}>
                                        {dev.riskLevel || "Unrated"}
                                    </Badge>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-semibold text-muted-foreground block text-xs uppercase mb-1">Causes</span>
                                        <p className="text-foreground/90">{dev.cause || "—"}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-muted-foreground block text-xs uppercase mb-1">Consequences</span>
                                        <p className="text-foreground/90">{dev.consequence || "—"}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-muted-foreground block text-xs uppercase mb-1">Safeguards</span>
                                        <p className="text-foreground/90">{dev.safeguards || "—"}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-muted-foreground block text-xs uppercase mb-1">Recommendations</span>
                                        <p className="text-foreground/90">{dev.recommendations || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
