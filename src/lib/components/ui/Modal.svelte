<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let open = false;
  export let title = '';
  export let description = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';

  const dispatch = createEventDispatcher();

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
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

  // Lock body scroll when modal is open
  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : '';
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
  >
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm"
      transition:fade={{ duration: 200 }}
    ></div>
    
    <!-- Modal -->
    <div 
      class="relative w-full {sizeClasses[size]} bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
      transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
    >
      <!-- Header -->
      {#if title || $$slots.header}
        <div class="flex items-start justify-between px-6 py-5 border-b border-border bg-muted/30">
          <div class="pr-8">
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
            class="absolute right-4 top-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
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
      <div class="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
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
