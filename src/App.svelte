<script lang="ts">
  import { onMount } from 'svelte';
  import { projects, nodes, deviations, currentProject, currentNode, sidebarOpen, loadFromLocalStorage, exportProject, createDemoProject } from './lib/stores/hazopStore';
  import type { Project, Node, Deviation } from './lib/types/hazop';
  
  import Sidebar from './lib/components/hazop/Sidebar.svelte';
  import Dashboard from './lib/components/hazop/Dashboard.svelte';
  import ProjectForm from './lib/components/hazop/ProjectForm.svelte';
  import NodeForm from './lib/components/hazop/NodeForm.svelte';
  import DeviationForm from './lib/components/hazop/DeviationForm.svelte';
  import HAZOPWorksheet from './lib/components/hazop/HAZOPWorksheet.svelte';
  import ProcessFlow from './lib/components/flow/ProcessFlow.svelte';
  import AIAssistant from './lib/components/hazop/AIAssistant.svelte';
  import Modal from './lib/components/ui/Modal.svelte';
  import Button from './lib/components/ui/Button.svelte';
  import Tabs from './lib/components/ui/Tabs.svelte';
  import Badge from './lib/components/ui/Badge.svelte';

  let showProjectModal = false;
  let showNodeModal = false;
  let showDeviationModal = false;
  let showAIAssistant = false;
  let editingProject: Project | null = null;
  let editingNode: Node | null = null;
  let editingDeviation: Deviation | null = null;
  let activeTab = 'dashboard';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'flow', label: 'Process Flow', icon: 'flow' },
    { id: 'analysis', label: 'HAZOP Analysis', icon: 'analysis' },
  ];

  onMount(() => { loadFromLocalStorage(); });

  function handleNewProject() { editingProject = null; showProjectModal = true; }

  function handleProjectSubmit(event: CustomEvent) {
    const data = event.detail;
    if (editingProject) projects.update(editingProject.id, data);
    else { const p = projects.add(data); $currentProject = p; }
    showProjectModal = false; editingProject = null;
  }

  function handleEditProject() { if ($currentProject) { editingProject = $currentProject; showProjectModal = true; } }
  function handleNewNode() { editingNode = null; showNodeModal = true; }

  function handleNodeSubmit(event: CustomEvent) {
    const data = event.detail;
    if (editingNode) nodes.update(editingNode.id, data);
    else { const n = nodes.add(data); $currentNode = n; }
    showNodeModal = false; editingNode = null;
  }

  function handleNodeSelect(event: CustomEvent<Node>) { $currentNode = event.detail; activeTab = 'analysis'; }
  function handleEditNode(node: Node) { editingNode = node; showNodeModal = true; }

  function handleDeleteNode(node: Node) {
    if (confirm(`Delete "${node.name}" and all deviations?`)) {
      $deviations.filter(d => d.nodeId === node.id).forEach(d => deviations.delete(d.id));
      nodes.delete(node.id);
      if ($currentNode?.id === node.id) $currentNode = null;
    }
  }

  function handleNewDeviation() { editingDeviation = null; showDeviationModal = true; }

  function handleDeviationSubmit(event: CustomEvent) {
    const data = event.detail;
    if (editingDeviation) deviations.update(editingDeviation.id, data);
    else deviations.add(data);
    showDeviationModal = false; editingDeviation = null;
  }

  function handleEditDeviation(event: CustomEvent<Deviation>) { editingDeviation = event.detail; showDeviationModal = true; }
  function handleDeleteDeviation(event: CustomEvent<Deviation>) { if (confirm('Delete this deviation?')) deviations.delete(event.detail.id); }

  function handleExport() {
    if ($currentProject) {
      const data = exportProject($currentProject);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = `hazop-${$currentProject.name.replace(/\s+/g, '-')}.json`;
      a.click(); URL.revokeObjectURL(url);
    }
  }

  function handleLoadDemo() {
    const demo = createDemoProject();
    $currentProject = demo;
    activeTab = 'dashboard';
  }

  function handleOpenAIAssistant() {
    showAIAssistant = true;
  }

  function handleAIComplete() {
    showAIAssistant = false;
    activeTab = 'flow';
  }

  $: projectNodesList = $nodes.filter(n => n.projectId === $currentProject?.id);
</script>

<div class="min-h-screen bg-background">
  <Sidebar on:newProject={handleNewProject} on:projectSelect={() => activeTab = 'dashboard'} />

  <main class="transition-all duration-300 {$sidebarOpen ? 'ml-64' : 'ml-[60px]'}">
    {#if $currentProject}
      <header class="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-semibold text-foreground">{$currentProject.name}</h1>
            <Badge variant={$currentProject.status === 'completed' ? 'success' : $currentProject.status === 'in-progress' ? 'warning' : 'secondary'}>{$currentProject.status}</Badge>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" on:click={handleOpenAIAssistant}>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Assist
            </Button>
            <Button variant="outline" size="sm" on:click={handleEditProject}>Edit</Button>
            <Button variant="outline" size="sm" on:click={handleExport}>Export</Button>
          </div>
        </div>
        <div class="px-6"><Tabs {tabs} {activeTab} on:change={(e) => activeTab = e.detail.tab} /></div>
      </header>

      <div class="p-6">
        {#if activeTab === 'dashboard'}
          <Dashboard />
        {:else if activeTab === 'flow'}
          <div class="h-[calc(100vh-220px)] rounded-lg border border-border overflow-hidden">
            <ProcessFlow on:nodeSelect={handleNodeSelect} on:addNode={handleNewNode} />
          </div>
        {:else if activeTab === 'analysis'}
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div class="lg:col-span-1">
              <div class="sticky top-[180px]">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-semibold">Nodes</h2>
                  <Button variant="outline" size="sm" on:click={handleNewNode}>+ Add</Button>
                </div>
                <div class="space-y-2">
                  {#each projectNodesList as node}
                    {@const devCount = $deviations.filter(d => d.nodeId === node.id).length}
                    <div class="w-full text-left p-3 rounded-lg border transition-colors cursor-pointer {$currentNode?.id === node.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}" on:click={() => $currentNode = node} on:keydown={(e) => e.key === 'Enter' && ($currentNode = node)} role="button" tabindex="0">
                      <div class="flex items-start justify-between">
                        <div>
                          <p class="font-medium">{node.name}</p>
                          <p class="text-xs text-muted-foreground mt-1">{devCount} deviation{devCount !== 1 ? 's' : ''}</p>
                        </div>
                        <div class="flex gap-1">
                          <button class="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" on:click|stopPropagation={() => handleEditNode(node)} title="Edit node">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button class="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" on:click|stopPropagation={() => handleDeleteNode(node)} title="Delete node">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  {/each}
                  {#if projectNodesList.length === 0}
                    <p class="text-center py-8 text-sm text-muted-foreground">No nodes yet</p>
                  {/if}
                </div>
              </div>
            </div>
            <div class="lg:col-span-3">
              {#if $currentNode}
                <HAZOPWorksheet node={$currentNode} on:addDeviation={handleNewDeviation} on:editDeviation={handleEditDeviation} on:deleteDeviation={handleDeleteDeviation} />
              {:else}
                <div class="h-96 flex items-center justify-center border border-dashed rounded-lg">
                  <p class="text-muted-foreground">Select a node to view analysis</p>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <div class="h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-background/95">
        <!-- Hero Section -->
        <div class="relative mb-12">
          <div class="absolute inset-0 blur-3xl opacity-20 bg-primary rounded-full scale-150"></div>
          <img src="/logo.svg" alt="HAZOP Pro" class="w-24 h-24 relative z-10" />
        </div>
        
        <div class="flex items-baseline gap-2 mb-4">
          <h1 class="text-4xl font-bold tracking-tight">HAZOP</h1>
          <span class="text-xl font-bold text-primary">PRO</span>
        </div>
        
        <p class="text-lg text-muted-foreground max-w-lg mb-10 text-center leading-relaxed">
          Systematic Hazard and Operability Analysis for industrial process safety. Professional-grade HAZOP studies.
        </p>
        
        <div class="flex gap-3">
          <Button variant="primary" size="lg" on:click={handleNewProject}>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Study
          </Button>
          <Button variant="outline" size="lg" on:click={handleLoadDemo}>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Load Demo
          </Button>
        </div>
        
        <!-- Features Grid -->
        <div class="grid grid-cols-3 gap-8 mt-20 max-w-2xl">
          <div class="text-center group">
            <div class="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center mx-auto mb-3 group-hover:border-primary/50 transition-colors">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 class="font-semibold text-sm">Node Analysis</h3>
            <p class="text-xs text-muted-foreground mt-1">Systematic deviation study</p>
          </div>
          <div class="text-center group">
            <div class="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center mx-auto mb-3 group-hover:border-primary/50 transition-colors">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="font-semibold text-sm">Risk Matrix</h3>
            <p class="text-xs text-muted-foreground mt-1">Severity & likelihood</p>
          </div>
          <div class="text-center group">
            <div class="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center mx-auto mb-3 group-hover:border-primary/50 transition-colors">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 class="font-semibold text-sm">Action Tracking</h3>
            <p class="text-xs text-muted-foreground mt-1">Follow-up & completion</p>
          </div>
        </div>
        
        <!-- Footer -->
        <p class="absolute bottom-6 text-xs text-muted-foreground">
          Built for chemical process engineers
        </p>
      </div>
    {/if}
  </main>

  <Modal bind:open={showProjectModal} title={editingProject ? 'Edit Project' : 'New Project'} size="lg">
    <ProjectForm project={editingProject || {}} mode={editingProject ? 'edit' : 'create'} on:submit={handleProjectSubmit} on:cancel={() => showProjectModal = false} />
  </Modal>

  <Modal bind:open={showNodeModal} title={editingNode ? 'Edit Node' : 'Add Node'} size="lg">
    {#if $currentProject}
      <NodeForm node={editingNode || {}} projectId={$currentProject.id} mode={editingNode ? 'edit' : 'create'} on:submit={handleNodeSubmit} on:cancel={() => showNodeModal = false} />
    {/if}
  </Modal>

  <Modal bind:open={showDeviationModal} title={editingDeviation ? 'Edit Deviation' : 'Add Deviation'} size="xl">
    {#if $currentNode}
      <DeviationForm deviation={editingDeviation || {}} nodeId={$currentNode.id} mode={editingDeviation ? 'edit' : 'create'} on:submit={handleDeviationSubmit} on:cancel={() => showDeviationModal = false} />
    {/if}
  </Modal>

  <Modal bind:open={showAIAssistant} title="AI Assistant" size="lg">
    {#if $currentProject}
      <AIAssistant projectId={$currentProject.id} on:complete={handleAIComplete} on:cancel={() => showAIAssistant = false} />
    {/if}
  </Modal>
</div>
