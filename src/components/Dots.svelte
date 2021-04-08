<script lang="ts">
  import type { IDayMetadata } from "src/types";

  import Dot from "./Dot.svelte";

  export let centered: boolean = true;
  export let metadata: IDayMetadata[];

  const MAX_DOTS_PER_DAY = 8;

  let sortedMeta: IDayMetadata[];
  $: sortedMeta =
    metadata &&
    metadata.sort((a, b) => a.order - b.order).slice(0, MAX_DOTS_PER_DAY);
</script>

<div class="dot-container" class:centered>
  {#if metadata}
    {#each sortedMeta as { color, display, dots = [] }}
      {#if display === "calendar-and-menu"}
        {#each dots as dot}
          <Dot {...dot} color="{color}" />
        {/each}
      {/if}
    {/each}
  {/if}
</div>

<style>
  .dot-container {
    display: flex;
    flex-wrap: wrap;
    line-height: 6px;
    min-height: 6px;
  }

  .centered {
    justify-content: center;
  }
</style>
