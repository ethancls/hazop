<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import type { Node } from '../../types/hazop';
  import Badge from '../ui/Badge.svelte';

  export let data: {
    label: string;
    nodeData?: Node;
    deviationCount?: number;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
  export let selected = false;

  const riskColors = {
    low: 'border-success bg-success/5',
    medium: 'border-warning bg-warning/5',
    high: 'border-destructive bg-destructive/5',
    critical: 'border-destructive bg-destructive/10',
  };

  $: borderClass = data.riskLevel ? riskColors[data.riskLevel] : 'border-border bg-card';
</script>

<div 
  class="px-4 py-3 rounded-lg border-2 shadow-md min-w-[180px] transition-all duration-200
         {borderClass}
         {selected ? 'ring-2 ring-primary ring-offset-2' : ''}"
>
  <Handle type="target" position={Position.Left} class="!bg-primary !w-3 !h-3 !border-2 !border-background" />
  
  <div class="flex items-start justify-between gap-2">
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-sm text-foreground truncate">{data.label}</h3>
      {#if data.nodeData?.description}
        <p class="text-xs text-muted-foreground mt-1 line-clamp-2">{data.nodeData.description}</p>
      {/if}
    </div>
    
    {#if data.riskLevel}
      <div class="flex-shrink-0">
        <Badge 
          variant={data.riskLevel === 'critical' || data.riskLevel === 'high' ? 'destructive' : data.riskLevel === 'medium' ? 'warning' : 'success'}
          size="sm"
        >
          {data.riskLevel}
        </Badge>
      </div>
    {/if}
  </div>

  {#if data.deviationCount !== undefined}
    <div class="mt-2 pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{data.deviationCount} deviation{data.deviationCount !== 1 ? 's' : ''}</span>
    </div>
  {/if}

  <Handle type="source" position={Position.Right} class="!bg-primary !w-3 !h-3 !border-2 !border-background" />
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
