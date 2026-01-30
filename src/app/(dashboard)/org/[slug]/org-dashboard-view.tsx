"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Plus, 
  FolderOpen, 
  GitBranch, 
  AlertTriangle, 
  Clock,
  Users
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  memberCount: number;
  projectCount: number;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdBy: string;
  nodeCount: number;
  deviationCount: number;
  updatedAt: Date;
}

interface Stats {
  totalProjects: number;
  totalNodes: number;
  totalDeviations: number;
  openDeviations: number;
}

interface OrgDashboardViewProps {
  organization: Organization;
  userRole: string;
  projects: Project[];
  stats: Stats;
}

export function OrgDashboardView({ organization, userRole, projects, stats }: OrgDashboardViewProps) {
  const canManage = userRole === "OWNER" || userRole === "ADMIN";
  const canCreateProjects = userRole !== "VIEWER";

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderOpen,
      color: "text-blue-500",
    },
    {
      title: "Study Nodes",
      value: stats.totalNodes,
      icon: GitBranch,
      color: "text-green-500",
    },
    {
      title: "Deviations",
      value: stats.totalDeviations,
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      title: "Open Issues",
      value: stats.openDeviations,
      icon: Clock,
      color: "text-red-500",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{organization.name}</h1>
            <Badge variant="outline" className="capitalize">
              {userRole.toLowerCase()}
            </Badge>
          </div>
          {organization.description && (
            <p className="text-muted-foreground mt-1">{organization.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {organization.memberCount} members
            </span>
            <span className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" />
              {organization.projectCount} projects
            </span>
          </div>
        </div>
        {canCreateProjects && (
          <Button asChild>
            <Link href={`/org/${organization.slug}/projects/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>HAZOP Projects</CardTitle>
          <CardDescription>
            Process safety studies in this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {canCreateProjects 
                  ? "Create your first HAZOP study to get started"
                  : "No HAZOP studies have been created yet"
                }
              </p>
              {canCreateProjects && (
                <Button asChild className="mt-4">
                  <Link href={`/org/${organization.slug}/projects/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/org/${organization.slug}/projects/${project.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.nodeCount} nodes · {project.deviationCount} deviations · by {project.createdBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        project.status === "COMPLETED"
                          ? "default"
                          : project.status === "IN_PROGRESS"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {project.status.replace("_", " ").toLowerCase()}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {canManage && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:border-primary/50 transition-colors">
            <Link href={`/org/${organization.slug}/members`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-blue-500" />
                  Manage Members
                </CardTitle>
                <CardDescription>
                  Invite team members and manage roles
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
          <Card className="hover:border-primary/50 transition-colors">
            <Link href={`/org/${organization.slug}/settings`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FolderOpen className="h-5 w-5 text-orange-500" />
                  Organization Settings
                </CardTitle>
                <CardDescription>
                  Configure organization preferences
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}
