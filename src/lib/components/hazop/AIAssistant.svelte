<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { generateHAZOPFromPrompt, applyGeneratedNodes, type AIGeneratedNode } from '../../stores/hazopStore';
  import Button from '../ui/Button.svelte';
  import Textarea from '../ui/Textarea.svelte';
  import Badge from '../ui/Badge.svelte';

  export let projectId: string;

  const dispatch = createEventDispatcher();

  let prompt = '';
  let isGenerating = false;
  let generatedNodes: AIGeneratedNode[] = [];
  let includeDeviations = true;
  let step: 'input' | 'preview' | 'complete' = 'input';

  async function handleGenerate() {
    if (!prompt.trim()) return;
    
    isGenerating = true;
    try {
      generatedNodes = await generateHAZOPFromPrompt({ processDescription: prompt });
      step = 'preview';
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      isGenerating = false;
    }
  }

  function handleApply() {
    applyGeneratedNodes(projectId, generatedNodes, includeDeviations);
    step = 'complete';
    setTimeout(() => {
      dispatch('complete');
    }, 1500);
  }

  function handleReset() {
    prompt = '';
    generatedNodes = [];
    step = 'input';
  }
</script>

<div class="space-y-6">
  {#if step === 'input'}
    <div class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 rounded-lg bg-primary/10">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-foreground">AI-Assisted HAZOP Generation</h3>
          <p class="text-sm text-muted-foreground">Describe your process and I'll suggest study nodes</p>
        </div>
      </div>

      <div class="space-y-2">
        <label for="process-prompt" class="text-sm font-medium text-foreground">
          Describe your process or system
        </label>
        <Textarea
          id="process-prompt"
          bind:value={prompt}
          placeholder="Example: A reactor cooling system with a centrifugal pump, shell and tube heat exchanger, and cooling tower. The system maintains reactor temperature at 80°C during exothermic reactions..."
          rows={5}
        />
      </div>

      <div class="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="include-deviations" 
          bind:checked={includeDeviations}
          class="rounded border-input bg-background text-primary focus:ring-primary"
        />
        <label for="include-deviations" class="text-sm text-muted-foreground">
          Include suggested deviations for each node
        </label>
      </div>

      <div class="flex justify-end gap-3">
        <Button variant="outline" on:click={() => dispatch('cancel')}>Cancel</Button>
        <Button 
          variant="primary" 
          disabled={!prompt.trim() || isGenerating}
          on:click={handleGenerate}
        >
          {#if isGenerating}
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Generating...
          {:else}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Nodes
          {/if}
        </Button>
      </div>
    </div>

  {:else if step === 'preview'}
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-foreground">Generated Nodes Preview</h3>
        <Badge variant="default">{generatedNodes.length} nodes</Badge>
      </div>

      <div class="space-y-3 max-h-[400px] overflow-y-auto">
        {#each generatedNodes as node, i}
          <div class="p-4 rounded-lg border border-border bg-card">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-medium text-foreground">{node.name}</h4>
                <p class="text-sm text-muted-foreground mt-1">{node.description}</p>
              </div>
              <span class="text-xs text-muted-foreground">#{i + 1}</span>
            </div>
            
            <div class="mt-3 pt-3 border-t border-border">
              <p class="text-xs text-muted-foreground mb-2">Equipment:</p>
              <div class="flex flex-wrap gap-1">
                {#each node.equipment as eq}
                  <span class="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">{eq}</span>
                {/each}
              </div>
            </div>

            {#if includeDeviations && node.suggestedDeviations.length > 0}
              <div class="mt-3 pt-3 border-t border-border">
                <p class="text-xs text-muted-foreground mb-2">Suggested deviations:</p>
                <div class="space-y-1">
                  {#each node.suggestedDeviations as dev}
                    <div class="text-xs text-foreground">
                      <span class="font-medium text-primary">{dev.guideWord.toUpperCase()}</span> {dev.parameter}: {dev.description}
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <div class="flex justify-end gap-3">
        <Button variant="outline" on:click={handleReset}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start Over
        </Button>
        <Button variant="primary" on:click={handleApply}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Apply to Project
        </Button>
      </div>
    </div>

  {:else if step === 'complete'}
    <div class="text-center py-8">
      <div class="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-foreground mb-2">Nodes Added Successfully!</h3>
      <p class="text-sm text-muted-foreground">
        {generatedNodes.length} nodes have been added to your project.
      </p>
    </div>
  {/if}
</div>
