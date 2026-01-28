<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let variant: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let href: string | null = null;
  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  $: classes = `inline-flex items-center justify-center gap-2 font-medium rounded-md 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
    disabled:pointer-events-none disabled:opacity-50 
    ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
</script>

{#if href}
  <a {href} class={classes} class:opacity-50={disabled}>
    <slot />
  </a>
{:else}
  <button
    {type}
    {disabled}
    class={classes}
    on:click
    on:keydown
  >
    <slot />
  </button>
{/if}
