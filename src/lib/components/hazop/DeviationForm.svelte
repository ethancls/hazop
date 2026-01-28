<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Deviation, Cause, Consequence, Safeguard } from '../../types/hazop';
  import { PROCESS_PARAMETERS, GUIDE_WORDS, calculateRiskLevel } from '../../types/hazop';
  import { generateId } from '../../stores/hazopStore';
  import Button from '../ui/Button.svelte';
  import Input from '../ui/Input.svelte';
  import Textarea from '../ui/Textarea.svelte';
  import Select from '../ui/Select.svelte';
  import Badge from '../ui/Badge.svelte';

  export let deviation: Partial<Deviation> = {};
  export let nodeId: string;
  export let mode: 'create' | 'edit' = 'create';

  const dispatch = createEventDispatcher();

  let parameter = deviation.parameter || '';
  let guideWord = deviation.guideWord || '';
  let description = deviation.description || '';
  let causes: Cause[] = deviation.causes || [];
  let consequences: Consequence[] = deviation.consequences || [];
  let safeguards: Safeguard[] = deviation.safeguards || [];
  let severity = deviation.riskRating?.severity || 1;
  let likelihood = deviation.riskRating?.likelihood || 1;

  let newCause = '';
  let newCauseCategory: Cause['category'] = 'equipment';
  let newConsequence = '';
  let newConsequenceCategory: Consequence['category'] = 'safety';
  let newConsequenceSeverity: Consequence['severity'] = 'minor';
  let newSafeguard = '';
  let newSafeguardType: Safeguard['type'] = 'prevention';
  let newSafeguardEffectiveness: Safeguard['effectiveness'] = 'medium';
  let newSafeguardExisting = true;

  const parameterOptions = PROCESS_PARAMETERS.map(p => ({ value: p.id, label: `${p.name}` }));
  
  $: applicableGuideWords = parameter 
    ? GUIDE_WORDS.filter(gw => gw.applicableParameters.includes(parameter))
    : GUIDE_WORDS;

  $: guideWordOptions = applicableGuideWords.map(gw => ({ value: gw.id, label: gw.name }));
  
  $: deviationText = parameter && guideWord
    ? `${GUIDE_WORDS.find(g => g.id === guideWord)?.name || ''} ${PROCESS_PARAMETERS.find(p => p.id === parameter)?.name || ''}`
    : '';

  $: riskLevel = calculateRiskLevel(severity, likelihood);

  const causeCategories = [
    { value: 'equipment', label: 'Equipment' },
    { value: 'human', label: 'Human' },
    { value: 'process', label: 'Process' },
    { value: 'external', label: 'External' },
  ];

  const consequenceCategories = [
    { value: 'safety', label: 'Safety' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'operational', label: 'Operational' },
    { value: 'economic', label: 'Economic' },
  ];

  const consequenceSeverities = [
    { value: 'negligible', label: 'Negligible' },
    { value: 'minor', label: 'Minor' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'major', label: 'Major' },
    { value: 'catastrophic', label: 'Catastrophic' },
  ];

  const safeguardTypes = [
    { value: 'prevention', label: 'Prevention' },
    { value: 'detection', label: 'Detection' },
    { value: 'mitigation', label: 'Mitigation' },
  ];

  const effectivenessLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  function addCause() {
    if (newCause.trim()) {
      causes = [...causes, { id: generateId(), description: newCause.trim(), category: newCauseCategory }];
      newCause = '';
    }
  }

  function removeCause(id: string) {
    causes = causes.filter(c => c.id !== id);
  }

  function addConsequence() {
    if (newConsequence.trim()) {
      consequences = [...consequences, { id: generateId(), description: newConsequence.trim(), category: newConsequenceCategory, severity: newConsequenceSeverity }];
      newConsequence = '';
    }
  }

  function removeConsequence(id: string) {
    consequences = consequences.filter(c => c.id !== id);
  }

  function addSafeguard() {
    if (newSafeguard.trim()) {
      safeguards = [...safeguards, { id: generateId(), description: newSafeguard.trim(), type: newSafeguardType, effectiveness: newSafeguardEffectiveness, existing: newSafeguardExisting }];
      newSafeguard = '';
    }
  }

  function removeSafeguard(id: string) {
    safeguards = safeguards.filter(s => s.id !== id);
  }

  function handleSubmit() {
    const deviationData: Partial<Deviation> = {
      nodeId,
      parameter,
      guideWord,
      description: description || deviationText,
      causes,
      consequences,
      safeguards,
      recommendations: deviation.recommendations || [],
      riskRating: { severity: severity as 1|2|3|4|5, likelihood: likelihood as 1|2|3|4|5, riskLevel },
      status: deviation.status || 'open',
    };
    if (mode === 'edit' && deviation.id) deviationData.id = deviation.id;
    dispatch('submit', deviationData);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
  <!-- Deviation Definition -->
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="form-label">Parameter <span class="text-destructive">*</span></label>
      <Select bind:value={parameter} options={parameterOptions} placeholder="Select parameter" />
    </div>
    <div>
      <label class="form-label">Guide Word <span class="text-destructive">*</span></label>
      <Select bind:value={guideWord} options={guideWordOptions} placeholder="Select guide word" disabled={!parameter} />
    </div>
  </div>

  {#if deviationText}
    <div class="p-3 rounded-lg bg-primary/10 border border-primary/20">
      <p class="text-sm font-medium text-primary">Deviation: {deviationText}</p>
    </div>
  {/if}

  <div>
    <label class="form-label">Additional Description</label>
    <Textarea bind:value={description} placeholder="Describe this deviation in more detail..." rows={2} />
  </div>

  <!-- Causes Section -->
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Causes
    </h3>
    <div class="flex gap-2">
      <Input bind:value={newCause} placeholder="Enter cause description..." />
      <Select bind:value={newCauseCategory} options={causeCategories} />
      <Button variant="outline" size="sm" on:click={addCause} type="button">Add</Button>
    </div>
    {#if causes.length > 0}
      <div class="space-y-2">
        {#each causes as cause}
          <div class="flex items-center gap-2 p-2 rounded bg-muted/50">
            <Badge variant="secondary" size="sm">{cause.category}</Badge>
            <span class="flex-1 text-sm">{cause.description}</span>
            <button type="button" class="text-muted-foreground hover:text-destructive" on:click={() => removeCause(cause.id)}>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Consequences Section -->
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      Consequences
    </h3>
    <div class="flex gap-2">
      <Input bind:value={newConsequence} placeholder="Enter consequence..." />
      <Select bind:value={newConsequenceCategory} options={consequenceCategories} />
      <Select bind:value={newConsequenceSeverity} options={consequenceSeverities} />
      <Button variant="outline" size="sm" on:click={addConsequence} type="button">Add</Button>
    </div>
    {#if consequences.length > 0}
      <div class="space-y-2">
        {#each consequences as cons}
          <div class="flex items-center gap-2 p-2 rounded bg-muted/50">
            <Badge variant={cons.severity === 'catastrophic' || cons.severity === 'major' ? 'destructive' : cons.severity === 'moderate' ? 'warning' : 'secondary'} size="sm">{cons.severity}</Badge>
            <Badge variant="outline" size="sm">{cons.category}</Badge>
            <span class="flex-1 text-sm">{cons.description}</span>
            <button type="button" class="text-muted-foreground hover:text-destructive" on:click={() => removeConsequence(cons.id)}>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Safeguards Section -->
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      Safeguards
    </h3>
    <div class="flex gap-2 flex-wrap">
      <Input bind:value={newSafeguard} placeholder="Enter safeguard..." />
      <Select bind:value={newSafeguardType} options={safeguardTypes} />
      <Select bind:value={newSafeguardEffectiveness} options={effectivenessLevels} />
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" bind:checked={newSafeguardExisting} class="rounded border-input" />
        Existing
      </label>
      <Button variant="outline" size="sm" on:click={addSafeguard} type="button">Add</Button>
    </div>
    {#if safeguards.length > 0}
      <div class="space-y-2">
        {#each safeguards as sg}
          <div class="flex items-center gap-2 p-2 rounded bg-muted/50">
            <Badge variant={sg.existing ? 'success' : 'warning'} size="sm">{sg.existing ? 'Existing' : 'Proposed'}</Badge>
            <Badge variant="outline" size="sm">{sg.type}</Badge>
            <Badge variant="secondary" size="sm">{sg.effectiveness}</Badge>
            <span class="flex-1 text-sm">{sg.description}</span>
            <button type="button" class="text-muted-foreground hover:text-destructive" on:click={() => removeSafeguard(sg.id)}>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Risk Rating -->
  <div class="p-4 rounded-lg border border-border bg-muted/30">
    <h3 class="text-sm font-semibold text-foreground mb-4">Risk Assessment</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="form-label">Severity (1-5)</label>
        <input type="range" min="1" max="5" bind:value={severity} class="w-full" />
        <div class="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Negligible</span><span>Catastrophic</span>
        </div>
        <p class="text-center text-sm font-medium mt-1">{severity}</p>
      </div>
      <div>
        <label class="form-label">Likelihood (1-5)</label>
        <input type="range" min="1" max="5" bind:value={likelihood} class="w-full" />
        <div class="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Rare</span><span>Certain</span>
        </div>
        <p class="text-center text-sm font-medium mt-1">{likelihood}</p>
      </div>
    </div>
    <div class="mt-4 text-center">
      <span class="text-sm text-muted-foreground">Risk Level: </span>
      <Badge variant={riskLevel === 'critical' ? 'destructive' : riskLevel === 'high' ? 'destructive' : riskLevel === 'medium' ? 'warning' : 'success'}>
        {riskLevel.toUpperCase()} (Score: {severity * likelihood})
      </Badge>
    </div>
  </div>

  <!-- Actions -->
  <div class="flex justify-end gap-3 pt-4 border-t border-border sticky bottom-0 bg-card">
    <Button variant="outline" on:click={() => dispatch('cancel')} type="button">Cancel</Button>
    <Button variant="primary" type="submit" disabled={!parameter || !guideWord}>
      {mode === 'create' ? 'Add Deviation' : 'Save Changes'}
    </Button>
  </div>
</form>
