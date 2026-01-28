<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { SvelteFlow, Controls, Background, MiniMap } from '@xyflow/svelte';
  import type { Node as FlowNode, Edge } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  
  import type { Node } from '../../types/hazop';
  import { flowNodes, deviations, nodes, currentProject } from '../../stores/hazopStore';
  import HAZOPNode from './HAZOPNode.svelte';
  import Button from '../ui/Button.svelte';

  const dispatch = createEventDispatcher();

  const nodeTypes = {
    hazopNode: HAZOPNode,
  };

  let edges: Edge[] = [];
  let selectedNodeId: string | null = null;

  // Convert our nodes to SvelteFlow format
  $: flowNodesData = $flowNodes.map(node => ({
    ...node,
    draggable: true,
    selectable: true,
  })) as FlowNode[];

  function handleNodeClick(event: CustomEvent) {
    const nodeId = event.detail.node?.id;
    if (nodeId) {
      selectedNodeId = nodeId;
      const hazopNode = $nodes.find(n => n.id === nodeId);
      if (hazopNode) {
        dispatch('nodeSelect', hazopNode);
      }
    }
  }

  function handleNodeDragStop(event: CustomEvent) {
    const { node } = event.detail;
    if (node) {
      nodes.update(node.id, { position: node.position });
    }
  }

  function handleConnect(event: CustomEvent) {
    const { source, target } = event.detail;
    if (source && target) {
      edges = [...edges, {
        id: `e${source}-${target}`,
        source,
        target,
        animated: true,
        style: 'stroke: hsl(var(--primary)); stroke-width: 2px;',
      }];
    }
  }

  function handlePaneClick() {
    selectedNodeId = null;
  }
</script>

<div class="h-full w-full relative">
  {#if flowNodesData.length > 0}
    <SvelteFlow
      nodes={flowNodesData}
      {edges}
      {nodeTypes}
      fitView
      on:nodeclick={handleNodeClick}
      on:nodedragstop={handleNodeDragStop}
      on:connect={handleConnect}
      on:paneclick={handlePaneClick}
      defaultEdgeOptions={{
        type: 'smoothstep',
        animated: true,
      }}
    >
      <Background gap={20} color="hsl(var(--border))" />
      <Controls 
        showLock={false}
        class="bg-card border border-border rounded-lg shadow-lg"
      />
      <MiniMap 
        class="bg-card border border-border rounded-lg shadow-lg"
        nodeColor={(node) => {
          const data = node.data as { riskLevel?: string };
          switch (data?.riskLevel) {
            case 'critical': return 'hsl(var(--destructive))';
            case 'high': return 'hsl(var(--destructive))';
            case 'medium': return 'hsl(var(--warning))';
            case 'low': return 'hsl(var(--success))';
            default: return 'hsl(var(--primary))';
          }
        }}
      />
    </SvelteFlow>
  {:else}
    <div class="h-full flex flex-col items-center justify-center text-center p-8">
      <div class="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-foreground mb-2">No Process Nodes</h3>
      <p class="text-sm text-muted-foreground max-w-md mb-6">
        Start by adding nodes to represent equipment, vessels, or process sections that you want to analyze in your HAZOP study.
      </p>
      <Button variant="primary" on:click={() => dispatch('addNode')}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add First Node
      </Button>
    </div>
  {/if}

  <!-- Floating toolbar -->
  {#if flowNodesData.length > 0}
    <div class="absolute top-4 right-4 flex gap-2">
      <Button variant="outline" size="sm" on:click={() => dispatch('addNode')}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Node
      </Button>
    </div>
  {/if}
</div>

<style>
  :global(.svelte-flow) {
    background: hsl(var(--muted) / 0.3);
  }
  
  :global(.svelte-flow__controls) {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  
  :global(.svelte-flow__controls-button) {
    background: hsl(var(--card));
    border-color: hsl(var(--border));
    color: hsl(var(--foreground));
  }
  
  :global(.svelte-flow__controls-button:hover) {
    background: hsl(var(--accent));
  }
  
  :global(.svelte-flow__minimap) {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 0.5rem;
  }
</style>
