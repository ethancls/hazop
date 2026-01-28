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

<div 
  class="rounded-lg {variantClasses[variant]} {paddingClasses[padding]} {hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}"
  on:click
  on:keydown
  role={hoverable ? 'button' : undefined}
  tabindex={hoverable ? 0 : undefined}
>
  <slot />
</div>
