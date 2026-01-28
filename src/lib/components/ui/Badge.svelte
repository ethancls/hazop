<script lang="ts">
  export let variant: 'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'outline' = 'default';
  export let size: 'sm' | 'md' = 'md';

  const variantClasses = {
    default: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border-secondary',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    success: 'bg-success/10 text-success border-success/20',
    outline: 'bg-transparent border-border text-foreground',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  };
</script>

<span class="inline-flex items-center rounded-full font-medium border {variantClasses[variant]} {sizeClasses[size]}">
  <slot />
</span>
