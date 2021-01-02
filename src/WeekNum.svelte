<script lang="ts">
  import type { Moment } from "moment";
  import type {TFile } from 'obsidian';

  import Dot from "./Dot.svelte";
  import { getStartOfWeek, isMetaPressed } from "./utils";
  import type { IWeekMetadata } from "./types";

    // Properties
  export let weekNum: number;
  export let days: Moment[];
  export let note: TFile;
  export let onHover: (date: Moment, targetEl: EventTarget) => void;
  export let onClick: (date: Moment, isMetaPressed: boolean) => void;
  export let metadata: Promise<IWeekMetadata> | null;

  // Global state
  export let activeFile: TFile = null;

  let startOfWeek: Moment;
  $: startOfWeek = getStartOfWeek(days);
</script>

<svelte:options immutable />
<td>
  <div
    class="week-num"
    class:has-note={!!note}
    class:active="{activeFile && activeFile === note}"
    on:click="{(e) => {
      onClick(startOfWeek, isMetaPressed(e));
    }}"
    on:pointerover="{(e) => {
      if (isMetaPressed(e)) {
        onHover(startOfWeek, e.target);
      }
    }}"
  >
    {weekNum}
    <div class="dot-container">
      {#if metadata}
        {#await metadata then resolvedMeta}
          {#each resolvedMeta.dots as dot}
            <Dot {...dot} />
          {/each}
        {/await}
      {/if}
    </div>
  </div>
</td>

<style>
  .week-num {
    background-color: var(--color-background-weeknum);
    border-radius: 4px;
    color: var(--color-text-weeknum);
    cursor: pointer;
    font-size: 0.65em;
    height: 100%;
    padding: 4px;
    text-align: center;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;
    vertical-align: baseline;
  }

  td {
    border-right: 1px solid var(--background-modifier-border);
  }

  .week-num:hover {
    background-color: var(--interactive-hover);
  }

  .week-num.active:hover {
    background-color: var(--interactive-accent-hover);
  }

  .active {
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
  }

  .dot-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    line-height: 6px;
    min-height: 6px;
  }
</style>
