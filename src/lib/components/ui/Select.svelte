<script lang="ts">
  export let value: string = '';
  export let disabled = false;
  export let id: string = '';
  export let name: string = '';
  export let placeholder: string = 'Select an option';

  interface Option {
    value: string;
    label: string;
    disabled?: boolean;
  }

  export let options: Option[] = [];
</script>

<div class="relative">
  <select
    {id}
    {name}
    {disabled}
    bind:value
    class="w-full px-3 py-2 bg-background border border-input rounded-md text-sm 
           appearance-none cursor-pointer transition-colors
           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
           disabled:cursor-not-allowed disabled:opacity-50"
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
