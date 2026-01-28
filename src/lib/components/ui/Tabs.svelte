<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Tab {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    badge?: string | number;
  }

  export let tabs: Tab[] = [];
  export let activeTab: string = tabs[0]?.id || '';

  const dispatch = createEventDispatcher();

  function selectTab(tab: Tab) {
    if (!tab.disabled) {
      activeTab = tab.id;
      dispatch('change', { tab: tab.id });
    }
  }

  const iconPaths: Record<string, string> = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    flow: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    analysis: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  };
</script>

<div class="w-full">
  <div class="flex border-b border-border" role="tablist">
    {#each tabs as tab}
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        class="relative px-4 py-3 text-sm font-medium transition-colors
               {activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
               {tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
        disabled={tab.disabled}
        on:click={() => selectTab(tab)}
      >
        <span class="flex items-center gap-2">
          {#if tab.icon && iconPaths[tab.icon]}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={iconPaths[tab.icon]} />
            </svg>
          {:else if tab.icon}
            <span class="text-base">{tab.icon}</span>
          {/if}
          {tab.label}
          {#if tab.badge !== undefined}
            <span class="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary">
              {tab.badge}
            </span>
          {/if}
        </span>
        {#if activeTab === tab.id}
          <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></span>
        {/if}
      </button>
    {/each}
  </div>
</div>
