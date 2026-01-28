<script lang="ts">
  import { onMount } from 'svelte';
  import { projects, nodes, deviations, currentProject, currentNode, sidebarOpen, loadFromLocalStorage, exportProject } from './lib/stores/hazopStore';
  import type { Project, Node, Deviation } from './lib/types/hazop';
  
  import Sidebar from './lib/components/hazop/Sidebar.svelte';
  import Dashboard from './lib/components/hazop/Dashboard.svelte';
  import ProjectForm from './lib/components/hazop/ProjectForm.svelte';
  import NodeForm from './lib/components/hazop/NodeForm.svelte';
  import DeviationForm from './lib/components/hazop/DeviationForm.svelte';
  import HAZOPWorksheet from './lib/components/hazop/HAZOPWorksheet.svelte';
  import ProcessFlow from './lib/components/flow/ProcessFlow.svelte';
  import Modal from './lib/components/ui/Modal.svelte';
  import Button from './lib/components/ui/Button.svelte';
  import Tabs from './lib/components/ui/Tabs.svelte';
  import Badge from './lib/components/ui/Badge.svelte';

  let showProjectModal = false;
  let showNodeModal = false;
  let showDeviationModal = false;
  let editingProject: Project | null = null;
  let editingNode: Node | null = null;
  let editingDeviation: Deviation | null = null;
  let activeTab = 'dashboard';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'flow', label: 'Process Flow', icon: '🔄' },
    { id: 'analysis', label: 'HAZOP Analysis', icon: '📋' },
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

  $: projectNodesList = $nodes.filter(n => n.projectId === $currentProject?.id);
</script>

<div class="min-h-screen bg-background">
  <Sidebar on:newProject={handleNewProject} on:projectSelect={() => activeTab = 'dashboard'} />

  <main class="transition-all duration-300 {$sidebarOpen ? 'ml-72' : 'ml-16'}">
    {#if $currentProject}
      <header class="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-semibold text-foreground">{$currentProject.name}</h1>
            <Badge variant={$currentProject.status === 'completed' ? 'success' : $currentProject.status === 'in-progress' ? 'warning' : 'secondary'}>{$currentProject.status}</Badge>
          </div>
          <div class="flex items-center gap-2">
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
                          <button class="p-1 rounded hover:bg-accent" on:click|stopPropagation={() => handleEditNode(node)}>✏️</button>
                          <button class="p-1 rounded hover:bg-destructive/10" on:click|stopPropagation={() => handleDeleteNode(node)}>🗑️</button>
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
      <div class="h-screen flex flex-col items-center justify-center p-8">
        <div class="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8">
          <svg class="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-3">HAZOP Analysis System</h1>
        <p class="text-lg text-muted-foreground max-w-xl mb-8 text-center">Conduct systematic Hazard and Operability Studies for chemical engineering processes.</p>
        <Button variant="primary" size="lg" on:click={handleNewProject}>+ Create New Project</Button>
        <div class="grid grid-cols-3 gap-6 mt-16 max-w-3xl">
          <div class="text-center">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">📊</div>
            <h3 class="font-semibold">Node-Based</h3>
            <p class="text-sm text-muted-foreground">Systematic analysis</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-3">⚠️</div>
            <h3 class="font-semibold">Risk Assessment</h3>
            <p class="text-sm text-muted-foreground">Severity matrices</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-3">✅</div>
            <h3 class="font-semibold">Action Tracking</h3>
            <p class="text-sm text-muted-foreground">Track recommendations</p>
          </div>
        </div>
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
</div>
