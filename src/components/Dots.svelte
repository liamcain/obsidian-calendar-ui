<script lang="ts">
  import { getDots } from "src/metadata";
  import type { IDayMetadata } from "src/types";

  import Dot from "./Dot.svelte";

  export let metadata: IDayMetadata[];
</script>

<div class="dot-container">
  {#each metadata as entry}
    {#each getDots(entry) as dot}
      <Dot {...dot} />
    {/each}
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
