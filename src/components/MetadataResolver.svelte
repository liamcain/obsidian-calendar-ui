<svelte:options immutable />

<script lang="ts">
  import type { IEvaluatedMetadata } from "../types";

  export let metadata: Promise<IEvaluatedMetadata> | null;
  let previouslyResolvedMeta: IEvaluatedMetadata | null = null;

  $: metadata.then((resolved) => {
    previouslyResolvedMeta = resolved;
  });
</script>

{#if metadata}
  {#await metadata}
    <slot metadata="{previouslyResolvedMeta}" />
  {:then resolvedMeta}
    <slot metadata="{resolvedMeta}" />
  {/await}
{:else}
  <slot metadata="{previouslyResolvedMeta}" />
{/if}
