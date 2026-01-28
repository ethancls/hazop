<script lang="ts">
  import { 
    projects, 
    currentProject, 
    sidebarOpen, 
    darkMode,
    projectStats
  } from '../../stores/hazopStore';
  import Badge from '../ui/Badge.svelte';
  import Button from '../ui/Button.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function selectProject(project: typeof $projects[0]) {
    $currentProject = project;
    dispatch('projectSelect', project);
  }

  function toggleDarkMode() {
    $darkMode = !$darkMode;
    if ($darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
</script>

<aside 
  class="fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col
         {$sidebarOpen ? 'w-72' : 'w-16'}"
>
  <!-- Logo / Header -->
  <div class="h-16 flex items-center justify-between px-4 border-b border-border">
    {#if $sidebarOpen}
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span class="font-semibold text-foreground">HAZOP System</span>
      </div>
    {:else}
      <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
        <svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
    {/if}
    
    <button 
      class="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      on:click={() => $sidebarOpen = !$sidebarOpen}
      aria-label="Toggle sidebar"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {#if $sidebarOpen}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        {/if}
      </svg>
    </button>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-4 px-3">
    {#if $sidebarOpen}
      <!-- New Project Button -->
      <Button 
        variant="primary" 
        size="sm" 
        on:click={() => dispatch('newProject')}
        class="w-full mb-4"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Project
      </Button>

      <!-- Projects List -->
      <div class="space-y-1">
        <p class="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Projects
        </p>
        {#each $projects as project}
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors
                   {$currentProject?.id === project.id 
                     ? 'bg-primary/10 text-primary' 
                     : 'text-foreground hover:bg-accent'}"
            on:click={() => selectProject(project)}
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="truncate flex-1 text-left">{project.name}</span>
            <Badge 
              variant={project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'warning' : 'secondary'}
              size="sm"
            >
              {project.status}
            </Badge>
          </button>
        {/each}
        
        {#if $projects.length === 0}
          <p class="px-3 py-4 text-sm text-muted-foreground text-center">
            No projects yet. Create your first HAZOP study!
          </p>
        {/if}
      </div>
    {:else}
      <!-- Collapsed view -->
      <button 
        class="w-full p-2 rounded-md hover:bg-accent mb-2"
        on:click={() => dispatch('newProject')}
        title="New Project"
      >
        <svg class="w-5 h-5 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      {#each $projects as project}
        <button
          class="w-full p-2 rounded-md transition-colors mb-1
                 {$currentProject?.id === project.id 
                   ? 'bg-primary/10 text-primary' 
                   : 'hover:bg-accent text-muted-foreground'}"
          on:click={() => selectProject(project)}
          title={project.name}
        >
          <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      {/each}
    {/if}
  </nav>

  <!-- Footer -->
  <div class="p-3 border-t border-border">
    {#if $sidebarOpen}
      <div class="flex items-center justify-between">
        <button
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          on:click={toggleDarkMode}
        >
          {#if $darkMode}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Light Mode
          {:else}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Dark Mode
          {/if}
        </button>
        
        <button
          class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Settings"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    {:else}
      <button
        class="w-full p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        on:click={toggleDarkMode}
        title={$darkMode ? 'Light Mode' : 'Dark Mode'}
      >
        {#if $darkMode}
          <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        {:else}
          <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        {/if}
      </button>
    {/if}
  </div>
</aside>
