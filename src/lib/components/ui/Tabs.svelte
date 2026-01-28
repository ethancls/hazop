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
          {#if tab.icon}
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
