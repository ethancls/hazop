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

<form on:submit|preventDefault={handleSubmit} class="space-y-5">
  <!-- Project Name -->
  <Input 
    id="name"
    bind:value={name}
    label="Project Name"
    placeholder="e.g., Distillation Column Safety Study"
    required
  />

  <!-- Description -->
  <Textarea 
    id="description"
    bind:value={description}
    label="Project Description"
    placeholder="Brief overview of the HAZOP study objectives and scope..."
    rows={3}
  />

  <!-- Process Description -->
  <Textarea 
    id="processDescription"
    bind:value={processDescription}
    label="Process Description"
    placeholder="Detailed description of the chemical process, including key equipment, materials, and operating conditions..."
    hint="Include information about the process flow, equipment involved, and key operating parameters."
    rows={5}
    required
  />

  <!-- PFD Reference -->
  <Input 
    id="pfdReference"
    bind:value={pfdReference}
    label="PFD/P&ID Reference"
    placeholder="e.g., PFD-001-REV-A"
    hint="Reference number for the associated Process Flow Diagram or P&ID."
  />

  <!-- Status (only for edit mode) -->
  {#if mode === 'edit'}
    <Select 
      id="status"
      bind:value={status}
      label="Project Status"
      options={statusOptions}
    />
  {/if}

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
