<script lang="ts">
  import { 
    projects, 
    currentProject, 
    sidebarOpen, 
    darkMode
  } from '../../stores/hazopStore';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  function selectProject(project: typeof $projects[0]) {
    $currentProject = project;
    dispatch('projectSelect', project);
  }

  function toggleDarkMode() {
    $darkMode = !$darkMode;
    if ($darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      $darkMode = false;
      document.documentElement.classList.remove('dark');
    } else {
      $darkMode = true;
      document.documentElement.classList.add('dark');
    }
  });
</script>

<aside 
  class="fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-out flex flex-col
         {$sidebarOpen ? 'w-64' : 'w-[60px]'}"
>
  <!-- Logo / Header -->
  <div class="h-14 flex items-center px-3 border-b border-border {$sidebarOpen ? 'justify-between' : 'justify-center'}">
    {#if $sidebarOpen}
      <div class="flex items-center gap-2.5">
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="molGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FF6B35"/>
              <stop offset="50%" stop-color="#FF3E00"/>
              <stop offset="100%" stop-color="#E63600"/>
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="10" fill="#0a0a0a"/>
          <line x1="24" y1="24" x2="12" y2="12" stroke="url(#molGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="24" y1="24" x2="36" y2="14" stroke="url(#molGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="24" y1="24" x2="14" y2="36" stroke="url(#molGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="24" y1="24" x2="38" y2="34" stroke="url(#molGrad)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="24" cy="24" r="6" fill="url(#molGrad)"/>
          <circle cx="12" cy="12" r="4" fill="url(#molGrad)"/>
          <circle cx="36" cy="14" r="4" fill="url(#molGrad)"/>
          <circle cx="14" cy="36" r="4" fill="url(#molGrad)"/>
          <circle cx="38" cy="34" r="4" fill="url(#molGrad)"/>
        </svg>
        <div class="flex items-baseline gap-1">
          <span class="font-bold text-foreground text-sm tracking-tight">HAZOP</span>
          <span class="text-[10px] text-primary font-semibold">PRO</span>
        </div>
      </div>
      <button 
        class="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        on:click={() => $sidebarOpen = false}
        aria-label="Collapse sidebar"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    {:else}
      <button
        class="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        on:click={() => $sidebarOpen = true}
        aria-label="Expand sidebar"
      >
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="molGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FF6B35"/>
              <stop offset="50%" stop-color="#FF3E00"/>
              <stop offset="100%" stop-color="#E63600"/>
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="10" fill="#0a0a0a"/>
          <line x1="24" y1="24" x2="12" y2="12" stroke="url(#molGradSmall)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="24" y1="24" x2="36" y2="14" stroke="url(#molGradSmall)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="24" y1="24" x2="14" y2="36" stroke="url(#molGradSmall)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="24" y1="24" x2="38" y2="34" stroke="url(#molGradSmall)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="24" cy="24" r="6" fill="url(#molGradSmall)"/>
          <circle cx="12" cy="12" r="4" fill="url(#molGradSmall)"/>
          <circle cx="36" cy="14" r="4" fill="url(#molGradSmall)"/>
          <circle cx="14" cy="36" r="4" fill="url(#molGradSmall)"/>
          <circle cx="38" cy="34" r="4" fill="url(#molGradSmall)"/>
        </svg>
      </button>
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-3 px-2">
    {#if $sidebarOpen}
      <!-- New Project Button -->
      <button 
        class="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        on:click={() => dispatch('newProject')}
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Project
      </button>

      <!-- Projects List -->
      <div class="space-y-0.5">
        <p class="px-2 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Projects
        </p>
        {#each $projects as project}
          <button
            class="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all
                   {$currentProject?.id === project.id 
                     ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                     : 'text-muted-foreground hover:text-foreground hover:bg-accent'}"
            on:click={() => selectProject(project)}
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span class="truncate flex-1 text-left">{project.name}</span>
          </button>
        {/each}
        
        {#if $projects.length === 0}
          <div class="px-2 py-6 text-center">
            <svg class="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p class="text-xs text-muted-foreground">No projects yet</p>
          </div>
        {/if}
      </div>
    {:else}
      <!-- Collapsed view -->
      <div class="flex flex-col items-center gap-1">
        <button 
          class="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          on:click={() => dispatch('newProject')}
          title="New Project"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <div class="w-8 border-t border-border my-2"></div>
        
        {#each $projects as project}
          <button
            class="w-9 h-9 flex items-center justify-center rounded-lg transition-colors
                   {$currentProject?.id === project.id 
                     ? 'bg-primary/10 text-primary' 
                     : 'text-muted-foreground hover:text-foreground hover:bg-accent'}"
            on:click={() => selectProject(project)}
            title={project.name}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </button>
        {/each}
      </div>
    {/if}
  </nav>

  <!-- Footer -->
  <div class="p-2 border-t border-border">
    {#if $sidebarOpen}
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-2 text-[11px] text-muted-foreground">
          <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span>v1.0.0</span>
        </div>
        
        <button
          class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          on:click={toggleDarkMode}
          title={$darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {#if $darkMode}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          {:else}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          {/if}
        </button>
      </div>
    {:else}
      <div class="flex flex-col items-center">
        <button
          class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          on:click={toggleDarkMode}
          title={$darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {#if $darkMode}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          {:else}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          {/if}
        </button>
      </div>
    {/if}
  </div>
</aside>
