<script lang="ts">
  import type { Moment } from "moment";
  import { getDateUID } from "obsidian-daily-notes-interface";

  import Dot from "./Dot.svelte";
  import type { IDayMetadata } from "../types";
  import { getStartOfWeek, isMetaPressed } from "../utils";

  // Properties
  export let weekNum: number;
  export let days: Moment[];
  export let onHover: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClick: (date: Moment, isMetaPressed: boolean) => boolean;
  export let metadata: Promise<IDayMetadata> | null;

  // Global state;
  export let selectedId: string = null;

  let startOfWeek: Moment;
  $: startOfWeek = getStartOfWeek(days);
</script>

<svelte:options immutable />
<td>
  {#if metadata}
    {#await metadata then resolvedMeta}
      <div
        class="{`week-num ${resolvedMeta.classes.join(' ')}`}"
        class:selected="{selectedId === getDateUID(days[0], 'week')}"
        on:click="{(e) => onClick(startOfWeek, isMetaPressed(e))}"
        on:pointerover="{(e) => onHover(startOfWeek, e.target, isMetaPressed(e))}"
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
    {/await}
  {:else}
    <div
      class="week-num"
      on:click="{(e) => (typeof onClick === 'function' ? onClick(startOfWeek, isMetaPressed(e)) : undefined)}"
      on:pointerover="{(e) => (typeof onHover === 'function' ? onHover(startOfWeek, e.target, isMetaPressed(e)) : undefined)}"
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
  {/if}
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

  .week-num.selected:hover {
    background-color: var(--interactive-accent-hover);
  }

  .selected {
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
