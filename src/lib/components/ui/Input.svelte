<script lang="ts">
  export let value: string = '';
  export let type: string = 'text';
  export let placeholder: string = '';
  export let disabled = false;
  export let id: string = '';
  export let name: string = '';
  export let required = false;
  export let label: string = '';
  export let hint: string = '';
  export let error: string = '';
  let className = '';
  export { className as class };
</script>

<div class="space-y-1.5 {className}">
  {#if label}
    <label for={id} class="block text-sm font-medium text-foreground">
      {label}
      {#if required}<span class="text-primary">*</span>{/if}
    </label>
  {/if}
  
  <input
    {type}
    {id}
    {name}
    {placeholder}
    {disabled}
    {required}
    bind:value
    class="w-full h-10 px-3 bg-background border rounded-lg text-sm text-foreground
           placeholder:text-muted-foreground transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
           disabled:cursor-not-allowed disabled:opacity-50
           {error ? 'border-destructive focus:ring-destructive/50' : 'border-input hover:border-muted-foreground/50'}"
    on:input
    on:change
    on:focus
    on:blur
  />
  
  {#if hint && !error}
    <p class="text-xs text-muted-foreground">{hint}</p>
  {/if}
  
  {#if error}
    <p class="text-xs text-destructive">{error}</p>
  {/if}
</div>
