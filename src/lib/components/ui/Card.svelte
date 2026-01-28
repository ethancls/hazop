<script lang="ts">
  export let variant: 'default' | 'outline' | 'ghost' = 'default';
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let hoverable = false;

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-card border border-border shadow-sm',
    outline: 'border border-border bg-transparent',
    ghost: 'bg-transparent',
  };
</script>

{#if hoverable}
  <button 
    type="button"
    class="w-full text-left rounded-xl {variantClasses[variant]} {paddingClasses[padding]} hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
    on:click
    on:keydown
  >
    <slot />
  </button>
{:else}
  <div 
    class="rounded-xl {variantClasses[variant]} {paddingClasses[padding]}"
  >
    <slot />
  </div>
{/if}
