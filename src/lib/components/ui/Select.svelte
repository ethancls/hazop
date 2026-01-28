<script lang="ts">
  export let value: string = '';
  export let disabled = false;
  export let id: string = '';
  export let name: string = '';
  export let placeholder: string = 'Select an option';
  export let label: string = '';
  export let hint: string = '';
  export let error: string = '';
  export let required = false;
  let className = '';
  export { className as class };

  interface Option {
    value: string;
    label: string;
    disabled?: boolean;
  }

  export let options: Option[] = [];
</script>

<div class="space-y-1.5 {className}">
  {#if label}
    <label for={id} class="block text-sm font-medium text-foreground">
      {label}
      {#if required}<span class="text-primary">*</span>{/if}
    </label>
  {/if}
  
  <div class="relative">
    <select
      {id}
      {name}
      {disabled}
      {required}
      bind:value
      class="w-full h-10 px-3 pr-10 bg-background border rounded-lg text-sm text-foreground
             appearance-none cursor-pointer transition-all duration-200
             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
             disabled:cursor-not-allowed disabled:opacity-50
             {error ? 'border-destructive focus:ring-destructive/50' : 'border-input hover:border-muted-foreground/50'}"
      on:change
    >
      {#if placeholder}
        <option value="" disabled>{placeholder}</option>
      {/if}
      {#each options as option}
        <option value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      {/each}
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
  
  {#if hint && !error}
    <p class="text-xs text-muted-foreground">{hint}</p>
  {/if}
  
  {#if error}
    <p class="text-xs text-destructive">{error}</p>
  {/if}
</div>
