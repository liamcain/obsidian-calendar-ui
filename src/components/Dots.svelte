<script lang="ts">
  import type { IEvaluatedMetadata } from "src/types";

  import Dot from "./Dot.svelte";

  export let centered: boolean = true;
  export let metadata: IEvaluatedMetadata;

  const MAX_DOTS_PER_SOURCE = 5;
</script>

<div class="dot-container" class:centered>
  {#if metadata}
    {#each metadata.dots.slice(0, MAX_DOTS_PER_SOURCE) as dot}
      <Dot {...dot} />
    {/each}
  {/if}
</div>

<style>
  .dot-container {
    pointer-events: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, 6px);
    column-gap: 1px;
    min-height: 6px;
    row-gap: 1px;
  }

  .centered {
    justify-content: center;
  }
</style>
