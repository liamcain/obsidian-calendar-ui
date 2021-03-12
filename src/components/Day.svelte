<svelte:options immutable />

<script lang="ts">
  import type { Moment } from "moment";
  import { getDateUID } from "obsidian-daily-notes-interface";
  import { createEventDispatcher } from "svelte";

  import Dots from "./Dots.svelte";
  import MetadataResolver from "./MetadataResolver.svelte";
  import type { IDayMetadata } from "../types";
  import { isMetaPressed } from "../utils";

  // Properties
  export let date: Moment;
  export let metadata: Promise<IDayMetadata[]> | null;
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

  const dispatch = createEventDispatcher();
  let dayEl: HTMLElement;

  // window.app.dragManager.handleDrag(foo, (e) => window.app.dragManager.dragFile(e, ))

  function handleHover(event: PointerEvent, meta: IDayMetadata) {
    onHover?.(date, event.target, isMetaPressed(event));
    dispatch("hoverDay", {
      date,
      metadata: meta,
      target: event.target,
    });
  }

  function endHover(event: PointerEvent) {
    dispatch("endHoverDay", {
      target: event.target,
    });
  }
</script>

<td>
  <MetadataResolver metadata="{metadata}" let:metadata>
    <div
      bind:this="{dayEl}"
      class="day"
      class:active="{selectedId === getDateUID(date, 'day')}"
      class:adjacent-month="{!date.isSame(displayedMonth, 'month')}"
      class:today="{date.isSame(today, 'day')}"
      on:click="{onClick && ((e) => onClick(date, isMetaPressed(e)))}"
      on:contextmenu="{onContextMenu && ((e) => onContextMenu(date, e))}"
      on:pointerenter="{(event) => handleHover(event, metadata)}"
      on:pointerleave="{endHover}"
    >
      {date.format("D")}
      <Dots metadata="{metadata}" />
    </div>
  </MetadataResolver>
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

  .day:active,
  .active,
  .active.today {
    color: var(--text-on-accent);
    background-color: var(--interactive-accent);
  }
</style>
