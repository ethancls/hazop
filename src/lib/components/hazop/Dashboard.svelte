<script lang="ts">
  import { projectStats, currentProject, openRecommendations, deviations, projectNodes } from '../../stores/hazopStore';
  import Card from '../ui/Card.svelte';
  import Badge from '../ui/Badge.svelte';

  $: stats = $projectStats;
</script>

{#if $currentProject && stats}
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-foreground">{$currentProject.name}</h1>
      <p class="text-muted-foreground mt-1">{$currentProject.description || 'No description provided'}</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Nodes -->
      <Card>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-primary/10">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Study Nodes</p>
            <p class="text-2xl font-bold text-foreground">{stats.totalNodes}</p>
          </div>
        </div>
      </Card>

      <!-- Total Deviations -->
      <Card>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-warning/10">
            <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Deviations</p>
            <p class="text-2xl font-bold text-foreground">{stats.totalDeviations}</p>
          </div>
        </div>
      </Card>

      <!-- Open Actions -->
      <Card>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-destructive/10">
            <svg class="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Open Actions</p>
            <p class="text-2xl font-bold text-foreground">{stats.openActions}</p>
          </div>
        </div>
      </Card>

      <!-- Completed Actions -->
      <Card>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-success/10">
            <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Completed</p>
            <p class="text-2xl font-bold text-foreground">{stats.completedActions}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Risk Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div class="p-1">
          <h3 class="text-lg font-semibold text-foreground mb-4">Risk Distribution</h3>
          <div class="space-y-3">
            {#each ['critical', 'high', 'medium', 'low'] as level}
              {@const count = stats.riskCounts[level] || 0}
              {@const total = stats.totalDeviations || 1}
              {@const percentage = Math.round((count / total) * 100)}
              <div>
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="flex items-center gap-2">
                    <Badge variant={level === 'critical' || level === 'high' ? 'destructive' : level === 'medium' ? 'warning' : 'success'}>
                      {level.toUpperCase()}
                    </Badge>
                  </span>
                  <span class="text-muted-foreground">{count} ({percentage}%)</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-500
                           {level === 'critical' || level === 'high' ? 'bg-destructive' : level === 'medium' ? 'bg-warning' : 'bg-success'}"
                    style="width: {percentage}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </Card>

      <Card>
        <div class="p-1">
          <h3 class="text-lg font-semibold text-foreground mb-4">Process Description</h3>
          <p class="text-sm text-muted-foreground whitespace-pre-wrap">
            {$currentProject.processDescription || 'No process description provided.'}
          </p>
          {#if $currentProject.pfdReference}
            <div class="mt-4 pt-4 border-t border-border">
              <p class="text-xs text-muted-foreground">
                <span class="font-medium">PFD Reference:</span> {$currentProject.pfdReference}
              </p>
            </div>
          {/if}
        </div>
      </Card>
    </div>

    <!-- Recent Open Actions -->
    {#if $openRecommendations.length > 0}
      <Card>
        <div class="p-1">
          <h3 class="text-lg font-semibold text-foreground mb-4">Open Recommendations</h3>
          <div class="space-y-3">
            {#each $openRecommendations.slice(0, 5) as rec}
              <div class="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge 
                  variant={rec.priority === 'critical' ? 'destructive' : rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'warning' : 'secondary'}
                  size="sm"
                >
                  {rec.priority}
                </Badge>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-foreground">{rec.description}</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    From: {rec.deviation.description || 'Unnamed deviation'}
                  </p>
                </div>
                <Badge variant={rec.status === 'in-progress' ? 'warning' : 'outline'} size="sm">
                  {rec.status}
                </Badge>
              </div>
            {/each}
          </div>
        </div>
      </Card>
    {/if}
  </div>
{:else}
  <div class="h-full flex flex-col items-center justify-center text-center p-8">
    <div class="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
      <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    </div>
    <h2 class="text-xl font-semibold text-foreground mb-2">Welcome to HAZOP System</h2>
    <p class="text-muted-foreground max-w-md">
      Select a project from the sidebar or create a new one to begin your Hazard and Operability Study.
    </p>
  </div>
{/if}
