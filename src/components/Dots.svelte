<script lang="ts">
  import type { IDayMetadata } from "src/types";

  import Dot from "./Dot.svelte";

  export let metadata: IDayMetadata[];
</script>

<div class="dot-container">
  {#each metadata as { color, display, dots = [] }}
    {#if display === "calendar-and-menu"}
      {#each dots as dot}
        <Dot {...dot} color="{color}" />
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
