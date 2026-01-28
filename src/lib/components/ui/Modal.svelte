<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let open = false;
  export let title = '';
  export let description = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  const dispatch = createEventDispatcher();

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      close();
    }
  }

  function close() {
    open = false;
    dispatch('close');
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if open}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center"
    transition:fade={{ duration: 150 }}
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
    
    <!-- Modal -->
    <div 
      class="relative w-full {sizeClasses[size]} mx-4 bg-card rounded-lg shadow-xl border border-border"
      transition:scale={{ duration: 150, start: 0.95 }}
    >
      <!-- Header -->
      {#if title || $$slots.header}
        <div class="flex items-start justify-between p-6 border-b border-border">
          <div>
            {#if $$slots.header}
              <slot name="header" />
            {:else}
              <h2 id="modal-title" class="text-lg font-semibold text-foreground">{title}</h2>
              {#if description}
                <p class="mt-1 text-sm text-muted-foreground">{description}</p>
              {/if}
            {/if}
          </div>
          <button
            type="button"
            class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            on:click={close}
            aria-label="Close modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/if}
      
      <!-- Content -->
      <div class="p-6 max-h-[70vh] overflow-y-auto">
        <slot />
      </div>
      
      <!-- Footer -->
      {#if $$slots.footer}
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}
