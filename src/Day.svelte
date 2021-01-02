<script lang="ts">
  import type { Moment } from "moment";
  import type { TFile } from 'obsidian';

  import Dot from "./Dot.svelte";
  import type { IDayMetadata } from "./types";
  import { isMetaPressed } from "./utils";

  // Properties
  export let note: TFile | null;
  export let date: Moment;
  export let metadata: Promise<IDayMetadata> | null;
  export let onHover: (date: Moment, targetEl: EventTarget) => void;
  export let onClick: (date: Moment, isMetaPressed: boolean) => void;

  // Global state
  export let today: Moment;
  export let displayedMonth: Moment = null;
  export let activeFile: TFile = null;
</script>

<svelte:options immutable />
<td>
  <div
    class="day"
    class:has-note={!!note}
    class:adjacent-month="{!date.isSame(displayedMonth, 'month')}"
    class:active="{activeFile && activeFile === note}"
    class:today="{date.isSame(today, 'day')}"
    on:click="{(e) => {
      onClick(date, isMetaPressed(e));
    }}"
    on:pointerover="{(e) => {
      if (isMetaPressed(e)) {
        onHover(date, e.target);
      }
    }}"
  >
    {date.format('D')}
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
  .day {
    background-color: var(--color-background-day);
    border-radius: 4px;
    color: var(--color-text-day);
    cursor: pointer;
    font-size: 0.8em;
    height: 100%;
    padding: 4px;
    position: relative;
    text-align: center;
    transition: background-color 0.1s ease-in, color 0.1s ease-in;
    vertical-align: baseline;
  }
  .day:hover {
    background-color: var(--interactive-hover);
  }

  .day.active:hover {
    background-color: var(--interactive-accent-hover);
  }

  .adjacent-month {
    opacity: 0.25;
  }

  .today {
    color: var(--color-text-today);
  }

  .active,
  .active.today {
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
