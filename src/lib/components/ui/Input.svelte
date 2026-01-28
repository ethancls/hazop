<script lang="ts">
  export let value: string = '';
  export let type: string = 'text';
  export let placeholder: string = '';
  export let disabled = false;
  export let id: string = '';
  export let name: string = '';
  export let required = false;
</script>

<input
  {type}
  {id}
  {name}
  {placeholder}
  {disabled}
  {required}
  bind:value
  class="w-full px-3 py-2 bg-background border border-input rounded-md text-sm 
         placeholder:text-muted-foreground transition-colors
         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
         disabled:cursor-not-allowed disabled:opacity-50"
  on:input
  on:change
  on:focus
  on:blur
/>
