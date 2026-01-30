"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  LogOut,
  ChevronLeft,
  Plus,
  Building2,
  Users,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Check,
  ChevronsUpDown,
  ChevronRight,
  BookText,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSidebar } from "./sidebar-context";
import { CreateOrgModal } from "@/components/org/create-org-modal";

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    platformRole: string;
  } | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

const CACHE_KEYS = {
  ORGS: "sidebar-orgs-cache",
  CURRENT_ORG: "sidebar-current-org-cache",
};

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    projects: true,
  });

  // Helper to safely access localStorage
  const getCache = <T,>(key: string): T | null => {
    try {
      if (typeof window === "undefined") return null;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  };

  const setCache = (key: string, data: any) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  };

  // Prevent hydration mismatch for theme icons
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // Load organizations on mount
  useEffect(() => {
    // 1. Try to load from cache immediately
    const cachedOrgs = getCache<Organization[]>(CACHE_KEYS.ORGS);
    const cachedCurrentOrg = getCache<Organization>(CACHE_KEYS.CURRENT_ORG);

    if (cachedOrgs && cachedOrgs.length > 0) {
      setOrganizations(cachedOrgs);
      setIsLoadingOrgs(false);
    }

    if (cachedCurrentOrg) {
      setCurrentOrg(cachedCurrentOrg);
    }

    // 2. Fetch fresh data
    fetch("/api/organizations")
      .then((res) => res.json())
      .then((data) => {
        if (data.organizations) {
          setOrganizations(data.organizations);
          setCache(CACHE_KEYS.ORGS, data.organizations);
          
          if (!cachedOrgs || cachedOrgs.length === 0) {
            setIsLoadingOrgs(false);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        // Only stop loading if we haven't already (e.g. if cache was empty and fetch failed)
        if (!cachedOrgs) setIsLoadingOrgs(false);
      });
  }, []);

  // Sync currentOrg with URL
  useEffect(() => {
    if (organizations.length === 0) return;

    const slugMatch = pathname.match(/^\/org\/([^/]+)/);
    const urlSlug = slugMatch ? slugMatch[1] : null;
    
    let org = urlSlug
      ? organizations.find((o: Organization) => o.slug === urlSlug)
      : null;
    
    // Fallback logic if URL has no org but we have a saved one (and we are NOT on a specific org page)
    if (!org && !currentOrg && !urlSlug) {
      const savedOrgId = localStorage.getItem("currentOrgId");
      org = organizations.find((o: Organization) => o.id === savedOrgId) || organizations[0];
    }
    
    if (org && org.id !== currentOrg?.id) {
      setCurrentOrg(org);
      setCache(CACHE_KEYS.CURRENT_ORG, org);
      localStorage.setItem("currentOrgId", org.id);
    }
  }, [pathname, organizations, currentOrg?.id]);

  // Load projects for current organization
  useEffect(() => {
    if (!currentOrg) return;

    setIsLoadingProjects(true);
    fetch(`/api/organizations/${currentOrg.id}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) setProjects(data.projects);
        else setProjects([]);
      })
      .catch(() => setProjects([]))
      .finally(() => setIsLoadingProjects(false));
  }, [currentOrg?.id]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleOrgChange = (org: Organization) => {
    setCurrentOrg(org);
    localStorage.setItem("currentOrgId", org.id);
    router.push(`/org/${org.slug}`);
    router.refresh();
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Check if we're in an organization context or have an org selected
  const hasOrg = !!currentOrg;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-border flex flex-col transition-[width] duration-300 ease-out",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "h-16 flex items-center px-3 border-b border-border",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed ? (
          <>
            <Link href={currentOrg ? `/org/${currentOrg.slug}` : "/"} className="flex items-center gap-3 whitespace-nowrap cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="HAZOP Labs" className="w-8 h-8 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground text-lg tracking-tight">
                  HAZOP
                </span>
                <span className="text-sm font-semibold text-primary">
                  Labs
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-zinc-500 hover:text-foreground"
              onClick={() => setIsCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <button
            className="p-1.5 rounded-md hover:bg-muted/50 text-zinc-500 hover:text-foreground transition-colors cursor-pointer"
            onClick={() => setIsCollapsed(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="HAZOP Labs" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Organization Selector */}
      {!isCollapsed ? (
        <div className="px-3 py-2 border-b border-border">
          {isLoadingOrgs ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-medium truncate text-foreground">
                        {currentOrg?.name || "Select Organization"}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {currentOrg?.role || "No organization"}
                      </p>
                    </div>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-zinc-400 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-zinc-500 text-center">
                    No organizations yet
                  </div>
                ) : (
                  organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleOrgChange(org)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-3 w-3 text-primary" />
                        </div>
                        <span>{org.name}</span>
                      </div>
                      {currentOrg?.id === org.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowCreateOrgModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ) : (
        <div className="px-2 py-2 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Building2 className="h-4 w-4 text-zinc-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-60">
              <DropdownMenuLabel>Organizations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgChange(org)}
                  className="flex items-center justify-between"
                >
                  <span>{org.name}</span>
                  {currentOrg?.id === org.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowCreateOrgModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Create Organization Modal */}
      <CreateOrgModal
        open={showCreateOrgModal}
        onOpenChange={setShowCreateOrgModal}
        onSuccess={(org) => {
          setOrganizations((prev) => [...prev, { ...org, role: "OWNER" }]);
          setCurrentOrg({ ...org, role: "OWNER" });
          router.push(`/org/${org.slug}`);
        }}
      />

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {/* Main Navigation - Only show if we have an organization */}
          {hasOrg && currentOrg && (
            <>
              <Link
                href={`/org/${currentOrg.slug}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  pathname === `/org/${currentOrg.slug}`
                    ? "bg-primary text-primary-foreground"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-muted/50",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? "Dashboard" : undefined}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>

              {/* Projects Section */}
              {!isCollapsed && (
                <div className="pt-4">
                  <button
                    onClick={() => toggleSection("projects")}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-foreground cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="h-3.5 w-3.5" />
                      Projects
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        expandedSections.projects && "rotate-180"
                      )}
                    />
                  </button>
                  {expandedSections.projects && (
                    <div className="mt-1 space-y-1">
                      {isLoadingProjects ? (
                        <div className="px-3 space-y-2">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ) : projects.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-zinc-500">
                          No projects yet
                        </p>
                      ) : (
                        projects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/org/${currentOrg.slug}/projects/${project.id}`}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                              pathname === `/org/${currentOrg.slug}/projects/${project.id}`
                                ? "bg-muted text-foreground"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                project.status === "COMPLETED"
                                  ? "bg-green-500"
                                  : project.status === "IN_PROGRESS"
                                  ? "bg-blue-500"
                                  : "bg-zinc-400"
                              )}
                            />
                            <span className="truncate">{project.name}</span>
                          </Link>
                        ))
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-zinc-500 hover:text-foreground"
                        asChild
                      >
                        <Link href={`/org/${currentOrg.slug}/projects/new`}>
                          <Plus className="h-3.5 w-3.5 mr-2" />
                          New Project
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Collapsed Navigation Icons */}
              {isCollapsed && (
                <div className="space-y-1">
                  {/* Projects dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-full h-9 text-zinc-500 hover:text-foreground"
                        title="Projects"
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-48">
                      <DropdownMenuLabel>Projects</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isLoadingProjects ? (
                        <div className="p-2 space-y-2">
                           <Skeleton className="h-8 w-full" />
                           <Skeleton className="h-8 w-full" />
                        </div>
                      ) : projects.length === 0 ? (
                        <div className="px-2 py-2 text-sm text-zinc-500">
                          No projects yet
                        </div>
                      ) : (
                        projects.map((project) => (
                          <DropdownMenuItem key={project.id} asChild>
                            <Link href={`/org/${currentOrg.slug}/projects/${project.id}`}>
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full mr-2",
                                  project.status === "COMPLETED"
                                    ? "bg-green-500"
                                    : project.status === "IN_PROGRESS"
                                    ? "bg-blue-500"
                                    : "bg-zinc-400"
                                )}
                              />
                              <span className="truncate">{project.name}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* New Project */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-9 text-zinc-500 hover:text-foreground"
                    title="New Project"
                    asChild
                  >
                    <Link href={`/org/${currentOrg.slug}/projects/new`}>
                      <Plus className="h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Members */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full h-9",
                      pathname === `/org/${currentOrg.slug}/members` 
                        ? "bg-muted text-foreground" 
                        : "text-zinc-500 hover:text-foreground"
                    )}
                    title="Members"
                    asChild
                  >
                    <Link href={`/org/${currentOrg.slug}/members`}>
                      <Users className="h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Settings */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full h-9",
                      pathname === `/org/${currentOrg.slug}/settings`
                        ? "bg-muted text-foreground"
                        : "text-zinc-500 hover:text-foreground"
                    )}
                    title="Settings"
                    asChild
                  >
                    <Link href={`/org/${currentOrg.slug}/settings`}>
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}

              {/* Organization Section */}
              {!isCollapsed && (
                <div className="pt-4 border-t border-border mt-4">
                  <p className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" />
                    Organization
                  </p>
                  <div className="space-y-1">
                    <Link
                      href={`/org/${currentOrg.slug}/members`}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                        pathname === `/org/${currentOrg.slug}/members`
                          ? "bg-muted text-foreground"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Users className="h-4 w-4" />
                      Members
                    </Link>
                    <Link
                      href={`/org/${currentOrg.slug}/settings`}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                        pathname === `/org/${currentOrg.slug}/settings`
                          ? "bg-muted text-foreground"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {/* No organization state */}
          {!hasOrg && !isCollapsed && !isLoadingOrgs && (
            <div className="px-3 py-8 text-center">
              <Building2 className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
              <p className="text-sm text-zinc-500">
                Select or create an organization to get started
              </p>
            </div>
          )}
          
          {/* Bottom Links */}
          <div className="pt-4 mt-auto">
             <Link
                href="/docs"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  pathname.startsWith("/docs")
                    ? "bg-primary text-primary-foreground"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-muted/50",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? "Documentation" : undefined}
              >
                <BookText className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Documentation</span>}
              </Link>
          </div>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        {!isCollapsed ? (
          <div className="space-y-2">
            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate text-foreground">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Theme & Version */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>v0.1.0</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-zinc-500 hover:text-foreground">
                    {mounted ? (
                      <>
                        {theme === "light" && <Sun className="h-4 w-4" />}
                        {theme === "dark" && <Moon className="h-4 w-4" />}
                        {theme === "system" && <Monitor className="h-4 w-4" />}
                      </>
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer">
                    <Sun className="h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer">
                    <Moon className="h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 cursor-pointer">
                    <Monitor className="h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-zinc-500">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-zinc-500 hover:text-foreground">
                  {mounted ? (
                    <>
                      {theme === "light" && <Sun className="h-3.5 w-3.5" />}
                      {theme === "dark" && <Moon className="h-3.5 w-3.5" />}
                      {theme === "system" && <Monitor className="h-3.5 w-3.5" />}
                    </>
                  ) : (
                    <Sun className="h-3.5 w-3.5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end">
                <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 cursor-pointer">
                  <Monitor className="h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </aside>
  );
}
