<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Node } from '../../types/hazop';
  import Button from '../ui/Button.svelte';
  import Input from '../ui/Input.svelte';
  import Textarea from '../ui/Textarea.svelte';

  export let node: Partial<Node> = {};
  export let projectId: string;
  export let mode: 'create' | 'edit' = 'create';

  const dispatch = createEventDispatcher();

  let name = node.name || '';
  let description = node.description || '';
  let designIntent = node.designIntent || '';
  let equipmentInput = node.equipment?.join(', ') || '';

  function handleSubmit() {
    const equipment = equipmentInput
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    const nodeData: Partial<Node> = {
      name,
      description,
      designIntent,
      equipment,
      projectId,
      position: node.position || { x: 100, y: 100 },
    };

    if (mode === 'edit' && node.id) {
      nodeData.id = node.id;
    }

    dispatch('submit', nodeData);
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-5">
  <!-- Node Name -->
  <Input 
    id="nodeName"
    bind:value={name}
    label="Node Name"
    placeholder="e.g., Feed Tank T-101"
    hint="A unique identifier for this study node (usually equipment tag or line number)."
    required
  />

  <!-- Description -->
  <Textarea 
    id="nodeDescription"
    bind:value={description}
    label="Node Description"
    placeholder="Brief description of what this node represents in the process..."
    rows={3}
  />

  <!-- Design Intent -->
  <Textarea 
    id="designIntent"
    bind:value={designIntent}
    label="Design Intent"
    placeholder="Describe the intended purpose and normal operating conditions of this node..."
    hint="The design intent defines what the node should do under normal operating conditions. This is crucial for identifying deviations."
    rows={4}
    required
  />

  <!-- Equipment List -->
  <Input 
    id="equipment"
    bind:value={equipmentInput}
    label="Equipment/Components"
    placeholder="e.g., Pump P-101, Valve V-102, Heat Exchanger E-103"
    hint="List equipment and components included in this node, separated by commas."
  />

  <!-- Example design intents for reference -->
  <div class="p-4 rounded-xl bg-muted/30 border border-border">
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <span class="text-sm font-medium text-foreground">Design Intent Examples</span>
    </div>
    <ul class="text-xs text-muted-foreground space-y-1.5 pl-6">
      <li><strong>Feed Tank:</strong> Store raw material at ambient temperature and atmospheric pressure, maintaining level between 30-80%.</li>
      <li><strong>Heat Exchanger:</strong> Heat process fluid from 25°C to 80°C using steam at 3 bar.</li>
      <li><strong>Reactor:</strong> Maintain reaction at 150°C and 5 bar with residence time of 2 hours.</li>
      <li><strong>Transfer Line:</strong> Transport product at 50 L/min from reactor to storage tank.</li>
    </ul>
  </div>

  <!-- Form Actions -->
  <div class="flex items-center justify-end gap-3 pt-5 border-t border-border">
    <Button variant="outline" on:click={handleCancel}>
      Cancel
    </Button>
    <Button variant="primary" type="submit">
      {#if mode === 'create'}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Node
      {:else}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Save Node
      {/if}
    </Button>
  </div>
</form>
