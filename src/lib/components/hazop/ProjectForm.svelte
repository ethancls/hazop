<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Project } from '../../types/hazop';
  import Button from '../ui/Button.svelte';
  import Input from '../ui/Input.svelte';
  import Textarea from '../ui/Textarea.svelte';
  import Select from '../ui/Select.svelte';

  export let project: Partial<Project> = {};
  export let mode: 'create' | 'edit' = 'create';

  const dispatch = createEventDispatcher();

  let name = project.name || '';
  let description = project.description || '';
  let processDescription = project.processDescription || '';
  let pfdReference = project.pfdReference || '';
  let status = project.status || 'draft';

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ];

  function handleSubmit() {
    const projectData: Partial<Project> = {
      name,
      description,
      processDescription,
      pfdReference,
      status: status as Project['status'],
    };

    if (mode === 'edit' && project.id) {
      projectData.id = project.id;
    }

    dispatch('submit', projectData);
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <!-- Project Name -->
  <div>
    <label for="name" class="form-label">
      Project Name <span class="text-destructive">*</span>
    </label>
    <Input 
      id="name"
      bind:value={name}
      placeholder="e.g., Distillation Column Safety Study"
      required
    />
  </div>

  <!-- Description -->
  <div>
    <label for="description" class="form-label">
      Project Description
    </label>
    <Textarea 
      id="description"
      bind:value={description}
      placeholder="Brief overview of the HAZOP study objectives and scope..."
      rows={3}
    />
  </div>

  <!-- Process Description -->
  <div>
    <label for="processDescription" class="form-label">
      Process Description <span class="text-destructive">*</span>
    </label>
    <Textarea 
      id="processDescription"
      bind:value={processDescription}
      placeholder="Detailed description of the chemical process, including key equipment, materials, and operating conditions..."
      rows={5}
      required
    />
    <p class="mt-1.5 text-xs text-muted-foreground">
      Include information about the process flow, equipment involved, and key operating parameters.
    </p>
  </div>

  <!-- PFD Reference -->
  <div>
    <label for="pfdReference" class="form-label">
      PFD/P&ID Reference
    </label>
    <Input 
      id="pfdReference"
      bind:value={pfdReference}
      placeholder="e.g., PFD-001-REV-A"
    />
    <p class="mt-1.5 text-xs text-muted-foreground">
      Reference number for the associated Process Flow Diagram or P&ID.
    </p>
  </div>

  <!-- Status (only for edit mode) -->
  {#if mode === 'edit'}
    <div>
      <label for="status" class="form-label">
        Project Status
      </label>
      <Select 
        id="status"
        bind:value={status}
        options={statusOptions}
      />
    </div>
  {/if}

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
        Create Project
      {:else}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Save Changes
      {/if}
    </Button>
  </div>
</form>
