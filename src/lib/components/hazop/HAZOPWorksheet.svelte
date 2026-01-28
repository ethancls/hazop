<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Node, Deviation } from '../../types/hazop';
  import { PROCESS_PARAMETERS, GUIDE_WORDS } from '../../types/hazop';
  import { deviations, nodeDeviations, currentNode } from '../../stores/hazopStore';
  import Badge from '../ui/Badge.svelte';
  import Button from '../ui/Button.svelte';

  export let node: Node;

  const dispatch = createEventDispatcher();

  $: nodeDevs = $deviations.filter(d => d.nodeId === node.id);

  function getParameterName(id: string): string {
    return PROCESS_PARAMETERS.find(p => p.id === id)?.name || id;
  }

  function getGuideWordName(id: string): string {
    return GUIDE_WORDS.find(g => g.id === id)?.name || id;
  }

  function getRiskBadgeVariant(level: string): 'destructive' | 'warning' | 'success' | 'secondary' {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }
</script>

<div class="space-y-4">
  <!-- Node Header -->
  <div class="flex items-start justify-between">
    <div>
      <h2 class="text-xl font-semibold text-foreground">{node.name}</h2>
      <p class="text-sm text-muted-foreground mt-1">{node.description}</p>
    </div>
    <Button variant="primary" size="sm" on:click={() => dispatch('addDeviation')}>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Deviation
    </Button>
  </div>

  <!-- Design Intent -->
  <div class="p-4 rounded-lg bg-primary/5 border border-primary/20">
    <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Design Intent</p>
    <p class="text-sm text-foreground">{node.designIntent}</p>
  </div>

  <!-- Equipment List -->
  {#if node.equipment && node.equipment.length > 0}
    <div class="flex flex-wrap gap-2">
      <span class="text-xs font-semibold text-muted-foreground uppercase">Equipment:</span>
      {#each node.equipment as equip}
        <Badge variant="outline" size="sm">{equip}</Badge>
      {/each}
    </div>
  {/if}

  <!-- Deviations Table -->
  {#if nodeDevs.length > 0}
    <div class="border border-border rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="hazop-table">
          <thead>
            <tr>
              <th class="w-32">Deviation</th>
              <th class="w-48">Causes</th>
              <th class="w-48">Consequences</th>
              <th class="w-40">Safeguards</th>
              <th class="w-24 text-center">Risk</th>
              <th class="w-24 text-center">Status</th>
              <th class="w-20"></th>
            </tr>
          </thead>
          <tbody>
            {#each nodeDevs as dev}
              <tr class="group">
                <td>
                  <div class="font-medium text-foreground">
                    {getGuideWordName(dev.guideWord)} {getParameterName(dev.parameter)}
                  </div>
                  {#if dev.description}
                    <p class="text-xs text-muted-foreground mt-1">{dev.description}</p>
                  {/if}
                </td>
                <td>
                  {#if dev.causes.length > 0}
                    <ul class="space-y-1">
                      {#each dev.causes.slice(0, 3) as cause}
                        <li class="text-xs flex items-start gap-1">
                          <span class="text-muted-foreground">•</span>
                          <span>{cause.description}</span>
                        </li>
                      {/each}
                      {#if dev.causes.length > 3}
                        <li class="text-xs text-muted-foreground">+{dev.causes.length - 3} more</li>
                      {/if}
                    </ul>
                  {:else}
                    <span class="text-xs text-muted-foreground">No causes defined</span>
                  {/if}
                </td>
                <td>
                  {#if dev.consequences.length > 0}
                    <ul class="space-y-1">
                      {#each dev.consequences.slice(0, 3) as cons}
                        <li class="text-xs flex items-start gap-1">
                          <Badge variant={cons.severity === 'catastrophic' || cons.severity === 'major' ? 'destructive' : cons.severity === 'moderate' ? 'warning' : 'secondary'} size="sm">
                            {cons.severity.charAt(0).toUpperCase()}
                          </Badge>
                          <span>{cons.description}</span>
                        </li>
                      {/each}
                      {#if dev.consequences.length > 3}
                        <li class="text-xs text-muted-foreground">+{dev.consequences.length - 3} more</li>
                      {/if}
                    </ul>
                  {:else}
                    <span class="text-xs text-muted-foreground">No consequences defined</span>
                  {/if}
                </td>
                <td>
                  {#if dev.safeguards.length > 0}
                    <ul class="space-y-1">
                      {#each dev.safeguards.slice(0, 2) as sg}
                        <li class="text-xs flex items-start gap-1">
                          <Badge variant={sg.existing ? 'success' : 'warning'} size="sm">
                            {sg.type.charAt(0).toUpperCase()}
                          </Badge>
                          <span class="truncate">{sg.description}</span>
                        </li>
                      {/each}
                      {#if dev.safeguards.length > 2}
                        <li class="text-xs text-muted-foreground">+{dev.safeguards.length - 2} more</li>
                      {/if}
                    </ul>
                  {:else}
                    <span class="text-xs text-muted-foreground">None</span>
                  {/if}
                </td>
                <td class="text-center">
                  {#if dev.riskRating}
                    <Badge variant={getRiskBadgeVariant(dev.riskRating.riskLevel)}>
                      {dev.riskRating.riskLevel.toUpperCase()}
                    </Badge>
                    <p class="text-[10px] text-muted-foreground mt-1">
                      {dev.riskRating.severity}×{dev.riskRating.likelihood}
                    </p>
                  {:else}
                    <span class="text-xs text-muted-foreground">N/A</span>
                  {/if}
                </td>
                <td class="text-center">
                  <Badge variant={dev.status === 'closed' ? 'success' : dev.status === 'in-review' ? 'warning' : 'secondary'}>
                    {dev.status}
                  </Badge>
                </td>
                <td>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      class="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                      on:click={() => dispatch('editDeviation', dev)}
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      class="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      on:click={() => dispatch('deleteDeviation', dev)}
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {:else}
    <div class="text-center py-12 border border-dashed border-border rounded-lg">
      <svg class="w-12 h-12 mx-auto text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mt-4 text-sm text-muted-foreground">No deviations recorded for this node</p>
      <Button variant="outline" size="sm" class="mt-4" on:click={() => dispatch('addDeviation')}>
        Start HAZOP Analysis
      </Button>
    </div>
  {/if}
</div>
