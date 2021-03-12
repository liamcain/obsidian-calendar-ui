<script lang="ts">
  import type { IDayMetadata } from "src/types";

  import Dot from "./Dot.svelte";

  export let metadata: IDayMetadata[];
</script>

<div class="dot-container">
  {#each metadata as { toDots, value, goal }}
    {#if toDots}
      {#each toDots(value, goal) as dot}
        <Dot {...dot} />
      {/each}
    {/if}
  {/each}
</div>

<style>
  .dot-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    line-height: 6px;
    min-height: 6px;
  }
</style>
