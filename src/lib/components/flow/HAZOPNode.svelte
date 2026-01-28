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

  const riskStyles = {
    low: 'border-success/50 bg-card shadow-success/10',
    medium: 'border-warning/50 bg-card shadow-warning/10',
    high: 'border-orange-500/50 bg-card shadow-orange-500/10',
    critical: 'border-destructive/50 bg-card shadow-destructive/10',
  };

  const riskDotColors = {
    low: 'bg-success',
    medium: 'bg-warning',
    high: 'bg-orange-500',
    critical: 'bg-destructive',
  };

  $: borderClass = data.riskLevel ? riskStyles[data.riskLevel] : 'border-border bg-card';
  $: dotColor = data.riskLevel ? riskDotColors[data.riskLevel] : 'bg-primary';
</script>

<div 
  class="px-4 py-3 rounded-xl border-2 shadow-lg min-w-[200px] max-w-[280px] transition-all duration-200
         {borderClass}
         {selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : 'hover:shadow-xl'}"
>
  <Handle type="target" position={Position.Left} class="!bg-primary !w-3 !h-3 !border-2 !border-background" />
  
  <div class="flex items-start gap-3">
    <div class="flex-shrink-0 mt-0.5">
      <div class="w-2.5 h-2.5 rounded-full {dotColor} animate-pulse"></div>
    </div>
    
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-sm text-foreground leading-tight">{data.label}</h3>
      {#if data.nodeData?.description}
        <p class="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{data.nodeData.description}</p>
      {/if}
    </div>
  </div>

  <div class="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
    <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{data.deviationCount ?? 0} deviation{(data.deviationCount ?? 0) !== 1 ? 's' : ''}</span>
    </div>
    
    {#if data.riskLevel}
      <Badge 
        variant={data.riskLevel === 'critical' || data.riskLevel === 'high' ? 'destructive' : data.riskLevel === 'medium' ? 'warning' : 'success'}
        size="sm"
      >
        {data.riskLevel}
      </Badge>
    {/if}
  </div>

  <Handle type="source" position={Position.Right} class="!bg-primary !w-3 !h-3 !border-2 !border-background" />
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
