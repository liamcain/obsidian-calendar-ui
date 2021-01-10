<script lang="ts">
  import type { Moment } from "moment";
  import { getDateUID } from "obsidian-daily-notes-interface";

  import Dot from "./Dot.svelte";
  import type { IDayMetadata } from "../types";
  import { isMetaPressed } from "../utils";

  // Properties
  export let date: Moment;
  export let metadata: IDayMetadata | null;
  export let onHover: (
    date: Moment,
    targetEl: EventTarget,
    isMetaPressed: boolean
  ) => boolean;
  export let onClick: (date: Moment, isMetaPressed: boolean) => boolean;
  export let onContextMenu: (date: Moment, event: MouseEvent) => boolean;

  // Global state
  export let today: Moment;
  export let displayedMonth: Moment = null;
  export let selectedId: string = null;
</script>

<svelte:options immutable />
<div
  class="{`day ${metadata.classes.join(' ')}`}"
  class:selected="{selectedId === getDateUID(date, 'day')}"
  class:adjacent-month="{!date.isSame(displayedMonth, 'month')}"
  class:today="{date.isSame(today, 'day')}"
  on:click="{onClick && ((e) => onClick(date, isMetaPressed(e)))}"
  on:contextmenu="{onContextMenu && ((e) => onContextMenu(date, e))}"
  on:pointerover="{onHover && ((e) => onHover(date, e.target, isMetaPressed(e)))}"
>
  {date.format('D')}
  <div class="dot-container">
    {#each metadata.dots as dot}
      <Dot {...dot} />
    {/each}
  </div>
</div>

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

  .day.selected:hover {
    background-color: var(--interactive-accent-hover);
  }

  .adjacent-month {
    opacity: 0.25;
  }

  .today {
    color: var(--color-text-today);
  }

  .day:active,
  .selected,
  .selected.today {
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
