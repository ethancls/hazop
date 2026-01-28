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

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <!-- Node Name -->
  <div>
    <label for="nodeName" class="form-label">
      Node Name <span class="text-destructive">*</span>
    </label>
    <Input 
      id="nodeName"
      bind:value={name}
      placeholder="e.g., Feed Tank T-101"
      required
    />
    <p class="mt-1.5 text-xs text-muted-foreground">
      A unique identifier for this study node (usually equipment tag or line number).
    </p>
  </div>

  <!-- Description -->
  <div>
    <label for="nodeDescription" class="form-label">
      Node Description
    </label>
    <Textarea 
      id="nodeDescription"
      bind:value={description}
      placeholder="Brief description of what this node represents in the process..."
      rows={3}
    />
  </div>

  <!-- Design Intent -->
  <div>
    <label for="designIntent" class="form-label">
      Design Intent <span class="text-destructive">*</span>
    </label>
    <Textarea 
      id="designIntent"
      bind:value={designIntent}
      placeholder="Describe the intended purpose and normal operating conditions of this node..."
      rows={4}
      required
    />
    <p class="mt-1.5 text-xs text-muted-foreground">
      The design intent defines what the node should do under normal operating conditions.
      This is crucial for identifying deviations.
    </p>
  </div>

  <!-- Equipment List -->
  <div>
    <label for="equipment" class="form-label">
      Equipment/Components
    </label>
    <Input 
      id="equipment"
      bind:value={equipmentInput}
      placeholder="e.g., Pump P-101, Valve V-102, Heat Exchanger E-103"
    />
    <p class="mt-1.5 text-xs text-muted-foreground">
      List equipment and components included in this node, separated by commas.
    </p>
  </div>

  <!-- Example design intents for reference -->
  <div class="p-4 rounded-lg bg-muted/50 border border-border">
    <p class="text-sm font-medium text-foreground mb-2">
      💡 Design Intent Examples:
    </p>
    <ul class="text-xs text-muted-foreground space-y-1.5">
      <li>• <strong>Feed Tank:</strong> Store raw material at ambient temperature and atmospheric pressure, maintaining level between 30-80%.</li>
      <li>• <strong>Heat Exchanger:</strong> Heat process fluid from 25°C to 80°C using steam at 3 bar.</li>
      <li>• <strong>Reactor:</strong> Maintain reaction at 150°C and 5 bar with residence time of 2 hours.</li>
      <li>• <strong>Transfer Line:</strong> Transport product at 50 L/min from reactor to storage tank.</li>
    </ul>
  </div>

  <!-- Form Actions -->
  <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
