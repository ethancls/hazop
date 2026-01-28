<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { SvelteFlow, Controls, Background, MiniMap, BackgroundVariant } from '@xyflow/svelte';
  import type { Node as FlowNode, Edge, OnConnect } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  
  import type { Node } from '../../types/hazop';
  import { flowNodes, deviations, nodes, currentProject, darkMode } from '../../stores/hazopStore';
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

  // Better fit view options - less zoomed
  const fitViewOptions = {
    padding: 0.3,
    maxZoom: 1,
    minZoom: 0.3,
  };

  function handleNodeClick({ event, node }: { event: MouseEvent | TouchEvent; node: FlowNode }) {
    if (node?.id) {
      selectedNodeId = node.id;
      const hazopNode = $nodes.find(n => n.id === node.id);
      if (hazopNode) {
        dispatch('nodeSelect', hazopNode);
      }
    }
  }

  function handleNodeDragStop({ targetNode }: { targetNode: FlowNode | null; nodes: FlowNode[]; event: MouseEvent | TouchEvent }) {
    if (targetNode) {
      nodes.update(targetNode.id, { position: targetNode.position });
    }
  }

  const handleConnect: OnConnect = (connection) => {
    if (connection.source && connection.target) {
      edges = [...edges, {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        animated: true,
        style: 'stroke: hsl(var(--primary)); stroke-width: 2px;',
      }];
    }
  };

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
      fitViewOptions={fitViewOptions}
      onnodeclick={handleNodeClick}
      onnodedragstop={handleNodeDragStop}
      onconnect={handleConnect}
      onpaneclick={handlePaneClick}
      defaultEdgeOptions={{
        type: 'smoothstep',
        animated: true,
      }}
      minZoom={0.2}
      maxZoom={2}
    >
      <Background 
        gap={20} 
        bgColor={$darkMode ? 'transparent' : 'transparent'}
        variant={BackgroundVariant.Dots}
        patternColor={$darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
      />
      <Controls 
        showLock={false}
        class="!bg-card !border-border !rounded-lg !shadow-lg"
      />
      <MiniMap 
        class="!bg-card !border-border !rounded-lg !shadow-lg"
        maskColor={$darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'}
        nodeColor={(node) => {
          const data = node.data as { riskLevel?: string };
          switch (data?.riskLevel) {
            case 'critical': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#eab308';
            case 'low': return '#22c55e';
            default: return '#ff3e00';
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
    background: hsl(var(--background)) !important;
  }
  
  :global(.dark .svelte-flow) {
    background: hsl(0 0% 6%) !important;
  }
  
  :global(.svelte-flow__pane) {
    cursor: grab;
  }
  
  :global(.svelte-flow__pane:active) {
    cursor: grabbing;
  }
  
  :global(.svelte-flow__controls) {
    background: hsl(var(--card)) !important;
    border: 1px solid hsl(var(--border)) !important;
    border-radius: 0.5rem !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
    overflow: hidden;
  }
  
  :global(.svelte-flow__controls-button) {
    background: hsl(var(--card)) !important;
    border-color: hsl(var(--border)) !important;
    color: hsl(var(--foreground)) !important;
    width: 28px !important;
    height: 28px !important;
  }
  
  :global(.svelte-flow__controls-button:hover) {
    background: hsl(var(--accent)) !important;
  }
  
  :global(.svelte-flow__controls-button svg) {
    fill: currentColor !important;
    max-width: 14px !important;
    max-height: 14px !important;
  }
  
  :global(.svelte-flow__minimap) {
    background: hsl(var(--card)) !important;
    border: 1px solid hsl(var(--border)) !important;
    border-radius: 0.5rem !important;
    overflow: hidden;
  }
  
  :global(.svelte-flow__edge-path) {
    stroke: hsl(var(--primary)) !important;
    stroke-width: 2px;
  }
  
  :global(.svelte-flow__edge.animated path) {
    stroke-dasharray: 5;
    animation: dashdraw 0.5s linear infinite;
  }
  
  @keyframes dashdraw {
    from { stroke-dashoffset: 10; }
    to { stroke-dashoffset: 0; }
  }
  
  :global(.svelte-flow__handle) {
    width: 10px !important;
    height: 10px !important;
    border-radius: 50% !important;
    background: hsl(var(--primary)) !important;
    border: 2px solid hsl(var(--background)) !important;
  }
  
  :global(.svelte-flow__handle:hover) {
    transform: scale(1.2);
  }
  
  :global(.svelte-flow__attribution) {
    display: none !important;
  }
</style>
